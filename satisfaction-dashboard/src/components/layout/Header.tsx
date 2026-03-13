"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  LogOut,
  LayoutDashboard,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  Grid3x3,
  Megaphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  title?: string;
  description?: string;
}

interface SearchResult {
  title: string;
  href: string;
  description: string;
  icon: typeof LayoutDashboard;
}

const PAGES: SearchResult[] = [
  { title: "Dashboard", href: "/dashboard", description: "Overview & metrics", icon: LayoutDashboard },
  { title: "Analytics", href: "/analytics", description: "Deep insights & trends", icon: BarChart3 },
  { title: "Services", href: "/services", description: "Manage campus services", icon: Grid3x3 },
  { title: "Reports", href: "/reports", description: "Generate & download reports", icon: FileText },
  { title: "Feedback", href: "/feedback", description: "Browse all feedback", icon: MessageSquare },
  { title: "My Feedback", href: "/feedback/my", description: "Review your previous submissions", icon: FileText },
  { title: "Feedback Impact", href: "/announcements", description: "See changes made from student feedback", icon: Megaphone },
  { title: "Settings", href: "/settings", description: "Configuration", icon: Settings },
];

export function Header({ title, description }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const matched: SearchResult[] = [];
    PAGES.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        matched.push(p);
    });
    SERVICES.forEach((s) => {
      if (s.name.toLowerCase().includes(q))
        matched.push({ title: s.name, href: `/services?service=${s.id}`, description: `${s.name} feedback data`, icon: Grid3x3 });
    });
    setResults(matched.slice(0, 5));
  }, [query]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("hs")?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 flex h-[58px] items-center justify-between border-b border-border/50 bg-background/90 px-6 backdrop-blur-md">
      {/* Page title */}
      <div>
        {title && (
          <h1 className="text-[15px] font-semibold leading-tight tracking-tight">{title}</h1>
        )}
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        {user?.role === "college_admin" && (
          <div className="relative mr-1" ref={ref}>
            <div
              className="hidden lg:flex h-8 items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 text-muted-foreground transition-all hover:border-border/80 cursor-text"
              style={{ minWidth: 148 }}
              onClick={() => { document.getElementById("hs")?.focus(); setOpen(true); }}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <input
                id="hs"
                autoComplete="off"
                className="w-24 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
              />
              <span className="pointer-events-none hidden text-[10px] text-muted-foreground/50 sm:block">
                ⌘K
              </span>
            </div>
            <AnimatePresence>
              {open && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.13 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/60 bg-popover p-1.5 shadow-xl shadow-black/5"
                >
                  {results.map((r) => (
                    <button
                      key={r.href}
                      onClick={() => { router.push(r.href); setQuery(""); setOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <r.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <ThemeToggle />
        {user?.role === "college_admin" && <NotificationsDropdown />}

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="ml-0.5 h-8 w-8 rounded-full p-0 ring-2 ring-transparent hover:ring-border/60 transition-all"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-[11px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="py-2.5 font-normal">
              <p className="text-sm font-semibold leading-tight">{user?.name}</p>
              <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                {user?.role?.replace(/_/g, " ")} · {user?.id}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 rounded-lg text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}