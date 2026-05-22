import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { pins, devices, licenses } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// ============================================================
// PIN VALIDATION (Banking-grade security)
// ============================================================
function validatePinSecurity(pin: string): { valid: boolean; reason?: string } {
  if (!/^\d{6}$/.test(pin)) return { valid: false, reason: "O PIN deve ter exatamente 6 dígitos numéricos." };

  const digits = pin.split("").map(Number);

  // Rule 1: All same digit
  if (digits.every(d => d === digits[0])) {
    return { valid: false, reason: "PIN muito fraco: não use todos os dígitos iguais." };
  }

  // Rule 2: Sequential ascending
  const isAscSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! + 1);
  if (isAscSeq) return { valid: false, reason: "PIN muito fraco: não use sequências crescentes." };

  // Rule 3: Sequential descending
  const isDescSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! - 1);
  if (isDescSeq) return { valid: false, reason: "PIN muito fraco: não use sequências decrescentes." };

  // Rule 4: Known weak patterns
  const knownWeak = ["123456", "654321", "112233", "332211", "445566", "665544", "000000", "999999"];
  if (knownWeak.includes(pin)) {
    return { valid: false, reason: "Este PIN é muito comum e não é permitido." };
  }

  // Rule 5: Max 3 consecutive same digits
  for (let i = 0; i < digits.length - 2; i++) {
    if (digits[i] === digits[i + 1] && digits[i + 1] === digits[i + 2]) {
      return { valid: false, reason: "PIN fraco: não use 3 ou mais dígitos iguais seguidos." };
    }
  }

  // Rule 6: Max 4 of the same digit in total
  const freq: Record<number, number> = {};
  for (const d of digits) freq[d] = (freq[d] || 0) + 1;
  if (Math.max(...Object.values(freq)) >= 4) {
    return { valid: false, reason: "PIN fraco: um mesmo dígito não pode aparecer 4 ou mais vezes." };
  }

  return { valid: true };
}

// ============================================================
// PIN HASHING
// ============================================================
function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

function generateDeviceId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "BV-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ============================================================
// PIN AUTH ROUTER
// ============================================================
export const pinAuthRouter = router({
  // Create PIN for new device
  createPin: publicProcedure
    .input(z.object({
      pin: z.string().length(6),
      confirmPin: z.string().length(6),
      deviceId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Validate PIN strength
      const validation = validatePinSecurity(input.pin);
      if (!validation.valid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: validation.reason });
      }

      // Confirm PIN matches
      if (input.pin !== input.confirmPin) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Os PINs não correspondem." });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indisponível" });

      // Generate device ID
      let deviceId = input.deviceId || generateDeviceId();

      try {
        // Create device
        await (db as any).insert(devices).values({
          userId: 0,
          deviceId,
          userAgent: "web",
          ipAddress: "0.0.0.0",
        });

        // Create PIN record
        const pinHash = hashPin(input.pin);
        await (db as any).insert(pins).values({
          userId: 0,
          deviceId,
          pinHash,
          attempts: 0,
        });

        // Create trial license
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        await (db as any).insert(licenses).values({
          userId: 0,
          plan: "trial",
          expirationDate,
          status: "active",
          isTrial: true,
          isActive: true,
        });

        // Generate session token for automatic login
        const sessionToken = crypto.randomBytes(32).toString("hex");

        return {
          success: true,
          deviceId,
          sessionToken,
          message: "PIN criado com sucesso! Você tem 30 dias de trial.",
        };
      } catch (error: any) {
        if (error.message?.includes("Duplicate entry")) {
          throw new TRPCError({ code: "CONFLICT", message: "Dispositivo já registrado." });
        }
        throw error;
      }
    }),

  // Verify PIN and create session
  verifyPin: publicProcedure
    .input(z.object({
      pin: z.string().length(6),
      deviceId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indisponível" });

      try {
        // Find device
        const device = await (db as any).query.devices.findFirst({
          where: eq(devices.deviceId, input.deviceId),
        });

        if (!device) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Dispositivo não encontrado." });
        }

        // Find PIN record
        const pinRecord = await (db as any).query.pins.findFirst({
          where: eq(pins.deviceId, input.deviceId),
        });

        if (!pinRecord) {
          throw new TRPCError({ code: "NOT_FOUND", message: "PIN não configurado para este dispositivo." });
        }

        // Check if locked
        if (pinRecord.lockedUntil && new Date(pinRecord.lockedUntil) > new Date()) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Dispositivo bloqueado. Tente novamente mais tarde." });
        }

        // Verify PIN
        const pinHash = hashPin(input.pin);
        if (pinHash !== pinRecord.pinHash) {
          // Increment attempts
          const newAttempts = (pinRecord.attempts || 0) + 1;
          const isLocked = newAttempts >= 5;

          await (db as any).update(pins).set({
            attempts: newAttempts,
            lockedUntil: isLocked ? new Date(Date.now() + 15 * 60 * 1000) : null,
          }).where(eq(pins.deviceId, input.deviceId));

          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: isLocked ? "Muitas tentativas. Dispositivo bloqueado por 15 minutos." : `PIN incorreto. Tentativas restantes: ${5 - newAttempts}`,
          });
        }

        // Reset attempts on success
        await (db as any).update(pins).set({
          attempts: 0,
          lockedUntil: null,
        }).where(eq(pins.deviceId, input.deviceId));

        // Check license status
        const license = await (db as any).query.licenses.findFirst({
          where: eq(licenses.userId, device.userId),
        });

        if (!license || license.status !== "active") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Licença inativa ou expirada." });
        }

        return {
          success: true,
          deviceId: input.deviceId,
          message: "PIN verificado com sucesso!",
          sessionToken: crypto.randomBytes(32).toString("hex"),
        };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao verificar PIN" });
      }
    }),

  // Get device status
  getDeviceStatus: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { exists: false, status: "not_found" };

      try {
        const device = await (db as any).query.devices.findFirst({
          where: eq(devices.deviceId, input.deviceId),
        });

        if (!device) {
          return { exists: false, status: "not_found" };
        }

        const license = await (db as any).query.licenses.findFirst({
          where: eq(licenses.userId, device.userId),
        });

        const pinRecord = await (db as any).query.pins.findFirst({
          where: eq(pins.deviceId, input.deviceId),
        });

        return {
          exists: true,
          status: license?.status || "no_license",
          isLocked: pinRecord?.lockedUntil ? new Date(pinRecord.lockedUntil) > new Date() : false,
          plan: license?.plan || "none",
        };
      } catch {
        return { exists: false, status: "error" };
      }
    }),

  // Admin: Block device
  blockDevice: protectedProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indisponível" });

      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas admins podem bloquear dispositivos." });
      }

      try {
        const device = await (db as any).query.devices.findFirst({
          where: eq(devices.deviceId, input.deviceId),
        });

        if (!device) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Dispositivo não encontrado." });
        }

        await (db as any).update(licenses).set({
          status: "cancelled",
        }).where(eq(licenses.userId, device.userId));

        return { success: true, message: "Dispositivo bloqueado com sucesso." };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao bloquear dispositivo" });
      }
    }),

  // Admin: Unblock device
  unblockDevice: protectedProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indisponível" });

      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas admins podem desbloquear dispositivos." });
      }

      try {
        const device = await (db as any).query.devices.findFirst({
          where: eq(devices.deviceId, input.deviceId),
        });

        if (!device) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Dispositivo não encontrado." });
        }

        await (db as any).update(licenses).set({
          status: "active",
        }).where(eq(licenses.userId, device.userId));

        return { success: true, message: "Dispositivo desbloqueado com sucesso." };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Erro ao desbloquear dispositivo" });
      }
    }),
});
