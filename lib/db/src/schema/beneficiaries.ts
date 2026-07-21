import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const beneficiariesTable = pgTable("beneficiaries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  accountNumber: text("account_number").notNull(),
  routingNumber: text("routing_number"),
  bankName: text("bank_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  isInternal: boolean("is_internal").default(false).notNull(),
  internalUserId: integer("internal_user_id"),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  nickname: text("nickname"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBeneficiarySchema = createInsertSchema(beneficiariesTable).omit({
  id: true, createdAt: true, updatedAt: true,
});

export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type Beneficiary = typeof beneficiariesTable.$inferSelect;
