// src/lib/db/services/activity.service.ts
import { db } from "@/lib/db";
import { activityLog } from "@/lib/schema/activity-log";
import type { ActivityEventType } from "@/lib/schema/activity-log";

interface LogActivityOptions {
  eventType: ActivityEventType;
  actorId: string;
  targetId?: string;
  targetType?: "task" | "user" | "committee" | "submission" | "points";
  metadata?: Record<string, unknown>;
}

/**
 * Appends an immutable activity log entry.
 * Fire-and-forget — errors are caught and logged but do not block the caller.
 * Per SRS FR-AL-01 and FR-AL-06.
 */
export async function logActivity(opts: LogActivityOptions): Promise<void> {
  try {
    await db.insert(activityLog).values({
      eventType: opts.eventType,
      actorId: opts.actorId,
      targetId: opts.targetId,
      targetType: opts.targetType,
      metadata: opts.metadata,
    });
  } catch (err) {
    // Never throw — activity logging must not break business logic
    console.error("[ActivityLog] Failed to log event:", opts.eventType, err);
  }
}
