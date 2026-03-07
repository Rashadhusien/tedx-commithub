// src/components/leaderboard/leaderboard-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  entries: Array<{
    rank: number;
    id: string;
    name: string;
    email: string;
    points: number;
    tasksCompleted: number;
    committeeName?: string | null;
  }>;
  committees: Array<{ id: string; name: string }>;
}

export default function LeaderboardTable({ entries, committees }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">
                  {entry.rank}
                </div>
                <div>
                  <h3 className="font-medium">{entry.name}</h3>
                  <p className="text-sm text-muted-foreground">{entry.committeeName || "No committee"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{entry.points} pts</p>
                <p className="text-sm text-muted-foreground">{entry.tasksCompleted} tasks</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
