"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Grid3x3,
  BarChart3, FileText, Settings, GraduationCap,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Feedback", href: "/feedback", icon: MessageSquare },
  { label: "Services", href: "/services", icon: Grid3x3 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Reports", href: "/reports", icon: FileText },
];

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-card border-r border-border transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 px-4 border-b border-border shrink-0",
        collapsed ? "justify-center" : "gap-2"
      )}>
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground">
          <GraduationCap size={14} />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm tracking-tight">SatisfyIQ</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Main
          </p>
        )}
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors cursor-pointer",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center"
                )}
                title={collapsed ? label : undefined}
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </div>
            </Link>
          );
        })}

        <Separator className="my-3" />

        {!collapsed && (
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Student
          </p>
        )}
        <Link href="/feedback/submit">
          <div
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors cursor-pointer",
              pathname === "/feedback/submit"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Submit Feedback" : undefined}
          >
            <MessageSquare size={16} className="shrink-0" />
            {!collapsed && <span>Submit Feedback</span>}
          </div>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-0.5">
        {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors cursor-pointer",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </div>
          </Link>
        ))}
      </div>

      {/* Collapse toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-16 h-7 w-7 rounded-full border shadow-sm bg-background z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>
    </aside>
  );
}
