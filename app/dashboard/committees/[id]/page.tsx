// src/app/(dashboard)/committees/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { committees, users, tasks } from "@/lib/schema";
import { eq } from "drizzle-orm";
import CommitteeDetail from "@/components/committees/committee-detail";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [committee] = await db
    .select({ name: committees.name })
    .from(committees)
    .where(eq(committees.id, params.id))
    .limit(1);
  return { title: committee ? `${committee.name} Committee` : "Committee" };
}

export default async function CommitteeDetailPage({ params }: Props) {
  await requireAuth();

  const [committee] = await db
    .select()
    .from(committees)
    .where(eq(committees.id, params.id))
    .limit(1);

  if (!committee) notFound();

  const members = await db
    .select()
    .from(users)
    .where(eq(users.committeeId, params.id))
    .orderBy(users.name);

  const committeeTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.committeeId, params.id))
    .orderBy(tasks.createdAt);

  return (
    <CommitteeDetail
      committee={committee}
      members={members}
      tasks={committeeTasks}
    />
  );
}
