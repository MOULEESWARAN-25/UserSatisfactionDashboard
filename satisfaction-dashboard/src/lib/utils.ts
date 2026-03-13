import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function formatDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
}

export function getDeltaColor(delta: number): string {
  if (delta > 0) return "text-primary";
  if (delta < 0) return "text-destructive";
  return "text-muted-foreground";
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-primary";
  if (rating >= 3.5) return "text-accent-foreground";
  if (rating >= 2.5) return "text-muted-foreground";
  return "text-destructive";
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - dateObj.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return formatDate(dateObj);
}
