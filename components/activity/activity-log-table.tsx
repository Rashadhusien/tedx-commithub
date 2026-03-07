// src/components/activity/activity-log-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  logs: Array<{
    id: string;
    eventType: string;
    actorName: string;
    actorEmail: string;
    createdAt: Date;
    metadata?: Record<string, unknown>;
  }>;
}

export default function ActivityLogTable({ logs }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium capitalize">{log.eventType.replace(".", " ")}</h3>
                <p className="text-sm text-muted-foreground">
                  by {log.actorName} ({log.actorEmail})
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
