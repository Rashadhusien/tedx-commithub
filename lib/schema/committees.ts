// src/lib/db/schema/committees.ts
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const committees = pgTable("committees", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  // leaderId is set after users table exists — FK added via relation/migration
  leaderId: uuid("leader_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

// Relations wired in relations.ts to avoid circular imports
export type Committee = typeof committees.$inferSelect;
export type NewCommittee = typeof committees.$inferInsert;
