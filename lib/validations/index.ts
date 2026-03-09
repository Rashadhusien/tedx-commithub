// src/lib/validations/index.ts
import { z } from "zod";

// ── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    inviteToken: z.string().min(1),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

// ── Committees ───────────────────────────────────────────────────────────────
export const createCommitteeSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  leaderId: z.string().uuid().optional(),
});

export const updateCommitteeSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  leaderId: z.string().uuid().optional(),
});

// ── Members ──────────────────────────────────────────────────────────────────
export const inviteMemberSchema = z.object({
  email: z.string().email(),
  committeeId: z.string().uuid().optional(),
  role: z.enum(["admin", "leader", "member"]).default("member"),
});

export const updateMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(["admin", "leader", "member"]).optional(),
  committeeId: z.string().uuid().nullable().optional(),
});

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).optional(),
  })
  .refine((d) => !d.newPassword || d.currentPassword, {
    message: "Current password required to set new password",
    path: ["currentPassword"],
  });

export const deleteMemberSchema = z.object({
  id: z.string().uuid(),
});

// ── Tasks ────────────────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  committeeId: z.string().uuid(),
  assignedTo: z.string().uuid(),
  points: z.number().int().min(1).max(500),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  deadline: z.string().datetime({ offset: true }),
});

export const updateTaskSchema = createTaskSchema
  .omit({ committeeId: true, assignedTo: true })
  .partial();

// ── Submissions ──────────────────────────────────────────────────────────────
export const createSubmissionSchema = z
  .object({
    taskId: z.string().uuid(),
    submissionLink: z.string().url("Must be a valid URL").optional(),
    fileUrl: z.string().url().optional(),
    fileName: z.string().max(255).optional(),
    notes: z.string().max(1000).optional(),
  })
  .refine((d) => d.submissionLink || d.fileUrl, {
    message: "At least one of submission link or file is required",
    path: ["submissionLink"],
  });

export const reviewSubmissionSchema = z
  .object({
    submissionId: z.string().uuid(),
    action: z.enum(["approve", "reject"]),
    reviewNotes: z.string().max(1000).optional(),
  })
  .refine(
    (d) =>
      d.action === "approve" || (d.reviewNotes && d.reviewNotes.length >= 10),
    {
      message: "Rejection reason is required (min 10 characters)",
      path: ["reviewNotes"],
    },
  );

// ── Points ───────────────────────────────────────────────────────────────────
export const manualPointsSchema = z.object({
  userId: z.string().uuid(),
  amount: z
    .number()
    .int()
    .refine((n) => n !== 0, "Amount cannot be zero"),
  reason: z.enum(["bonus", "deduction"]),
  note: z
    .string()
    .min(5)
    .max(500, "Note is required for manual points changes"),
});

// ── Pagination ───────────────────────────────────────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const taskFiltersSchema = paginationSchema.extend({
  status: z
    .enum(["pending", "submitted", "approved", "rejected", "overdue"])
    .optional(),
  committeeId: z.string().uuid().optional(),
  assignedTo: z.string().uuid().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
});

export const memberFiltersSchema = paginationSchema.extend({
  committeeId: z.string().uuid().optional(),
  role: z.enum(["admin", "leader", "member"]).optional(),
  search: z.string().max(100).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const leaderboardFiltersSchema = z.object({
  committeeId: z.string().uuid().optional(),
  period: z.enum(["all_time", "this_month", "this_week"]).default("all_time"),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

// ── Types inferred from schemas ──────────────────────────────────────────────
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateCommitteeInput = z.infer<typeof createCommitteeSchema>;
export type UpdateCommitteeInput = z.infer<typeof updateCommitteeSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
export type ManualPointsInput = z.infer<typeof manualPointsSchema>;
export type LeaderboardFilters = z.infer<typeof leaderboardFiltersSchema>;
