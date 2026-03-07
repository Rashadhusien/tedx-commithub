// src/app/(dashboard)/members/[id]/page.tsx
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import {
  users,
  tasks,
  submissions,
  pointsLedger,
  committees,
} from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import MemberProfile from "@/components/members/member-profile";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1);
  return { title: user ? `${user.name}'s Profile` : "Member Profile" };
}

export default async function MemberProfilePage({ params }: Props) {
  const currentUser = await requireAuth();

  // Members can only view their own profile
  if (currentUser.role === "member" && currentUser.id !== params.id) {
    redirect("/dashboard");
  }

  const [member] = await db
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
    .where(eq(users.id, params.id))
    .limit(1);

  if (!member) notFound();

  const memberTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.assignedTo, params.id))
    .orderBy(desc(tasks.createdAt))
    .limit(20);

  const recentPoints = await db
    .select()
    .from(pointsLedger)
    .where(eq(pointsLedger.userId, params.id))
    .orderBy(desc(pointsLedger.createdAt))
    .limit(10);

  return (
    <MemberProfile
      member={member}
      tasks={memberTasks}
      recentPoints={recentPoints}
      currentUser={currentUser}
    />
  );
}
