// src/components/members/members-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  members: any[];
}

export default function MembersTable({ members }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="text-right">
                <p className="font-medium capitalize">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.points} pts</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
