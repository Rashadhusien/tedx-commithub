// src/components/dashboard/task-status-chart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { status: string; count: number }[];
  className?: string;
}

export default function TaskStatusChart({ data, className }: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Task Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <span className="capitalize text-sm font-medium">{item.status}</span>
              <span className="text-sm text-muted-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
