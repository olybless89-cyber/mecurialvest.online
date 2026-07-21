import { pgTable, serial, text, numeric, boolean, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const accountTypeEnum = pgEnum("account_type", ["CHECKING", "SAVINGS", "MONEY_MARKET", "FIXED_DEPOSIT"]);
export const accountStatusEnum = pgEnum("account_status", ["ACTIVE", "FROZEN", "CLOSED"]);
export const currencyEnum = pgEnum("currency", ["USD", "EUR", "GBP", "CAD", "AUD"]);

export const accountsTable = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  accountNumber: text("account_number").notNull().unique(),
  accountType: accountTypeEnum("account_type").default("CHECKING").notNull(),
  balance: numeric("balance", { precision: 18, scale: 2 }).default("0.00").notNull(),
  currency: currencyEnum("currency").default("USD").notNull(),
  status: accountStatusEnum("status").default("ACTIVE").notNull(),
  nickname: text("nickname"),
  isPrimary: boolean("is_primary").default(false).notNull(),
  routingNumber: text("routing_number").default("021000021").notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAccountSchema = createInsertSchema(accountsTable).omit({
  id: true, createdAt: true, updatedAt: true, accountNumber: true,
});

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accountsTable.$inferSelect;
