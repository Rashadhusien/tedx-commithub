// src/components/settings/system-settings.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SystemSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Database Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage database migrations and seeds
            </p>
            <div className="mt-2 space-x-2">
              <Button variant="outline" size="sm">Run Migration</Button>
              <Button variant="outline" size="sm">Seed Data</Button>
            </div>
          </div>
          <div>
            <h3 className="font-medium">User Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage user roles and permissions
            </p>
            <div className="mt-2">
              <Button variant="outline" size="sm">Manage Roles</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
