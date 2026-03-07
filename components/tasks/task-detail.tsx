// src/components/tasks/task-detail.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  task: any;
  submissions: any[];
  currentUser: { role: string };
}

export default function TaskDetail({ task, submissions, currentUser }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {task.description || "No description available"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium">Points</h3>
                <p className="text-2xl font-bold">{task.points}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-lg capitalize">{task.status}</p>
              </div>
              <div>
                <h3 className="font-medium">Priority</h3>
                <p className="text-lg capitalize">{task.priority}</p>
              </div>
              <div>
                <h3 className="font-medium">Deadline</h3>
                <p className="text-lg">{new Date(task.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
