// src/lib/db/schema/users.ts
import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { userRoleEnum } from "./enums";
import { committees } from "./committees";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),

    role: userRoleEnum("role").notNull().default("member"),

    // Primary committee assignment
    committeeId: uuid("committee_id").references(() => committees.id, {
      onDelete: "set null",
    }),

    // Denormalized total for fast leaderboard queries
    // Source of truth is pointsLedger — this is kept in sync via transactions
    points: integer("points").notNull().default(0),

    // Soft delete — preserves all historical data
    isActive: boolean("is_active").notNull().default(true),

    // One-time invite token (48h expiry)
    inviteToken: varchar("invite_token", { length: 255 }).unique(),
    inviteExpiresAt: timestamp("invite_expires_at", { withTimezone: true }),

    // Password reset token (1h expiry)
    resetToken: varchar("reset_token", { length: 255 }).unique(),
    resetTokenExpiresAt: timestamp("reset_token_expires_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    // Indexes required per SRS NFR-SC-02
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    committeeIdx: index("users_committee_idx").on(table.committeeId),
    pointsIdx: index("users_points_idx").on(table.points),
    roleIdx: index("users_role_idx").on(table.role),
    isActiveIdx: index("users_is_active_idx").on(table.isActive),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Safe user type — never expose passwordHash or tokens to the client
export type SafeUser = Omit<
  User,
  | "passwordHash"
  | "inviteToken"
  | "resetToken"
  | "resetTokenExpiresAt"
  | "inviteExpiresAt"
>;
