// src/components/committees/committees-grid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  committees: Array<{
    id: string;
    name: string;
    description?: string | null;
    memberCount: number;
  }>;
  currentUser: { role: string };
}

export default function CommitteesGrid({ committees, currentUser }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {committees.map((committee) => (
        <Card key={committee.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{committee.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {committee.description || "No description available"}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{committee.memberCount} members</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
