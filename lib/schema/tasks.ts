// src/lib/db/schema/tasks.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { taskStatusEnum, taskPriorityEnum } from "./enums";
import { committees } from "./committees";
import { users } from "./users";

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),

    committeeId: uuid("committee_id")
      .notNull()
      .references(() => committees.id, { onDelete: "restrict" }),

    assignedTo: uuid("assigned_to")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    // Point value: 1–500 enforced by DB check + Zod
    points: integer("points").notNull(),

    priority: taskPriorityEnum("priority").notNull().default("medium"),
    status: taskStatusEnum("status").notNull().default("pending"),

    deadline: timestamp("deadline", { withTimezone: true }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    // Indexes required per SRS NFR-SC-02
    assignedToIdx: index("tasks_assigned_to_idx").on(table.assignedTo),
    committeeIdx: index("tasks_committee_idx").on(table.committeeId),
    statusIdx: index("tasks_status_idx").on(table.status),
    deadlineIdx: index("tasks_deadline_idx").on(table.deadline),
    createdByIdx: index("tasks_created_by_idx").on(table.createdBy),

    // DB-level constraint: points must be 1–500
    pointsCheck: check(
      "tasks_points_check",
      sql`${table.points} >= 1 AND ${table.points} <= 500`,
    ),
  }),
);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
