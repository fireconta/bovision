import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { pins, devices, licenses, sessions, adminLogs } from "../../drizzle/schema";
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

function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}

// ============================================================
// DEVICE ID GENERATION
// ============================================================
function generateDeviceId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "BV-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// ============================================================
// ROUTER
// ============================================================
export const pinAuthRouter = router({
  // Create new PIN (first time setup)
  createPin: publicProcedure
    .input(z.object({
      pin: z.string().length(6),
      confirmPin: z.string().length(6),
      deviceId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indisponível" });

      // Validate PIN security
      const validation = validatePinSecurity(input.pin);
      if (!validation.valid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: validation.reason });
      }

      // Verify PINs match
      if (input.pin !== input.confirmPin) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Os PINs não correspondem." });
      }

      // Create or get device
      let deviceId = input.deviceId || generateDeviceId();
      const existingDevice = await (db.query as any).devices.findFirst({
        where: eq(devices.deviceId, deviceId),
      });

      if (existingDevice) {
        throw new TRPCError({ code: "CONFLICT", message: "Dispositivo já registrado." });
      }

      // Create device
      await db.insert(devices).values({
        userId: 0,
        deviceId,
        userAgent: "web",
        ipAddress: "0.0.0.0",
      });

      // Create PIN record
      const pinHash = hashPin(input.pin);
      await db.insert(pins).values({
        userId: 0,
        deviceId,
        pinHash,
        attempts: 0,
      });

      // Create trial license
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      await db.insert(licenses).values({
        userId: 0,
        plan: "trial",
        expirationDate,
        status: "active",
        isTrial: true,
        isActive: true,
      });

      return {
        success: true,
        deviceId,
        message: "PIN criado com sucesso! Você tem 30 dias de trial.",
      };
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

      // Find device
      const device = await (db.query as any).devices.findFirst({
        where: eq(devices.deviceId, input.deviceId),
      });

      if (!device) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dispositivo não encontrado." });
      }

      // Find PIN record
      const pinRecord = await (db.query as any).pins.findFirst({
        where: eq(pins.deviceId, input.deviceId),
      });

      if (!pinRecord) {
        throw new TRPCError({ code: "NOT_FOUND", message: "PIN não configurado." });
      }

      // Check if locked
      if (pinRecord.lockedUntil && new Date() < pinRecord.lockedUntil) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Dispositivo bloqueado por múltiplas tentativas. Tente novamente mais tarde.",
        });
      }

      // Verify PIN
      if (!verifyPin(input.pin, pinRecord.pinHash)) {
        const newAttempts = (pinRecord.attempts || 0) + 1;
        let lockedUntil = null;

        if (newAttempts >= 5) {
          lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        }

        await db.update(pins).set({
          attempts: newAttempts,
          lockedUntil,
        }).where(eq(pins.deviceId, input.deviceId));

        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `PIN incorreto. Tentativas restantes: ${5 - newAttempts}`,
        });
      }

      // Reset attempts on success
      await db.update(pins).set({
        attempts: 0,
        lockedUntil: null,
      }).where(eq(pins.deviceId, input.deviceId));

      // Check license status
      const license = await (db.query as any).licenses.findFirst({
        where: eq(licenses.userId, device.userId),
      });

      if (!license || license.status !== "active") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Sua licença expirou. Renove para continuar.",
        });
      }

      if (license.expirationDate < new Date() && !license.isTrial) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Sua assinatura expirou. Renove para continuar.",
        });
      }

      // Create session
      const sessionToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

      await db.insert(sessions).values({
        userId: device.userId,
        deviceId: input.deviceId,
        sessionToken,
        expiresAt,
        ipAddress: "0.0.0.0",
      });

      // Update device last accessed
      await db.update(devices).set({
        lastAccessed: new Date(),
      }).where(eq(devices.deviceId, input.deviceId));

      return {
        success: true,
        sessionToken,
        expiresAt,
        plan: license.plan,
        isPremium: license.plan !== "trial",
        message: "Login bem-sucedido!",
      };
    }),

  // Check device status
  getDeviceStatus: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { exists: false, status: "not_found" };

      const device = await (db.query as any).devices.findFirst({
        where: eq(devices.deviceId, input.deviceId),
      });

      if (!device) {
        return { exists: false, status: "not_found" };
      }

      const license = await (db.query as any).licenses.findFirst({
        where: eq(licenses.userId, device.userId),
      });

      const pinRecord = await (db.query as any).pins.findFirst({
        where: eq(pins.deviceId, input.deviceId),
      });

      return {
        exists: true,
        status: license?.status || "no_license",
        plan: license?.plan,
        isPremium: license?.plan !== "trial",
        isLocked: pinRecord?.lockedUntil ? new Date() < pinRecord.lockedUntil : false,
        trialEndsAt: license?.expirationDate,
      };
    }),

  // Admin: Block device
  blockDevice: protectedProcedure
    .input(z.object({ deviceId: z.string(), reason: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indisponível" });

      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas admins podem bloquear dispositivos." });
      }

      const device = await (db.query as any).devices.findFirst({
        where: eq(devices.deviceId, input.deviceId),
      });

      if (!device) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dispositivo não encontrado." });
      }

      await db.update(licenses).set({
        status: "cancelled",
        isActive: false,
      }).where(eq(licenses.userId, device.userId));

      await db.insert(adminLogs).values({
        adminId: ctx.user.id,
        targetUserId: device.userId,
        action: "block_device",
        details: JSON.stringify({ deviceId: input.deviceId, reason: input.reason }),
      });

      return { success: true, message: "Dispositivo bloqueado com sucesso." };
    }),

  // Admin: Unblock device
  unblockDevice: protectedProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banco de dados indisponível" });

      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas admins podem desbloquear dispositivos." });
      }

      const device = await (db.query as any).devices.findFirst({
        where: eq(devices.deviceId, input.deviceId),
      });

      if (!device) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dispositivo não encontrado." });
      }

      await db.update(licenses).set({
        status: "active",
        isActive: true,
      }).where(eq(licenses.userId, device.userId));

      await db.insert(adminLogs).values({
        adminId: ctx.user.id,
        targetUserId: device.userId,
        action: "unblock_device",
        details: JSON.stringify({ deviceId: input.deviceId }),
      });

      return { success: true, message: "Dispositivo desbloqueado com sucesso." };
    }),
});
