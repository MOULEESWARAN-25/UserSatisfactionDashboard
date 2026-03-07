"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  required?: boolean;
}

export function RatingInput({
  value,
  onChange,
  label,
  required,
}: RatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between py-3">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              className="rounded-md p-1 transition-all hover:scale-110 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-amber-950"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
            >
              <Star
                className={cn(
                  "h-5 w-5 transition-colors",
                  active
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/30"
                )}
              />
            </button>
          );
        })}
        <span
          className={cn(
            "ml-2 w-6 text-center text-xs font-semibold tabular-nums",
            value > 0 ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {value > 0 ? value : "-"}
        </span>
      </div>
    </div>
  );
}
