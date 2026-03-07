// src/lib/db/schema/relations.ts
import { relations } from "drizzle-orm";
import { committees } from "./committees";
import { users } from "./users";
import { tasks } from "./tasks";
import { submissions } from "./submissions";
import { pointsLedger } from "./points-ledger";
import { notifications } from "./notifications";
import { activityLog } from "./activity-log";

// ── Committees ───────────────────────────────────────────────────────────────
export const committeesRelations = relations(committees, ({ one, many }) => ({
  leader: one(users, {
    fields: [committees.leaderId],
    references: [users.id],
    relationName: "committeeLeader",
  }),
  members: many(users, { relationName: "committeeMembers" }),
  tasks: many(tasks),
}));

// ── Users ────────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  committee: one(committees, {
    fields: [users.committeeId],
    references: [committees.id],
    relationName: "committeeMembers",
  }),
  ledCommittee: one(committees, {
    fields: [users.id],
    references: [committees.leaderId],
    relationName: "committeeLeader",
  }),
  assignedTasks: many(tasks, { relationName: "taskAssignee" }),
  createdTasks: many(tasks, { relationName: "taskCreator" }),
  submissions: many(submissions, { relationName: "submissionAuthor" }),
  reviewedSubmissions: many(submissions, {
    relationName: "submissionReviewer",
  }),
  pointsLedger: many(pointsLedger, { relationName: "pointsRecipient" }),
  awardedPoints: many(pointsLedger, { relationName: "pointsAwarder" }),
  notifications: many(notifications),
  activityLogs: many(activityLog),
}));

// ── Tasks ────────────────────────────────────────────────────────────────────
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  committee: one(committees, {
    fields: [tasks.committeeId],
    references: [committees.id],
  }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: "taskAssignee",
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: "taskCreator",
  }),
  submissions: many(submissions),
  pointsLedger: many(pointsLedger),
}));

// ── Submissions ──────────────────────────────────────────────────────────────
export const submissionsRelations = relations(submissions, ({ one }) => ({
  task: one(tasks, {
    fields: [submissions.taskId],
    references: [tasks.id],
  }),
  author: one(users, {
    fields: [submissions.userId],
    references: [users.id],
    relationName: "submissionAuthor",
  }),
  reviewer: one(users, {
    fields: [submissions.reviewedBy],
    references: [users.id],
    relationName: "submissionReviewer",
  }),
}));

// ── Points Ledger ────────────────────────────────────────────────────────────
export const pointsLedgerRelations = relations(pointsLedger, ({ one }) => ({
  user: one(users, {
    fields: [pointsLedger.userId],
    references: [users.id],
    relationName: "pointsRecipient",
  }),
  task: one(tasks, {
    fields: [pointsLedger.taskId],
    references: [tasks.id],
  }),
  awardedByUser: one(users, {
    fields: [pointsLedger.awardedBy],
    references: [users.id],
    relationName: "pointsAwarder",
  }),
}));

// ── Notifications ────────────────────────────────────────────────────────────
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ── Activity Log ─────────────────────────────────────────────────────────────
export const activityLogRelations = relations(activityLog, ({ one }) => ({
  actor: one(users, {
    fields: [activityLog.actorId],
    references: [users.id],
  }),
}));
