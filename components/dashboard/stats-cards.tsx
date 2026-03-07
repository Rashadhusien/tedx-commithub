// src/components/dashboard/stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  totalMembers: number;
  taskStatusCounts: { status: string; count: number }[];
  totalPointsAwarded: number;
}

export default function StatsCards({
  totalMembers,
  taskStatusCounts,
  totalPointsAwarded,
}: Props) {
  const pendingTasks = taskStatusCounts.find(t => t.status === "pending")?.count || 0;
  const approvedTasks = taskStatusCounts.find(t => t.status === "approved")?.count || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTasks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedTasks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPointsAwarded.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
