import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const conversationsRouter = router({
  // Get all conversations for user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    return await db.getUserConversations(ctx.user.id);
  }),

  // Get conversation with messages
  getById: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const conversation = await db.getConversationById(input.conversationId, ctx.user.id);
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversa não encontrada",
        });
      }

      const messages = await db.getConversationMessages(input.conversationId);
      return {
        ...conversation,
        messages,
      };
    }),

  // Create new conversation
  create: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      await db.createConversation({
        userId: ctx.user.id,
        title: input.title,
      });

      return {
        success: true,
        message: "Conversa criada com sucesso",
      };
    }),

  // Add message to conversation
  addMessage: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const conversation = await db.getConversationById(input.conversationId, ctx.user.id);
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversa não encontrada",
        });
      }

      await db.addConversationMessage({
        conversationId: input.conversationId,
        userId: ctx.user.id,
        role: input.role,
        content: input.content,
      });

      return {
        success: true,
        message: "Mensagem adicionada com sucesso",
      };
    }),

  // Delete conversation
  delete: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const conversation = await db.getConversationById(input.conversationId, ctx.user.id);
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversa não encontrada",
        });
      }

      await db.deleteConversation(input.conversationId, ctx.user.id);

      return {
        success: true,
        message: "Conversa deletada com sucesso",
      };
    }),
});
