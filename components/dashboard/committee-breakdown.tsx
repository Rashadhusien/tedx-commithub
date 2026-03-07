// src/components/dashboard/committee-breakdown.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommitteeBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Committee Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {["Marketing", "Design", "Media", "Logistics", "PR", "Tech"].map((committee) => (
            <div key={committee} className="flex items-center justify-between">
              <span className="text-sm font-medium">{committee}</span>
              <span className="text-sm text-muted-foreground">0 members</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
