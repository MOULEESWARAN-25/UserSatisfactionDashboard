"use client";

import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 gap-4">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        {title && (
          <div>
            <h1 className="text-sm font-semibold truncate">{title}</h1>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex relative w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
        <Input
          placeholder="Search feedback, services..."
          className="pl-8 h-8 text-xs bg-muted/50 border-0 focus-visible:ring-1"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings size={16} />
        </Button>

        <Avatar className="h-7 w-7 ml-1">
          <AvatarImage src="" />
          <AvatarFallback className="text-[10px]">AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
