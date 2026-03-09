// src/app/(dashboard)/committees/page.tsx
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/helpers";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CommitteeTableWrapper } from "@/components/committees/table/committe-table-wrapper";
import { getAllCommittes } from "@/lib/services/committees.services";

export const metadata: Metadata = { title: "Committees" };

export default async function CommitteesPage() {
  const currentUser = await requireAuth();

  const { data: committees, success } = await getAllCommittes();

  if (!committees || !success) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Committees</h1>
            <p className="text-muted-foreground text-sm mt-1">
              No committees found
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log(committees);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Committees</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {committees.length} committees
          </p>
        </div>
        {currentUser.role === "admin" && (
          <Button asChild>
            <Link href="/dashboard/committees/create">Create Committee</Link>
          </Button>
        )}
      </div>
      {/* <CommitteesGrid
        committees={committeesWithCounts}
        currentUser={currentUser}
      /> */}

      <div className="flex justify-center items-center">
        <CommitteeTableWrapper
          data={committees}
          isAdmin={currentUser.role === "admin"}
        />
      </div>
    </div>
  );
}
