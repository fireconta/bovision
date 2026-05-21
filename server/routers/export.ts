import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

// Helper function to convert data to CSV
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(",");
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || "";
    }).join(",");
  });
  return [headerRow, ...dataRows].join("\n");
}

export const exportRouter = router({
  // Export animals to CSV
  exportAnimals: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    const animals = await db.getUserAnimals(ctx.user.id);
    
    if (animals.length === 0) {
      return {
        success: false,
        message: "Nenhum animal para exportar",
      };
    }

    const headers = ["id", "name", "breed", "age", "sex", "currentWeight", "healthStatus", "vacinationStatus"];
    const csv = convertToCSV(animals, headers);

    return {
      success: true,
      data: csv,
      filename: `animals_${new Date().toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv",
    };
  }),

  // Export financial records to CSV
  exportFinancial: protectedProcedure
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

      const records = await db.getFinancialRecords(ctx.user.id, startDate, endDate);

      if (records.length === 0) {
        return {
          success: false,
          message: "Nenhum registro financeiro para exportar",
        };
      }

      const headers = ["id", "type", "category", "amount", "description", "date"];
      const csv = convertToCSV(records, headers);

      return {
        success: true,
        data: csv,
        filename: `financial_${new Date().toISOString().split("T")[0]}.csv`,
        mimeType: "text/csv",
      };
    }),

  // Export herd statistics to CSV
  exportHerdStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado",
      });
    }

    const stats = await db.getAnimalStats(ctx.user.id);

    if (!stats) {
      return {
        success: false,
        message: "Nenhuma estatística para exportar",
      };
    }

    const data = [stats];
    const headers = ["totalAnimals", "averageWeight", "healthyCount", "sickCount", "vaccinatedCount"];
    const csv = convertToCSV(data, headers);

    return {
      success: true,
      data: csv,
      filename: `herd_stats_${new Date().toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv",
    };
  }),

  // Export financial summary to CSV
  exportFinancialSummary: protectedProcedure
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

      const summary = await db.getFinancialSummary(ctx.user.id, startDate, endDate);

      if (!summary) {
        return {
          success: false,
          message: "Nenhum resumo financeiro para exportar",
        };
      }

      // Flatten the summary for CSV export
      const flatData = {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        profit: summary.profit,
        profitMargin: summary.profitMargin,
        recordCount: summary.recordCount,
      };

      const data = [flatData];
      const headers = Object.keys(flatData);
      const csv = convertToCSV(data, headers);

      return {
        success: true,
        data: csv,
        filename: `financial_summary_${new Date().toISOString().split("T")[0]}.csv`,
        mimeType: "text/csv",
      };
    }),
});
