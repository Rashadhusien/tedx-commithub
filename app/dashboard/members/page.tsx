// src/app/(dashboard)/members/page.tsx
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { users, committees } from "@/lib/schema";
import { eq } from "drizzle-orm";
import MembersTable from "@/components/members/members-table";
import InviteMemberButton from "@/components/members/invite-member-button";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage() {
  await requireAdmin();

  const allMembers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      points: users.points,
      isActive: users.isActive,
      createdAt: users.createdAt,
      committeeId: users.committeeId,
      committeeName: committees.name,
    })
    .from(users)
    .leftJoin(committees, eq(users.committeeId, committees.id))
    .orderBy(users.name);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {allMembers.length} total members
          </p>
        </div>
        <InviteMemberButton />
      </div>
      <MembersTable members={allMembers} />
    </div>
  );
}
