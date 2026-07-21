import { pgTable, serial, text, boolean, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const notificationTypeEnum = pgEnum("notification_type", [
  "TRANSACTION", "SECURITY", "SYSTEM", "PROMOTION", "ALERT"
]);

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").default("SYSTEM").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  metadata: text("metadata"), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({
  id: true, createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;
