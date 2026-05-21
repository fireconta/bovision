import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const herdRouter = router({
  // Get all animals
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    return await db.getUserAnimals(ctx.user.id);
  }),

  // Get animal by ID
  getById: protectedProcedure
    .input(z.object({ animalId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const animal = await db.getAnimalById(input.animalId, ctx.user.id);
      if (!animal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Animal não encontrado",
        });
      }

      const weights = await db.getAnimalWeights(input.animalId);
      const vaccines = await db.getAnimalVaccines(input.animalId);

      return {
        ...animal,
        weights,
        vaccines,
      };
    }),

  // Search animals
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      return await db.searchAnimals(ctx.user.id, input.query);
    }),

  // Filter animals
  filter: protectedProcedure
    .input(z.object({
      breed: z.string().optional(),
      sex: z.enum(["male", "female"]).optional(),
      healthStatus: z.enum(["healthy", "sick", "treatment"]).optional(),
      vacinationStatus: z.enum(["up_to_date", "pending", "overdue"]).optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      return await db.filterAnimals(ctx.user.id, input);
    }),

  // Get herd statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    return await db.getAnimalStats(ctx.user.id);
  }),

  // Create animal
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      breed: z.string(),
      age: z.number().optional(),
      sex: z.enum(["male", "female"]).optional(),
      currentWeight: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      await db.createAnimal({
        userId: ctx.user.id,
        name: input.name,
        breed: input.breed,
        age: input.age,
        sex: input.sex,
        currentWeight: input.currentWeight,
      });

      return {
        success: true,
        message: "Animal criado com sucesso",
      };
    }),

  // Add weight record
  addWeight: protectedProcedure
    .input(z.object({
      animalId: z.number(),
      weight: z.number(),
      method: z.enum(["manual", "ai_camera", "scale"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const animal = await db.getAnimalById(input.animalId, ctx.user.id);
      if (!animal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Animal não encontrado",
        });
      }

      await db.addWeight({
        userId: ctx.user.id,
        animalId: input.animalId,
        weight: input.weight,
        method: input.method || "manual",
      });

      return {
        success: true,
        message: "Peso registrado com sucesso",
      };
    }),

  // Add vaccine record
  addVaccine: protectedProcedure
    .input(z.object({
      animalId: z.number(),
      vaccineName: z.string(),
      vaccinationDate: z.string(),
      nextDueDate: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        });
      }

      const animal = await db.getAnimalById(input.animalId, ctx.user.id);
      if (!animal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Animal não encontrado",
        });
      }

      await db.addVaccine({
        userId: ctx.user.id,
        animalId: input.animalId,
        vaccineName: input.vaccineName,
        vaccinationDate: input.vaccinationDate,
        nextDueDate: input.nextDueDate,
      });

      return {
        success: true,
        message: "Vacinação registrada com sucesso",
      };
    }),
});
