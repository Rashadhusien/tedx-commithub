// src/lib/db/services/notifications.service.ts
import { db } from "@/lib/db";
import { notifications } from "@/lib/schema/notifications";
import type { NotificationType } from "@/lib/schema/notifications";

interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  metadata?: Record<string, string>;
}

/**
 * Creates an in-app notification.
 * Fire-and-forget — errors are logged but do not block the caller.
 * Per SRS FR-NT-01 and FR-NT-03.
 */
export async function createNotification(
  opts: CreateNotificationOptions,
): Promise<void> {
  try {
    await db.insert(notifications).values({
      userId: opts.userId,
      type: opts.type,
      title: opts.title,
      body: opts.body,
      metadata: opts.metadata,
    });
  } catch (err) {
    console.error("[Notifications] Failed to create notification:", err);
  }
}

/**
 * Creates notifications for multiple users at once (e.g., notify all admins).
 */
export async function createNotifications(
  userIds: string[],
  opts: Omit<CreateNotificationOptions, "userId">,
): Promise<void> {
  if (userIds.length === 0) return;
  try {
    await db.insert(notifications).values(
      userIds.map((userId) => ({
        userId,
        type: opts.type,
        title: opts.title,
        body: opts.body,
        metadata: opts.metadata,
      })),
    );
  } catch (err) {
    console.error("[Notifications] Failed to create bulk notifications:", err);
  }
}
