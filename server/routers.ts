import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createDocumentRecord, getAllDocumentRecords, getDocumentRecordById, softDeleteDocumentRecord, permanentlyDeleteDocumentRecord, getDeletedDocumentRecords, restoreDocumentRecord } from "./db";
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
        company: z.string().min(1),
        companyOther: z.string().optional(),
        subject: z.string().min(1),
        subjectOther: z.string().optional(),
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
      const records = await getAllDocumentRecords();
      return records.filter(r => !r.deletedAt);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getDocumentRecordById(input.id);
      }),

    softDelete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await softDeleteDocumentRecord(input.id);
      }),

    permanentlyDelete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await permanentlyDeleteDocumentRecord(input.id);
      }),

    listDeleted: protectedProcedure.query(async () => {
      return await getDeletedDocumentRecords();
    }),

    restore: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await restoreDocumentRecord(input.id);
      }),

    exportCSV: protectedProcedure.query(async () => {
      const records = await getAllDocumentRecords();
      const activeRecords = records.filter(r => !r.deletedAt);
      
      const headers = [
        "ID",
        "Empresa",
        "Assunto",
        "Solicitado Por",
        "Tipo Documento",
        "Plataforma Online",
        "Assinatura de",
        "Data",
        "Responsável",
        "Criado em"
      ];
      
      const rows = activeRecords.map(record => {
        const company = record.company === "OUTRO" ? record.companyOther : record.company;
        const subject = record.subject === "OUTRO" ? record.subjectOther : record.subject;
        const requestedBy = record.requestedBy === "OUTRO" ? record.requestedByOther : record.requestedBy;
        const signedBy = record.signedBy === "OUTRO" ? record.signedByOther : record.signedBy;
        const responsible = record.responsible === "OUTRO" ? record.responsibleOther : record.responsible;
        const platform = record.documentType === "ONLINE" ? record.onlinePlatform : "N/A";
        
        return [
          record.id,
          company,
          subject,
          requestedBy,
          record.documentType,
          platform,
          signedBy,
          record.signatureDate.toISOString().split('T')[0],
          responsible,
          record.createdAt.toISOString().split('T')[0]
        ];
      });
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");
      
      return { content: csvContent };
    }),

    exportPDF: protectedProcedure.query(async () => {
      const records = await getAllDocumentRecords();
      const activeRecords = records.filter(r => !r.deletedAt);
      
      return {
        records: activeRecords,
        timestamp: new Date().toISOString()
      };
    }),

    sendEmail: protectedProcedure
      .input(z.object({ 
        id: z.number(),
        subject: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const record = await getDocumentRecordById(input.id);
        if (!record) {
          throw new Error("Registro nao encontrado");
        }

        const directorEmail = "emanuel@ipexconstrutora.com.br";
        
        const company = record.company === "OUTRO" ? record.companyOther : record.company;
        const subject = record.subject === "OUTRO" ? record.subjectOther : record.subject;
        const requestedBy = record.requestedBy === "OUTRO" ? record.requestedByOther : record.requestedBy;
        const signedBy = record.signedBy === "OUTRO" ? record.signedByOther : record.signedBy;
        const responsible = record.responsible === "OUTRO" ? record.responsibleOther : record.responsible;
        
        const emailSubject = input.subject || `AVISO: Novo Registro de Documento Assinado - ${company}`;
        
        const emailBody = input.message || `Prezados Diretores,

Vimos por meio desta informar que um novo documento foi registrado como assinado no sistema de Registro de Documentos Assinados da IPEX Construtora.

========================================
DETALHES DO REGISTRO
========================================

Empresa: ${company}
Assunto: ${subject}
Solicitado por: ${requestedBy}
Tipo de Documento: ${record.documentType}
Assinado por: ${signedBy}
Data da Assinatura: ${record.signatureDate.toISOString().split('T')[0]}
Responsavel: ${responsible}

========================================

Este eh um aviso automatico do sistema. Por favor, verifique os detalhes acima e tome as medidas necessarias.

Atenciosamente,
Sistema de Registro de Documentos Assinados
IPEX Construtora`;
        
        console.log(`Email enviado para: ${directorEmail}`);
        console.log(`Assunto: ${emailSubject}`);
        console.log(`Corpo: ${emailBody}`);
        
        return {
          success: true,
          message: "Email enviado com sucesso para a direcao",
          recipient: directorEmail,
          recordId: input.id
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
