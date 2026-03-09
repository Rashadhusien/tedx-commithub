// src/types/index.ts

// ── Role system ──────────────────────────────────────────────────────────────
export type UserRole = "admin" | "leader" | "member";
export type TaskStatus =
  | "pending"
  | "submitted"
  | "approved"
  | "rejected"
  | "overdue";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type SubmissionStatus = "pending_review" | "approved" | "rejected";
export type PointsReason =
  | "task_approved"
  | "bonus"
  | "deduction"
  | "season_reset";

// ── API Response shape ────────────────────────────────────────────────────────
// Per SRS 4.4: all API routes return consistent shapes
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
export interface ErrorResponse {
  success: false;
  error: string;
}

// ── NextAuth session extension ────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      committeeId: string | null;
      points: number;
    };
  }
}

export interface AuthCredentails {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  inviteToken: string;
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: string;
//     committeeId: string | null;
//     points: number;
//   }
// }

// ── Dashboard stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalTasks: number;
  pendingTasks: number;
  submittedTasks: number;
  approvedTasks: number;
  overdueTasks: number;
  totalPointsAwarded: number;
  tasksByStatus: { status: TaskStatus; count: number }[];
  pointsOverTime: { date: string; points: number }[];
  committeeBreakdown: {
    id: string;
    name: string;
    memberCount: number;
    taskCount: number;
    pendingCount: number;
  }[];
}

// ── Leaderboard entry ────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  committeeId: string | null;
  committeeName: string | null;
  points: number;
  tasksCompleted: number;
}

// ── Task with relations ───────────────────────────────────────────────────────
export interface TaskWithRelations {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  points: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  assignee: { id: string; name: string; email: string };
  creator: { id: string; name: string };
  committee: { id: string; name: string };
  latestSubmission?: {
    id: string;
    status: SubmissionStatus;
    submittedAt: Date;
  } | null;
}

// ── Notification with context ─────────────────────────────────────────────────
export interface NotificationWithContext {
  id: string;
  type: string;
  title: string;
  body: string | null;
  isRead: boolean;
  metadata: Record<string, string> | null;
  createdAt: Date;
}

export interface Committee {
  id: string;
  name: string;
  description: string | null;
  leaderId: string | null;
  leaderName?: string | null;
  createdAt: Date;
  updatedAt: Date;
  memberCount?: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  committeeId: string | null;
  points: number;
  isActive: boolean;
  committeeName?: string | null;
}
