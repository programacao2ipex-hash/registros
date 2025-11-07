import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Table for document signature records
 */
export const documentRecords = mysqlTable("documentRecords", {
  id: int("id").autoincrement().primaryKey(),
  /** Company related to the document */
  company: varchar("company", { length: 100 }).notNull(),
  /** Custom value if "OUTRO" is selected for company */
  companyOther: varchar("companyOther", { length: 100 }),
  /** Subject/topic of the document */
  subject: varchar("subject", { length: 100 }).notNull(),
  /** Custom value if "OUTRO" is selected for subject */
  subjectOther: varchar("subjectOther", { length: 100 }),
  /** Person who requested the document signature */
  requestedBy: varchar("requestedBy", { length: 100 }).notNull(),
  /** Custom value if "OUTRO" is selected for requestedBy */
  requestedByOther: varchar("requestedByOther", { length: 100 }),
  /** Type of document: PDF or ONLINE */
  documentType: mysqlEnum("documentType", ["PDF", "ONLINE"]).notNull(),
  /** Platform name if documentType is ONLINE */
  onlinePlatform: varchar("onlinePlatform", { length: 100 }),
  /** Person who signed the document */
  signedBy: varchar("signedBy", { length: 100 }).notNull(),
  /** Custom value if "OUTRO" is selected for signedBy */
  signedByOther: varchar("signedByOther", { length: 100 }),
  /** Date of signature */
  signatureDate: timestamp("signatureDate").notNull(),
  /** Person responsible for the record */
  responsible: varchar("responsible", { length: 100 }).notNull(),
  /** Custom value if "OUTRO" is selected for responsible */
  responsibleOther: varchar("responsibleOther", { length: 100 }),
  /** User who created this record */
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  /** Soft delete timestamp - null if not deleted */
  deletedAt: timestamp("deletedAt"),
});

export type DocumentRecord = typeof documentRecords.$inferSelect;
export type InsertDocumentRecord = typeof documentRecords.$inferInsert;
