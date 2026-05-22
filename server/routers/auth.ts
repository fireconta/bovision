import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { COOKIE_NAME } from "../../shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import type { TrpcContext } from "../_core/context";



// ============================================================
// HELPERS
// ============================================================
function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

function validatePinSecurity(pin: string): { valid: boolean; reason?: string } {
  if (!/^\d{6}$/.test(pin)) return { valid: false, reason: "PIN deve ter 6 dígitos" };

  const digits = pin.split("").map(Number);

  // All same digit
  if (digits.every(d => d === digits[0])) {
    return { valid: false, reason: "PIN muito fraco: não use dígitos iguais" };
  }

  // Sequential
  const isAscSeq = digits.every((d, i) => i === 0 || d === digits[i - 1]! + 1);
  if (isAscSeq) return { valid: false, reason: "PIN muito fraco: não use sequências" };

  // Known weak
  const knownWeak = ["123456", "654321", "112233", "000000", "999999"];
  if (knownWeak.includes(pin)) {
    return { valid: false, reason: "Este PIN é muito comum" };
  }

  return { valid: true };
}

// ============================================================
// ROUTER
// ============================================================
export const authRouter = router({
  // Get current user
  me: publicProcedure.query(opts => opts.ctx.user),

  // Logout
  logout: publicProcedure.mutation(({ ctx }: { ctx: TrpcContext }) => {
    // Clear session cookie
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),

  // Create PIN for new device
  createPin: publicProcedure
    .input(z.object({
      deviceId: z.string().regex(/^BV-[A-Z0-9]{8}$/),
      pin: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const validation = validatePinSecurity(input.pin);
      if (!validation.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: validation.reason,
        });
      }

      // Store PIN in localStorage on client side
      return {
        success: true,
        deviceId: input.deviceId,
        message: "PIN criado com sucesso",
      };
    }),

  // Verify PIN for login
  verifyPin: publicProcedure
    .input(z.object({
      deviceId: z.string().regex(/^BV-[A-Z0-9]{8}$/),
      pin: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const validation = validatePinSecurity(input.pin);
      if (!validation.valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "PIN incorreto",
        });
      }

      // Create session
      const session = await db.createSession({
        deviceId: input.deviceId,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      });

      return {
        success: true,
        sessionToken: session.sessionToken,
        expiresAt: session.expiresAt,
      };
    }),

  // Get device info
  getDevice: publicProcedure
    .input(z.object({
      deviceId: z.string(),
    }))
    .query(async ({ input }) => {
      const device = await db.getDeviceByDeviceId(input.deviceId);
      if (!device) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dispositivo não encontrado",
        });
      }

      return {
        deviceId: device.deviceId,
        createdAt: device.createdAt,
        lastAccessed: device.lastAccessed,
      };
    }),
});
