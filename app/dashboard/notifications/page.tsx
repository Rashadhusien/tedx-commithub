// src/app/(dashboard)/notifications/page.tsx
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { notifications } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import NotificationsList from "@/components/notifications/notifications-list";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const currentUser = await requireAuth();

  const userNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, currentUser.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your recent activity and updates
        </p>
      </div>
      <NotificationsList notifications={userNotifications} />
    </div>
  );
}
