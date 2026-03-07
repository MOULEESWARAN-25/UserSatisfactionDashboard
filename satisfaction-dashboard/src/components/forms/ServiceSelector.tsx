"use client";

import { SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ServiceId } from "@/types/feedback";

interface ServiceSelectorProps {
  selected: ServiceId | null;
  onChange: (id: ServiceId) => void;
}

export function ServiceSelector({ selected, onChange }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {SERVICES.map((service) => (
        <button
          key={service.id}
          type="button"
          onClick={() => onChange(service.id)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
            "hover:border-primary/50 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected === service.id
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border bg-card"
          )}
        >
          <span className="text-2xl">{service.icon}</span>
          <span className="text-sm font-medium leading-tight">{service.name}</span>
        </button>
      ))}
    </div>
  );
}
