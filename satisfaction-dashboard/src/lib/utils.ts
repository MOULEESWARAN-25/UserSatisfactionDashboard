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
  if (delta > 0) return "text-emerald-600 dark:text-emerald-400";
  if (delta < 0) return "text-red-500 dark:text-red-400";
  return "text-muted-foreground";
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-emerald-600";
  if (rating >= 3.5) return "text-blue-600";
  if (rating >= 2.5) return "text-yellow-600";
  return "text-red-500";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
