// src/components/committees/committee-detail.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  committee: {
    id: string;
    name: string;
    description?: string | null;
  };
  members: any[];
  tasks: any[];
}

export default function CommitteeDetail({ committee, members, tasks }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{committee.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {committee.description || "No description available"}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Members</h3>
              <p className="text-2xl font-bold">{members.length}</p>
            </div>
            <div>
              <h3 className="font-medium">Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
