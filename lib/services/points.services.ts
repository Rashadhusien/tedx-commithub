// src/lib/db/services/points.service.ts
import { db } from "@/lib/db";
import { pointsLedger, users } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import type { PointsReason } from "@/types";

interface AwardPointsOptions {
  userId: string;
  amount: number;
  reason: PointsReason;
  taskId?: string;
  awardedBy: string;
  note?: string;
}

/**
 * Awards or deducts points atomically.
 * Inserts a ledger entry AND updates users.points in a single transaction.
 * Per SRS FR-PT-02 and NFR-RL-05.
 */
export async function awardPoints(opts: AwardPointsOptions) {
  return await db.transaction(async (tx) => {
    // 1. Insert immutable ledger entry
    const [entry] = await tx
      .insert(pointsLedger)
      .values({
        userId: opts.userId,
        amount: opts.amount,
        reason: opts.reason,
        taskId: opts.taskId,
        awardedBy: opts.awardedBy,
        note: opts.note,
      })
      .returning();

    // 2. Update denormalized total (prevents negative points floor at 0)
    await tx
      .update(users)
      .set({
        points: sql`GREATEST(0, ${users.points} + ${opts.amount})`,
        updatedAt: sql`now()`,
      })
      .where(eq(users.id, opts.userId));

    return entry;
  });
}

/**
 * Recalculates a user's total points from the ledger.
 * Use for data integrity checks or after season resets.
 */
export async function recalculatePoints(userId: string) {
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${pointsLedger.amount}), 0)` })
    .from(pointsLedger)
    .where(eq(pointsLedger.userId, userId));

  const total = Math.max(0, result[0]?.total ?? 0);

  await db
    .update(users)
    .set({ points: total, updatedAt: sql`now()` })
    .where(eq(users.id, userId));

  return total;
}
