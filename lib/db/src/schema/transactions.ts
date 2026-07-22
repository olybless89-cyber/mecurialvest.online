import { pgTable, serial, text, numeric, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { accountsTable } from "./accounts";
import { usersTable } from "./users";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "DEPOSIT", "WITHDRAWAL", "TRANSFER_IN", "TRANSFER_OUT", "FEE", "INTEREST", "REVERSAL", "ADMIN_CREDIT"
]);
export const transactionStatusEnum = pgEnum("transaction_status", ["PENDING", "COMPLETED", "FAILED", "REVERSED", "HELD"]);

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accountsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  refNumber: text("ref_number").notNull().unique(),
  type: transactionTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  balanceBefore: numeric("balance_before", { precision: 18, scale: 2 }).notNull(),
  balanceAfter: numeric("balance_after", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  description: text("description"),
  note: text("note"),
  status: transactionStatusEnum("status").default("PENDING").notNull(),
  // For transfers
  counterpartAccountId: integer("counterpart_account_id"),
  counterpartName: text("counterpart_name"),
  counterpartBank: text("counterpart_bank"),
  counterpartAccountNumber: text("counterpart_account_number"),
  // Meta
  ipAddress: text("ip_address"),
  reversedAt: timestamp("reversed_at"),
  reversedBy: integer("reversed_by"),
  // Hold / release fields
  heldBy: integer("held_by"),
  holdReason: text("hold_reason"),
  releasedAt: timestamp("released_at"),
  releasedBy: integer("released_by"),
  // COT & TAX charges (required before release)
  cotAmount: numeric("cot_amount", { precision: 18, scale: 2 }),
  taxAmount: numeric("tax_amount", { precision: 18, scale: 2 }),
  cotPaid: boolean("cot_paid").default(false).notNull(),
  taxPaid: boolean("tax_paid").default(false).notNull(),
  chargesNote: text("charges_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({
  id: true, createdAt: true, updatedAt: true, refNumber: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
