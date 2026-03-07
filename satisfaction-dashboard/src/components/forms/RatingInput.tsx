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

export function RatingInput({ value, onChange, label, required }: RatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
            >
              <Star
                size={20}
                className={cn(
                  "transition-colors",
                  active ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground/40"
                )}
              />
            </button>
          );
        })}
        {value > 0 && (
          <span className="ml-2 text-xs font-medium text-muted-foreground w-4 tabular-nums">
            {value}/5
          </span>
        )}
      </div>
    </div>
  );
}
