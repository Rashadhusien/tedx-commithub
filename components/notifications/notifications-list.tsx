// src/components/notifications/notifications-list.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  notifications: any[];
}

export default function NotificationsList({ notifications }: Props) {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={!notification.isRead ? "border-primary" : ""}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.body || "No description"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
