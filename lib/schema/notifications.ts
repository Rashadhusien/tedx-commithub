// src/lib/db/schema/notifications.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

// Notification type keys — kept as varchar for extensibility
export type NotificationType =
  | "task_assigned"
  | "submission_approved"
  | "submission_rejected"
  | "bonus_points_awarded"
  | "points_deducted"
  | "task_overdue"
  | "member_invited";

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 50 }).$type<NotificationType>().notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    body: text("body"),

    isRead: boolean("is_read").notNull().default(false),

    // Context for deep-linking: { taskId, submissionId, committeeId, ... }
    metadata: jsonb("metadata").$type<Record<string, string>>(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    userIdx: index("notifications_user_idx").on(table.userId),
    isReadIdx: index("notifications_is_read_idx").on(table.isRead),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
    // Composite: fetch unread notifications for a user efficiently
    userIsReadIdx: index("notifications_user_is_read_idx").on(
      table.userId,
      table.isRead,
    ),
  }),
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
