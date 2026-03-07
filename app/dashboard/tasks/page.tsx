// src/app/(dashboard)/tasks/page.tsx
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { tasks, users, committees } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import TasksTable from "@/components/tasks/tasks-table";
import CreateTaskButton from "@/components/tasks/create-task-button";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage() {
  const currentUser = await requireAuth();
  const isAdmin = currentUser.role === "admin";
  const isLeader = currentUser.role === "leader";

  // Scope tasks based on role
  const query = db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      priority: tasks.priority,
      points: tasks.points,
      deadline: tasks.deadline,
      createdAt: tasks.createdAt,
      assigneeName: users.name,
      assigneeId: users.id,
      committeeName: committees.name,
      committeeId: committees.id,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .leftJoin(committees, eq(tasks.committeeId, committees.id))
    .orderBy(desc(tasks.createdAt));

  const allTasks = isAdmin
    ? await query
    : isLeader
      ? await query.where(eq(tasks.committeeId, currentUser.committeeId!))
      : await query.where(eq(tasks.assignedTo, currentUser.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {allTasks.length} tasks
          </p>
        </div>
        {(isAdmin || isLeader) && <CreateTaskButton />}
      </div>
      <TasksTable tasks={allTasks} currentUser={currentUser} />
    </div>
  );
}
