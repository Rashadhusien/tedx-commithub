// src/components/layout/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NAV_SYSTEM_ITEMS } from "@/config/app";
import {
  LayoutDashboard,
  Users2,
  UserCog,
  ClipboardList,
  Trophy,
  Bell,
  ScrollText,
  Settings,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users2,
  UserCog,
  ClipboardList,
  Trophy,
  Bell,
  ScrollText,
  Settings,
};

interface Props {
  user: { name: string; email: string; role: string; points: number };
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();

  const filteredNav = NAV_ITEMS.filter((item) =>
    (item.roles as readonly string[]).includes(user.role),
  );
  const filteredSystem = NAV_SYSTEM_ITEMS.filter((item) =>
    (item.roles as readonly string[]).includes(user.role),
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
          <span className="text-xs font-bold text-sidebar-foreground">CH</span>
        </div>
        <span className="font-semibold text-sidebar-foreground">CommitHub</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40 mb-2">
          Main
        </p>
        {filteredNav.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-border hover:text-sidebar-foreground"
              }`}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40 mb-2">
            System
          </p>
          {filteredSystem.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-border hover:text-sidebar-foreground"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-sidebar-foreground">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate capitalize">
              {user.role}
            </p>
          </div>
          <div className="ml-auto text-xs font-medium text-sidebar-accent">
            {user.points}pts
          </div>
        </div>
      </div>
    </aside>
  );
}
