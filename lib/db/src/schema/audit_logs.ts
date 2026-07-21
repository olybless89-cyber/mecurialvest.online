import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  adminId: integer("admin_id"),
  action: text("action").notNull(),
  entity: text("entity"),
  entityId: text("entity_id"),
  oldValues: text("old_values"), // JSON
  newValues: text("new_values"), // JSON
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({
  id: true, createdAt: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogsTable.$inferSelect;
