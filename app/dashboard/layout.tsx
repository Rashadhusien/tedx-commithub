// src/app/(dashboard)/layout.tsx
import { requireAuth } from "@/lib/auth/helpers";
import TopBarWrapper from "@/components/layout/topbar-wrapper";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <div className="flex h-screen overflow-hidden bg-background">
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopBarWrapper user={user} />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
