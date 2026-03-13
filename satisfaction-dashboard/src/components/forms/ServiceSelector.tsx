"use client";

import { SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  BookOpen,
  Monitor,
  Building2,
  Calendar,
  LucideIcon,
} from "lucide-react";
import type { ServiceId } from "@/types/feedback";

interface ServiceSelectorProps {
  selected: ServiceId | null;
  onChange: (id: ServiceId) => void;
}

const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  cafeteria: UtensilsCrossed,
  library: BookOpen,
  "online-course": Monitor,
  hostel: Building2,
  "campus-event": Calendar,
};

export function ServiceSelector({ selected, onChange }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {SERVICES.map((service) => {
        const Icon = SERVICE_ICONS[service.id];
        const isSelected = selected === service.id;

        return (
          <Button
            key={service.id}
            type="button"
            variant="ghost"
            onClick={() => onChange(service.id)}
            className={cn(
              "group relative flex h-auto flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all hover:border-primary/50 hover:shadow-sm",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:bg-accent/50"
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium leading-tight">
              {service.name}
            </span>
            {isSelected && (
              <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
