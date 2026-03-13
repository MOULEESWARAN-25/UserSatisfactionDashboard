"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  Grid3x3,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  BarChart3,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type ComponentType } from "react";

type SidebarItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
};

const ADMIN_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Services", href: "/services", icon: Grid3x3 },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Feedback", href: "/feedback", icon: MessageSquare },
  { label: "Impact", href: "/impact", icon: Megaphone },
  { label: "Settings", href: "/settings", icon: Settings },
];

const STUDENT_ITEMS: SidebarItem[] = [
  { label: "Submit Feedback", href: "/feedback/submit", icon: MessageSquare },
  { label: "My Feedback", href: "/feedback/my", icon: FileText },
  { label: "Impact", href: "/impact", icon: Megaphone },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems: SidebarItem[] =
    user?.role === "college_admin"
      ? ADMIN_ITEMS
      : user?.role === "student"
        ? STUDENT_ITEMS
        : [];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const roleLabel = user?.role?.replace(/_/g, " ") ?? "user";

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 lg:flex lg:flex-col",
        isOpen ? "w-64" : "w-[64px]"
      )}
    >
      {isOpen ? (
        <>
          <div className="p-3 pb-2">
            <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-card/40 p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-sidebar-foreground">{user?.name ?? "User"}</p>
                <p className="truncate text-xs capitalize text-sidebar-foreground/60">{roleLabel}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onToggle}
                className="h-7 w-7 rounded-md text-sidebar-foreground/70 transition-colors hover:bg-muted hover:text-sidebar-foreground"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="px-3 pt-2">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50">Platform</p>
          </div>

          <div className="px-2 pt-1">
            {navItems.map(({ label, href, icon: Icon, count }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href}>
                  <div
                    className={cn(
                      "mb-1 flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 font-medium">{label}</span>
                    {typeof count === "number" && count > 0 && <span className="text-xs tabular-nums opacity-80">{count}</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-2.5">
            <Separator className="mb-2 bg-sidebar-border" />
            <div className="flex items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-sidebar-accent/70">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-chart-2 to-chart-4 text-xs font-semibold text-primary-foreground">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">{user?.name ?? "User"}</p>
                <p className="truncate text-xs capitalize text-sidebar-foreground/60">{roleLabel}</p>
                </div>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleLogout}
                className="h-7 w-7 rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center p-2.5">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={onToggle}
              className="h-10 w-10 border-sidebar-border bg-card/40 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-2 pb-2 pt-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href}>
                  <div
                    title={label}
                    className={cn(
                      "mb-1 flex h-10 items-center justify-center rounded-md transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-3">
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={onToggle}
                title={user?.name ?? "User"}
                className="h-10 w-10 overflow-hidden border-sidebar-border bg-card/40 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}