// src/lib/db/schema/submissions.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { submissionStatusEnum } from "./enums";
import { tasks } from "./tasks";
import { users } from "./users";

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    // Deliverable — at least one of submissionLink or fileUrl must be present
    // Enforced at application layer (Zod) + DB CHECK below
    submissionLink: varchar("submission_link", { length: 500 }),
    fileUrl: varchar("file_url", { length: 500 }),
    fileName: varchar("file_name", { length: 255 }),

    notes: text("notes"),

    // Review fields
    status: submissionStatusEnum("status").notNull().default("pending_review"),
    reviewNotes: text("review_notes"),
    reviewedBy: uuid("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    taskIdx: index("submissions_task_idx").on(table.taskId),
    userIdx: index("submissions_user_idx").on(table.userId),
    statusIdx: index("submissions_status_idx").on(table.status),
  }),
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
