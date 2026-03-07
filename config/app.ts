// src/config/app.ts
export const APP_CONFIG = {
  name: "CommitHub",
  description: "Internal committee & task management with gamification",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const PAGINATION = {
  defaultLimit: 25,
  maxLimit: 100,
} as const;

export const POINTS = {
  min: 1,
  max: 500,
} as const;

export const INVITE = {
  expiryHours: 48,
} as const;

export const RESET_TOKEN = {
  expiryHours: 1,
} as const;

export const NOTIFICATIONS = {
  purgeAfterDays: 90,
} as const;

// Navigation items per SRS Section 4.1.2
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["admin", "leader", "member"],
  },
  {
    label: "Committees",
    href: "/dashboard/committees",
    icon: "Users2",
    roles: ["admin", "leader", "member"],
  },
  {
    label: "Members",
    href: "/dashboard/members",
    icon: "UserCog",
    roles: ["admin"],
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: "ClipboardList",
    roles: ["admin", "leader", "member"],
  },
  {
    label: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: "Trophy",
    roles: ["admin", "leader", "member"],
  },
] as const;

export const NAV_SYSTEM_ITEMS = [
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: "Bell",
    roles: ["admin", "leader", "member"],
  },
  {
    label: "Activity Log",
    href: "/dashboard/activity",
    icon: "ScrollText",
    roles: ["admin"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    roles: ["admin", "leader", "member"],
  },
] as const;
