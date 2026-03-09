// src/app/(dashboard)/dashboard/page.tsx
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { users, tasks, pointsLedger } from "@/lib/schema";
import { count, eq, sql } from "drizzle-orm";
import StatsCards from "@/components/dashboard/stats-cards";
import TaskStatusChart from "@/components/dashboard/task-status-chart";
// import PointsChart from "@/components/dashboard/points-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import TopLeaderboard from "@/components/dashboard/top-leaderboard";
import CommitteeBreakdown from "@/components/dashboard/committee-breakdown";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const currentUser = await requireAuth();
  const isAdmin = currentUser.role === "admin";
  const isLeader = currentUser.role === "leader";

  // ── KPI queries ─────────────────────────────────────────────────────────────
  const [totalMembersResult] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.isActive, true));

  const taskStatusCounts = await db
    .select({ status: tasks.status, count: count() })
    .from(tasks)
    .groupBy(tasks.status);

  const [totalPointsResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(${pointsLedger.amount}), 0)` })
    .from(pointsLedger);

  // Top 5 for leaderboard widget
  const topMembers = await db
    .select({
      id: users.id,
      name: users.name,
      points: users.points,
      committeeId: users.committeeId,
    })
    .from(users)
    .where(eq(users.isActive, true))
    .orderBy(sql`${users.points} DESC`)
    .limit(5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {currentUser.name}
        </p>
      </div>

      <StatsCards
        totalMembers={totalMembersResult.count}
        taskStatusCounts={taskStatusCounts}
        totalPointsAwarded={totalPointsResult.total}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <TaskStatusChart data={taskStatusCounts} className="lg:col-span-2" />
        <TopLeaderboard members={topMembers} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity
          userId={isAdmin || isLeader ? undefined : currentUser.id}
        />
        {isAdmin && <CommitteeBreakdown />}
      </div>
    </div>
  );
}
