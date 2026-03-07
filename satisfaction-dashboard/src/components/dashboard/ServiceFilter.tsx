"use client";

import { SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceFilterProps {
  selected: string;
  onChange: (serviceId: string) => void;
}

export function ServiceFilter({ selected, onChange }: ServiceFilterProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Button
        variant={selected === "all" ? "default" : "outline"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => onChange("all")}
      >
        All Services
      </Button>
      {SERVICES.map((service) => (
        <Button
          key={service.id}
          variant={selected === service.id ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={() => onChange(service.id)}
        >
          <span>{service.icon}</span>
          {service.name}
        </Button>
      ))}
    </div>
  );
}
