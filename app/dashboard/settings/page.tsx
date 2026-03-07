// src/app/(dashboard)/settings/page.tsx
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/helpers";
import ProfileSettings from "@/components/settings/profile-settings";
import SystemSettings from "@/components/settings/system-settings";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const currentUser = await requireAuth();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>
      <ProfileSettings user={currentUser} />
      {currentUser.role === "admin" && <SystemSettings />}
    </div>
  );
}
