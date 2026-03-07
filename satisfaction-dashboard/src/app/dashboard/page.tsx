"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare, Star, TrendingUp, Activity,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { RecentFeedback } from "@/components/dashboard/RecentFeedback";
import { SatisfactionOverview } from "@/components/dashboard/SatisfactionOverview";
import { SatisfactionTrendChart } from "@/components/charts/SatisfactionTrendChart";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { FeedbackGrowthChart } from "@/components/charts/FeedbackGrowthChart";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsDashboard } from "@/types/analytics";
import type { FeedbackRecord } from "@/types/feedback";
import { formatScore } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedService, setSelectedService] = useState("all");
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = selectedService !== "all" ? `?serviceId=${selectedService}` : "";
    Promise.all([
      fetch(`/api/analytics${params}`).then((r) => r.json()),
      fetch(`/api/feedback${params}&limit=8`).then((r) => r.json()),
    ]).then(([analyticsData, feedbackData]) => {
      setAnalytics(analyticsData);
      setFeedback(feedbackData.feedback ?? []);
    }).finally(() => setLoading(false));
  }, [selectedService]);

  return (
    <AppShell
      title="Dashboard"
      description="Campus service satisfaction overview"
    >
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <ServiceFilter selected={selectedService} onChange={setSelectedService} />
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Feedback"
              value={analytics?.metrics.totalFeedback ?? 0}
              delta={analytics?.metrics.totalFeedbackDelta}
              description="from last month"
              icon={MessageSquare}
            />
            <MetricCard
              title="Avg Satisfaction"
              value={`${formatScore(analytics?.metrics.avgSatisfaction ?? 0)} / 5`}
              delta={analytics?.metrics.avgSatisfactionDelta}
              description="overall score"
              icon={Star}
            />
            <MetricCard
              title="Weekly Responses"
              value={analytics?.metrics.weeklyResponses ?? 0}
              delta={analytics?.metrics.weeklyResponsesDelta}
              description="last 7 days"
              icon={TrendingUp}
            />
            <MetricCard
              title="Top Service Score"
              value={`${formatScore(analytics?.metrics.topServiceScore ?? 0)} / 5`}
              description="best rated service"
              icon={Activity}
            />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {loading ? (
              <Skeleton className="h-72 rounded-xl" />
            ) : (
              <SatisfactionTrendChart data={analytics?.trends ?? []} />
            )}
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-72 rounded-xl" />
            ) : (
              <RatingDistributionChart data={analytics?.ratingDistribution ?? []} />
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {loading ? (
              <Skeleton className="h-64 rounded-xl" />
            ) : (
              <RecentFeedback feedback={feedback} />
            )}
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-64 rounded-xl" />
            ) : (
              <SatisfactionOverview data={analytics?.serviceBreakdown ?? []} />
            )}
          </div>
        </div>

        {/* Feedback Growth */}
        {!loading && (
          <FeedbackGrowthChart data={analytics?.trends ?? []} />
        )}
      </div>
    </AppShell>
  );
}
