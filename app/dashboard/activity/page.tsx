// src/app/(dashboard)/activity/page.tsx
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { activityLog, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import ActivityLogTable from "@/components/activity/activity-log-table";

export const metadata: Metadata = { title: "Activity Log" };

export default async function ActivityPage() {
  await requireAdmin();

  const logs = await db
    .select({
      id: activityLog.id,
      eventType: activityLog.eventType,
      targetId: activityLog.targetId,
      targetType: activityLog.targetType,
      metadata: activityLog.metadata,
      createdAt: activityLog.createdAt,
      actorId: activityLog.actorId,
      actorName: users.name,
      actorEmail: users.email,
    })
    .from(activityLog)
    .leftJoin(users, eq(activityLog.actorId, users.id))
    .orderBy(desc(activityLog.createdAt))
    .limit(100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Append-only audit trail of all system events
        </p>
      </div>
      <ActivityLogTable logs={logs} />
    </div>
  );
}
