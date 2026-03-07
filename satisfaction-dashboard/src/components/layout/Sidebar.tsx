"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Grid3x3,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

// Admin navigation items
const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Services", href: "/services", icon: Grid3x3 },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Feedback", href: "/feedback", icon: MessageSquare },
];

// Student navigation items
const STUDENT_NAV_ITEMS = [
  { label: "Submit Feedback", href: "/feedback/submit", icon: MessageSquare },
];

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : isStudent ? STUDENT_NAV_ITEMS : [];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex h-screen flex-col border-r border-border/40 bg-card"
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-[60px] shrink-0 items-center border-b border-border/40 px-4",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PanelLeft className="h-4 w-4 text-primary-foreground" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-semibold tracking-tight">
                SatisfyIQ
              </span>
              <span className="text-[10px] text-muted-foreground">
                Feedback Analytics
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User info */}
      <AnimatePresence>
        {user && !collapsed && (
          <motion.div
            className="border-b border-border/40 px-4 py-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {user.role} &bull; {user.id}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isAdmin ? "Overview" : "Actions"}
            </motion.p>
          )}
        </AnimatePresence>
        {navItems.map(({ label, href, icon: Icon }, index) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <motion.div
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? label : undefined}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ x: collapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "" : "group-hover:text-foreground"
                  )}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto space-y-1 border-t border-border/40 px-3 py-4">
        {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <motion.div
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? label : undefined}
              whileHover={{ x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Logout" : undefined}
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse toggle */}
      <motion.div
        className="absolute -right-3.5 top-16 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full border bg-background shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.div>
        </Button>
      </motion.div>
    </motion.aside>
  );
}
