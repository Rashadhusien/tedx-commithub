// src/components/layout/topbar.tsx
"use client";
import Link from "next/link";
import { Bell, LogOut } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { signOutAction } from "@/lib/services/auth.services";

interface Props {
  user: { id: string; name: string; role: string };
  unread?: number;
}

export default function TopBar({ user, unread = 0 }: Props) {
  return (
    <header className="h-16 bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <span className="text-sm text-muted-foreground capitalize">
          {user.role}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </div>
    </header>
  );
}
