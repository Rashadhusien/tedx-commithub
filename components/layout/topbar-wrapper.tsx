// src/components/layout/topbar-wrapper.tsx
import TopBar from "./topbar";
import { db } from "@/lib/db";
import { notifications } from "@/lib/schema/notifications";
import { eq, and } from "drizzle-orm";
import { count } from "drizzle-orm";

interface Props {
  user: { id: string; name: string; role: string };
}

export default async function TopBarWrapper({ user }: Props) {
  const [{ unread }] = await db
    .select({ unread: count() })
    .from(notifications)
    .where(
      and(eq(notifications.userId, user.id), eq(notifications.isRead, false)),
    );

  return <TopBar user={user} unread={unread} />;
}
