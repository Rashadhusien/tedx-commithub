// src/components/dashboard/points-chart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  className?: string;
}

export default function PointsChart({ className }: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Points Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Chart placeholder - Points over time
        </div>
      </CardContent>
    </Card>
  );
}
