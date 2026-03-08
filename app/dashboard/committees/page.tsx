// src/app/(dashboard)/committees/page.tsx
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { committees, users } from "@/lib/schema";
import { count, eq } from "drizzle-orm";
import CommitteesGrid from "@/components/committees/committees-grid";
import CreateCommitteeButton from "@/components/committees/create-committee-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Committees" };

export default async function CommitteesPage() {
  const currentUser = await requireAuth();

  const committeesWithCounts = await db
    .select({
      id: committees.id,
      name: committees.name,
      description: committees.description,
      leaderId: committees.leaderId,
      memberCount: count(users.id),
    })
    .from(committees)
    .leftJoin(users, eq(users.committeeId, committees.id))
    .groupBy(committees.id)
    .orderBy(committees.name);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Committees</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {committeesWithCounts.length} committees
          </p>
        </div>
        {currentUser.role === "admin" && (
          <Button asChild>
            <Link href="/dashboard/committees/create">Create Committee</Link>
          </Button>
        )}
      </div>
      <CommitteesGrid
        committees={committeesWithCounts}
        currentUser={currentUser}
      />
    </div>
  );
}
