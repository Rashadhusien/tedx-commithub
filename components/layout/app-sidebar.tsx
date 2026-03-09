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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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

interface AppSidebarProps {
  user: { name: string; email: string; role: string; points: number };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const filteredNav = NAV_ITEMS.filter((item) =>
    (item.roles as readonly string[]).includes(user.role),
  );
  const filteredSystem = NAV_SYSTEM_ITEMS.filter((item) =>
    (item.roles as readonly string[]).includes(user.role),
  );

  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar collapsible="icon" variant="inset" className="max-w-fit">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span className="text-lg font-bold font-space-grotesk">
                CommitHub
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNav.map((item) => {
                const Icon = ICON_MAP[item.icon];
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href} onClick={handleLinkClick}>
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSystem.map((item) => {
                const Icon = ICON_MAP[item.icon];
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href} onClick={handleLinkClick}>
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
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
      </SidebarFooter>
    </Sidebar>
  );
}
