// src/components/dashboard/top-leaderboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  members: Array<{
    id: string;
    name: string;
    points: number;
    committeeId?: string | null;
  }>;
}

export default function TopLeaderboard({ members }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.slice(0, 5).map((member, index) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{member.name}</span>
              </div>
              <span className="text-sm font-bold">{member.points} pts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
