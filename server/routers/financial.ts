import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const financialRouter = router({
  // Get all financial records
  getRecords: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const startDate = input.startDate ? new Date(input.startDate) : undefined;
      const endDate = input.endDate ? new Date(input.endDate) : undefined;

      return await db.getFinancialRecords(ctx.user.id, startDate, endDate);
    }),

  // Get financial summary
  getSummary: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const startDate = input.startDate ? new Date(input.startDate) : undefined;
      const endDate = input.endDate ? new Date(input.endDate) : undefined;

      return await db.getFinancialSummary(ctx.user.id, startDate, endDate);
    }),

  // Add financial record
  addRecord: protectedProcedure
    .input(z.object({
      type: z.enum(["income", "expense"]),
      category: z.string(),
      amount: z.number().positive(),
      description: z.string().optional(),
      date: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      await db.addFinancialRecord({
        userId: ctx.user.id,
        type: input.type,
        category: input.category,
        amount: input.amount,
        description: input.description,
        date: new Date(input.date),
      });

      return {
        success: true,
        message: "Registro financeiro adicionado com sucesso",
      };
    }),

  // Delete financial record
  deleteRecord: protectedProcedure
    .input(z.object({ recordId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      await db.deleteFinancialRecord(input.recordId, ctx.user.id);

      return {
        success: true,
        message: "Registro financeiro deletado com sucesso",
      };
    }),
});
