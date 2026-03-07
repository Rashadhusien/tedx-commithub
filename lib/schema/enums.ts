// src/lib/db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

// ── User roles ──────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["admin", "leader", "member"]);

// ── Task status lifecycle ───────────────────────────────────────────────────
export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "submitted",
  "approved",
  "rejected",
  "overdue",
]);

// ── Task priority ───────────────────────────────────────────────────────────
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

// ── Submission review status ────────────────────────────────────────────────
export const submissionStatusEnum = pgEnum("submission_status", [
  "pending_review",
  "approved",
  "rejected",
]);

// ── Points ledger reason ────────────────────────────────────────────────────
export const pointsReasonEnum = pgEnum("points_reason", [
  "task_approved",
  "bonus",
  "deduction",
  "season_reset",
]);

// ── Activity log target types ───────────────────────────────────────────────
export const activityTargetTypeEnum = pgEnum("activity_target_type", [
  "task",
  "user",
  "committee",
  "submission",
  "points",
]);
