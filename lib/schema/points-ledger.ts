// src/lib/db/schema/points-ledger.ts
import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { pointsReasonEnum } from "./enums";
import { users } from "./users";
import { tasks } from "./tasks";

/**
 * Immutable points transaction log.
 * Source of truth for all point changes.
 * users.points is a denormalized cache — always recomputable from this table.
 *
 * Per SRS FR-PT-02: entries are NEVER updated or deleted.
 */
export const pointsLedger = pgTable(
  "points_ledger",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    // Positive = award, Negative = deduction
    amount: integer("amount").notNull(),

    reason: pointsReasonEnum("reason").notNull(),

    // Linked task (only for task_approved reason)
    taskId: uuid("task_id").references(() => tasks.id, {
      onDelete: "set null",
    }),

    // Admin who triggered the entry
    awardedBy: uuid("awarded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    note: text("note"),

    // Immutable timestamp — no updatedAt on this table
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    userIdx: index("points_ledger_user_idx").on(table.userId),
    createdAtIdx: index("points_ledger_created_at_idx").on(table.createdAt),
    taskIdx: index("points_ledger_task_idx").on(table.taskId),
  }),
);

export type PointsLedgerEntry = typeof pointsLedger.$inferSelect;
export type NewPointsLedgerEntry = typeof pointsLedger.$inferInsert;
