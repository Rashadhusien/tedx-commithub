// src/app/(dashboard)/tasks/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { tasks, users, committees, submissions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import TaskDetail from "@/components/tasks/task-detail";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [task] = await db
    .select({ title: tasks.title })
    .from(tasks)
    .where(eq(tasks.id, params.id))
    .limit(1);
  return { title: task ? task.title : "Task Detail" };
}

export default async function TaskDetailPage({ params }: Props) {
  const currentUser = await requireAuth();

  const [task] = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      priority: tasks.priority,
      points: tasks.points,
      deadline: tasks.deadline,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      committeeId: tasks.committeeId,
      committeeName: committees.name,
      assignedTo: tasks.assignedTo,
      assigneeName: users.name,
      assigneeEmail: users.email,
      createdBy: tasks.createdBy,
    })
    .from(tasks)
    .leftJoin(committees, eq(tasks.committeeId, committees.id))
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .where(eq(tasks.id, params.id))
    .limit(1);

  if (!task) notFound();

  // Members can only see their own tasks
  if (currentUser.role === "member" && task.assignedTo !== currentUser.id)
    notFound();

  const taskSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.taskId, params.id))
    .orderBy(desc(submissions.submittedAt));

  return (
    <TaskDetail
      task={task}
      submissions={taskSubmissions}
      currentUser={currentUser}
    />
  );
}
