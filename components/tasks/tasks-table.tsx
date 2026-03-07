// src/components/tasks/tasks-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  tasks: any[];
  currentUser: { role: string };
}

export default function TasksTable({ tasks, currentUser }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Assigned to: {task.assigneeName} | {task.committeeName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{task.points} pts</p>
                <p className="text-sm text-muted-foreground capitalize">{task.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
