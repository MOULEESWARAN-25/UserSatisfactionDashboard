/**
 * Shared React Query hooks for fetching app data.
 * Data is cached for 5 minutes — navigation between pages never re-fetches.
 */
import { useQuery } from "@tanstack/react-query";
import type { AnalyticsDashboard } from "@/types/analytics";
import type { FeedbackRecord } from "@/types/feedback";

// ── fetch helpers ─────────────────────────────────────────────────────────────
async function fetchAnalytics(serviceId = "all"): Promise<AnalyticsDashboard> {
  const params = serviceId !== "all" ? `?serviceId=${serviceId}` : "";
  const res = await fetch(`/api/analytics${params}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

async function fetchFeedback(serviceId = "all", limit = 100): Promise<FeedbackRecord[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (serviceId !== "all") params.set("serviceId", serviceId);
  const res = await fetch(`/api/feedback?${params}`);
  if (!res.ok) throw new Error("Failed to fetch feedback");
  const data = await res.json();
  return data.feedback ?? [];
}

async function fetchMyFeedback(studentId: string): Promise<FeedbackRecord[]> {
  const res = await fetch(`/api/feedback?studentId=${encodeURIComponent(studentId)}&limit=100`);
  if (!res.ok) throw new Error("Failed to fetch student feedback");
  const data = await res.json();
  return data.feedback ?? [];
}

// ── hooks ─────────────────────────────────────────────────────────────────────

/** Analytics data (cached per serviceId) */
export function useAnalytics(serviceId = "all") {
  return useQuery({
    queryKey: ["analytics", serviceId],
    queryFn: () => fetchAnalytics(serviceId),
  });
}

/** All feedback, optionally filtered by service (cached per serviceId) */
export function useFeedback(serviceId = "all", limit = 100) {
  return useQuery({
    queryKey: ["feedback", serviceId, limit],
    queryFn: () => fetchFeedback(serviceId, limit),
  });
}

/** Recent feedback for dashboard (small, cached separately) */
export function useRecentFeedback(limit = 5) {
  return useQuery({
    queryKey: ["feedback", "recent", limit],
    queryFn: () => fetchFeedback("all", limit),
  });
}

/** Student's own feedback submissions (cached per studentId) */
export function useMyFeedback(studentId: string | undefined) {
  return useQuery({
    queryKey: ["feedback", "mine", studentId],
    queryFn: () => fetchMyFeedback(studentId!),
    enabled: !!studentId,
  });
}

/** Fetch services dynamically */
async function fetchServices() {
  const res = await fetch("/api/services");
  if (!res.ok) throw new Error("Failed to fetch services");
  const data = await res.json();
  return data.services ?? [];
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
}
