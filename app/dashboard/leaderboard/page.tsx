// src/app/(dashboard)/leaderboard/page.tsx
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { users, committees, tasks } from "@/lib/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";

export const metadata: Metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  await requireAuth();

  const leaderboard = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      points: users.points,
      committeeId: users.committeeId,
      committeeName: committees.name,
      tasksCompleted: sql<number>`
        (SELECT COUNT(*) FROM ${tasks}
         WHERE ${tasks.assignedTo} = ${users.id}
           AND ${tasks.status} = 'approved')
      `,
    })
    .from(users)
    .leftJoin(committees, eq(users.committeeId, committees.id))
    .where(eq(users.isActive, true))
    .orderBy(desc(users.points));

  const allCommittees = await db
    .select({ id: committees.id, name: committees.name })
    .from(committees)
    .orderBy(committees.name);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Rankings by total accumulated points
        </p>
      </div>
      <LeaderboardTable
        entries={leaderboard.map((m, i) => ({ ...m, rank: i + 1 }))}
        committees={allCommittees}
      />
    </div>
  );
}
