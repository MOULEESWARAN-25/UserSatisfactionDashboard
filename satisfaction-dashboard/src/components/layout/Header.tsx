"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Command, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

interface HeaderProps {
  title?: string;
  description?: string;
}

interface SearchResult {
  type: "service" | "page";
  title: string;
  href: string;
  description?: string;
}

const PAGES = [
  { title: "Dashboard", href: "/dashboard", description: "Overview and metrics" },
  { title: "Analytics", href: "/analytics", description: "Advanced insights" },
  { title: "Services", href: "/services", description: "Manage campus services" },
  { title: "Reports", href: "/reports", description: "Generate reports" },
  { title: "Feedback", href: "/feedback", description: "View all feedback" },
  { title: "Settings", href: "/settings", description: "App configuration" },
];

export function Header({ title, description }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search pages
    PAGES.forEach((page) => {
      if (
        page.title.toLowerCase().includes(query) ||
        page.description?.toLowerCase().includes(query)
      ) {
        results.push({
          type: "page",
          title: page.title,
          href: page.href,
          description: page.description,
        });
      }
    });

    // Search services
    SERVICES.forEach((service) => {
      if (service.name.toLowerCase().includes(query)) {
        results.push({
          type: "service",
          title: service.name,
          href: `/services?service=${service.id}`,
          description: `View ${service.name} feedback`,
        });
      }
    });

    setSearchResults(results.slice(0, 6));
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        document.getElementById("header-search")?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleResultClick = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setShowResults(false);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left: Page context */}
      <div className="flex flex-col gap-0.5">
        {title && (
          <h1 className="text-base font-semibold leading-none tracking-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search (admin only) */}
        {user?.role === "admin" && (
          <div className="relative hidden lg:flex" ref={searchRef}>
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="header-search"
              placeholder="Search..."
              className="h-9 w-64 rounded-lg border-0 bg-muted/50 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <Command className="h-3 w-3" />K
            </kbd>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-border bg-popover p-1 shadow-lg">
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.type}-${result.href}`}
                    className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted"
                    onClick={() => handleResultClick(result.href)}
                  >
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {result.type === "page" ? "📄" : "🏢"}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{result.title}</p>
                      {result.description && (
                        <p className="text-xs text-muted-foreground">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-border bg-popover p-4 text-center shadow-lg">
                <p className="text-sm text-muted-foreground">No results found</p>
              </div>
            )}
          </div>
        )}

        <ThemeToggle />

        {/* Notifications (admin only) */}
        {user?.role === "admin" && <NotificationsDropdown />}

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 gap-2 rounded-lg px-2 hover:bg-muted"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src="" alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-left md:flex">
                <span className="text-sm font-medium leading-none">
                  {user?.name}
                </span>
                <span className="text-xs capitalize text-muted-foreground">
                  {user?.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.id} ({user?.role})
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
