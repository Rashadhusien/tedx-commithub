// src/components/dashboard/recent-activity.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  userId?: string;
}

export default function RecentActivity({ userId }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Activity item {i}</p>
                <p className="text-xs text-muted-foreground">{i} hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
