import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex flex-1 items-center justify-between gap-3">
              <h1 className="text-sm font-medium text-muted-foreground">
                {user?.role === "HR" ? "Admin Console" : "Employee Portal"}
              </h1>
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Welcome back, {user?.name ?? user?.email}
                </span>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
