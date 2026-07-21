import { pgTable, serial, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN", "SUPER_ADMIN"]);
export const kycStatusEnum = pgEnum("kyc_status", ["PENDING", "VERIFIED", "REJECTED"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("US"),
  zipCode: text("zip_code"),
  occupation: text("occupation"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("USER").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isSuspended: boolean("is_suspended").default(false).notNull(),
  kycStatus: kycStatusEnum("kyc_status").default("PENDING").notNull(),
  emailVerifyToken: text("email_verify_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  twoFactorSecret: text("two_factor_secret"),
  lastLoginAt: timestamp("last_login_at"),
  lastLoginIp: text("last_login_ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true, createdAt: true, updatedAt: true,
  role: true, isEmailVerified: true, isActive: true, isSuspended: true,
  kycStatus: true, emailVerifyToken: true, resetPasswordToken: true,
  resetPasswordExpires: true, lastLoginAt: true, lastLoginIp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
