"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, TrendingUp, Activity } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { RecentFeedback } from "@/components/dashboard/RecentFeedback";
import { SatisfactionOverview } from "@/components/dashboard/SatisfactionOverview";
import { SatisfactionTrendChart } from "@/components/charts/SatisfactionTrendChart";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { FeedbackGrowthChart } from "@/components/charts/FeedbackGrowthChart";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
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
    const analyticsParams =
      selectedService !== "all" ? `?serviceId=${selectedService}` : "";
    const feedbackParams =
      selectedService !== "all"
        ? `?serviceId=${selectedService}&limit=8`
        : "?limit=8";
    Promise.all([
      fetch(`/api/analytics${analyticsParams}`).then((r) => r.json()),
      fetch(`/api/feedback${feedbackParams}`).then((r) => r.json()),
    ])
      .then(([analyticsData, feedbackData]) => {
        setAnalytics(analyticsData);
        setFeedback(feedbackData.feedback ?? []);
      })
      .finally(() => setLoading(false));
  }, [selectedService]);

  return (
    <AdminOnly>
      <AppShell
        title="Dashboard"
        description="Campus service satisfaction overview"
      >
        <div className="space-y-8">
          {/* Filter */}
          <ServiceFilter
            selected={selectedService}
            onChange={setSelectedService}
          />

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))
            ) : (
              <>
                <MetricCard
                  title="Total Feedback"
                  value={analytics?.metrics.totalFeedback ?? 0}
                  delta={analytics?.metrics.totalFeedbackDelta}
                  description="from last month"
                  icon={MessageSquare}
                  index={0}
                />
                <MetricCard
                  title="Avg Satisfaction"
                  value={`${formatScore(analytics?.metrics.avgSatisfaction ?? 0)} / 5`}
                  delta={analytics?.metrics.avgSatisfactionDelta}
                  description="overall score"
                  icon={Star}
                  index={1}
                />
                <MetricCard
                  title="Weekly Responses"
                  value={analytics?.metrics.weeklyResponses ?? 0}
                  delta={analytics?.metrics.weeklyResponsesDelta}
                  description="last 7 days"
                  icon={TrendingUp}
                  index={2}
                />
                <MetricCard
                  title="Top Service Score"
                  value={`${formatScore(analytics?.metrics.topServiceScore ?? 0)} / 5`}
                  description="best rated service"
                  icon={Activity}
                  index={3}
                />
              </>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {loading ? (
                <Skeleton className="h-80 rounded-xl" />
              ) : (
                <SatisfactionTrendChart data={analytics?.trends ?? []} index={0} />
              )}
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-80 rounded-xl" />
              ) : (
                <RatingDistributionChart
                  data={analytics?.ratingDistribution ?? []}
                  index={1}
                />
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {loading ? (
                <Skeleton className="h-72 rounded-xl" />
              ) : (
                <RecentFeedback feedback={feedback} index={0} />
              )}
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-72 rounded-xl" />
              ) : (
                <SatisfactionOverview
                  data={analytics?.serviceBreakdown ?? []}
                  index={1}
                />
              )}
            </div>
          </div>

          {/* Feedback Growth */}
          {!loading && <FeedbackGrowthChart data={analytics?.trends ?? []} index={2} />}
        </div>
      </AppShell>
    </AdminOnly>
  );
}
