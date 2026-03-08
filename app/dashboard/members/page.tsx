// src/app/(dashboard)/members/page.tsx
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/helpers";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MemberTableWrapper } from "@/components/members/table/member-table-wrapper";
import { getAllMembers } from "@/lib/services/member.services";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage() {
  await requireAdmin();

  const { data: allMembers, success } = await getAllMembers();

  if (!success || !allMembers) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Failed to load members
          </p>
        </div>
      </div>
    );
  }

  console.log(allMembers);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {allMembers.length} total members
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/members/invite">Invite Member</Link>
        </Button>
      </div>

      <div className="flex justify-center items-center">
        <MemberTableWrapper data={allMembers} />
      </div>
    </div>
  );
}
