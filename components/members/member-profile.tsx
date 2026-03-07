// src/components/members/member-profile.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  member: any;
  tasks: any[];
  recentPoints: any[];
  currentUser: { role: string };
}

export default function MemberProfile({ member, tasks, recentPoints, currentUser }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{member.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-medium">Role</h3>
              <p className="text-lg capitalize">{member.role}</p>
            </div>
            <div>
              <h3 className="font-medium">Points</h3>
              <p className="text-2xl font-bold">{member.points}</p>
            </div>
            <div>
              <h3 className="font-medium">Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <div>
              <h3 className="font-medium">Committee</h3>
              <p className="text-lg">{member.committeeName || "None"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
