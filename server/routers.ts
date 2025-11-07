import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createDocumentRecord, getAllDocumentRecords, getDocumentRecordById } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  documentRecords: router({
    create: protectedProcedure
      .input(z.object({
        requestedBy: z.string().min(1),
        requestedByOther: z.string().optional(),
        documentType: z.enum(["PDF", "ONLINE"]),
        onlinePlatform: z.string().optional(),
        signedBy: z.string().min(1),
        signedByOther: z.string().optional(),
        signatureDate: z.date(),
        responsible: z.string().min(1),
        responsibleOther: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const record = await createDocumentRecord({
          ...input,
          createdBy: ctx.user.id,
        });
        return record;
      }),

    list: protectedProcedure.query(async () => {
      return await getAllDocumentRecords();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getDocumentRecordById(input.id);
      }),

    exportCSV: protectedProcedure.query(async () => {
      const records = await getAllDocumentRecords();
      
      // Create CSV header
      const headers = [
        "ID",
        "Solicitado Por",
        "Tipo Documento",
        "Plataforma Online",
        "Assinatura de",
        "Data",
        "Responsável",
        "Criado em"
      ];
      
      // Create CSV rows
      const rows = records.map(record => {
        const requestedBy = record.requestedBy === "OUTRO" ? record.requestedByOther : record.requestedBy;
        const signedBy = record.signedBy === "OUTRO" ? record.signedByOther : record.signedBy;
        const responsible = record.responsible === "OUTRO" ? record.responsibleOther : record.responsible;
        const platform = record.documentType === "ONLINE" ? record.onlinePlatform : "N/A";
        
        return [
          record.id,
          requestedBy,
          record.documentType,
          platform,
          signedBy,
          record.signatureDate.toISOString().split('T')[0],
          responsible,
          record.createdAt.toISOString().split('T')[0]
        ];
      });
      
      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");
      
      return { content: csvContent };
    }),
  }),
});

export type AppRouter = typeof appRouter;
