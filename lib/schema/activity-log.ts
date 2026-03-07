// src/lib/db/schema/activity-log.ts
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { activityTargetTypeEnum } from "./enums";
import { users } from "./users";

/**
 * Append-only audit trail.
 * Per SRS FR-AL-06: entries are NEVER updated or deleted.
 *
 * Event type convention: "entity.action"
 * Examples: "task.created", "submission.approved", "user.invited"
 */
export type ActivityEventType =
  | "user.login"
  | "user.logout"
  | "user.invited"
  | "user.activated"
  | "user.deactivated"
  | "user.updated"
  | "committee.created"
  | "committee.updated"
  | "committee.deleted"
  | "committee.leader_assigned"
  | "task.created"
  | "task.updated"
  | "task.deleted"
  | "task.overdue"
  | "submission.created"
  | "submission.approved"
  | "submission.rejected"
  | "points.awarded"
  | "points.deducted"
  | "points.season_reset";

export const activityLog = pgTable(
  "activity_log",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    eventType: varchar("event_type", { length: 100 })
      .$type<ActivityEventType>()
      .notNull(),

    // Who triggered the event
    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    // Subject of the event (task id, user id, committee id, etc.)
    targetId: uuid("target_id"),
    targetType: activityTargetTypeEnum("target_type"),

    // Flexible context (old values, new values, related IDs, etc.)
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    // Immutable — no updatedAt
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    // Required index per SRS NFR-SC-02
    createdAtIdx: index("activity_log_created_at_idx").on(table.createdAt),
    actorIdx: index("activity_log_actor_idx").on(table.actorId),
    targetIdx: index("activity_log_target_idx").on(table.targetId),
    eventTypeIdx: index("activity_log_event_type_idx").on(table.eventType),
  }),
);

export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type NewActivityLogEntry = typeof activityLog.$inferInsert;
