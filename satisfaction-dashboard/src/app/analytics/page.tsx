"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { SatisfactionTrendChart } from "@/components/charts/SatisfactionTrendChart";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { FeedbackGrowthChart } from "@/components/charts/FeedbackGrowthChart";
import { SatisfactionOverview } from "@/components/dashboard/SatisfactionOverview";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsDashboard } from "@/types/analytics";

export default function AnalyticsPage() {
  const [selected, setSelected] = useState("all");
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = selected !== "all" ? `?serviceId=${selected}` : "";
    fetch(`/api/analytics${params}`)
      .then((r) => r.json())
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <AppShell title="Analytics" description="Deep-dive into satisfaction metrics">
      <div className="space-y-5">
        <ServiceFilter selected={selected} onChange={setSelected} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            <>
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </>
          ) : (
            <>
              <SatisfactionTrendChart data={analytics?.trends ?? []} />
              <RatingDistributionChart data={analytics?.ratingDistribution ?? []} />
              <FeedbackGrowthChart data={analytics?.trends ?? []} />
              <SatisfactionOverview data={analytics?.serviceBreakdown ?? []} />
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
