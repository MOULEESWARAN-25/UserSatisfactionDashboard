"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { ServiceComparisonChart } from "@/components/charts/ServiceComparisonChart";
import { ImprovementAreasCard } from "@/components/charts/ImprovementAreasCard";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { Users, BarChart3, Award, AlertTriangle, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AnalyticsDashboard, AdvancedAnalytics } from "@/types/analytics";
import { MOCK_ANALYTICS, MOCK_ADVANCED_ANALYTICS } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const [selected, setSelected] = useState("all");
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [advancedAnalytics, setAdvancedAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = selected !== "all" ? `?serviceId=${selected}` : "";
    fetch(`/api/analytics${params}`)
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data);
        setAdvancedAnalytics(MOCK_ADVANCED_ANALYTICS);
      })
      .catch(() => {
        setAnalytics(MOCK_ANALYTICS);
        setAdvancedAnalytics(MOCK_ADVANCED_ANALYTICS);
      })
      .finally(() => setLoading(false));
  }, [selected]);

  const positiveCount = advancedAnalytics?.sentiment.positive ?? 0;
  const totalSentiment =
    (advancedAnalytics?.sentiment.positive ?? 0) +
    (advancedAnalytics?.sentiment.neutral ?? 0) +
    (advancedAnalytics?.sentiment.negative ?? 0);
  const positiveRate = totalSentiment > 0 ? Math.round((positiveCount / totalSentiment) * 100) : 0;

  const serviceDetails = advancedAnalytics?.serviceDetails ?? [];
  const sortedByScore = [...(analytics?.serviceBreakdown ?? [])].sort((a, b) => b.avgScore - a.avgScore);
  const bestService = sortedByScore[0];
  const lowestService = [...(analytics?.serviceBreakdown ?? [])].sort((a, b) => a.avgScore - b.avgScore)[0];
  const mostActive = [...(analytics?.serviceBreakdown ?? [])].sort((a, b) => b.totalFeedback - a.totalFeedback)[0];
  const improvementCount = advancedAnalytics?.improvementAreas?.length ?? 0;
  const needsAttentionCount = (analytics?.serviceBreakdown ?? []).filter((s) => s.avgScore < 3.5).length;

  const findTopComplaintCategory = (serviceName: string) => {
    const issue = (advancedAnalytics?.topIssues ?? []).find((item) =>
      item.toLowerCase().includes(serviceName.toLowerCase().split(" ")[0])
    );
    if (!issue) return "General";
    if (issue.toLowerCase().includes("wifi") || issue.toLowerCase().includes("stability")) return "Infrastructure";
    if (issue.toLowerCase().includes("pricing") || issue.toLowerCase().includes("cost")) return "Pricing";
    if (issue.toLowerCase().includes("seating")) return "Capacity";
    if (issue.toLowerCase().includes("communication")) return "Communication";
    return "Service Quality";
  };

  return (
    <AdminOnly>
      <AppShell title="Analytics" description="Deep insights into student satisfaction">
        <div className="space-y-6">
          <ServiceFilter selected={selected} onChange={setSelected} />

          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            ) : (
              <>
                {[
                  {
                    label: "Top Performer",
                    value: bestService?.serviceName ?? "\u2014",
                    icon: Award,
                    color: "text-amber-600 dark:text-amber-400",
                    bg: "bg-amber-50 dark:bg-amber-950/60",
                    accent: "from-amber-500/15 to-transparent",
                  },
                  {
                    label: "Most Active Service",
                    value: mostActive?.serviceName ?? "\u2014",
                    icon: BarChart3,
                    color: "text-indigo-600 dark:text-indigo-400",
                    bg: "bg-indigo-50 dark:bg-indigo-950/60",
                    accent: "from-indigo-500/15 to-transparent",
                  },
                  {
                    label: "Positive Sentiment",
                    value: `${positiveRate}%`,
                    icon: Users,
                    color: "text-emerald-600 dark:text-emerald-400",
                    bg: "bg-emerald-50 dark:bg-emerald-950/60",
                    accent: "from-emerald-500/15 to-transparent",
                  },
                  {
                    label: "Needs Attention",
                    value: `${needsAttentionCount} service${needsAttentionCount !== 1 ? "s" : ""}`,
                    icon: AlertTriangle,
                    color: "text-rose-600 dark:text-rose-400",
                    bg: "bg-rose-50 dark:bg-rose-950/60",
                    accent: "from-rose-500/15 to-transparent",
                  },
                  {
                    label: "Lowest Performer",
                    value: lowestService?.serviceName ?? "\u2014",
                    icon: TrendingDown,
                    color: "text-orange-600 dark:text-orange-400",
                    bg: "bg-orange-50 dark:bg-orange-950/60",
                    accent: "from-orange-500/15 to-transparent",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="relative flex min-h-[90px] items-center gap-4 p-4">
                        <div className={cn("pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l opacity-70", stat.accent)} />
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", stat.bg)}>
                          <stat.icon className={cn("h-5 w-5", stat.color)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-bold leading-tight">{stat.value}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              {loading ? (
                <Skeleton className="h-[380px] rounded-xl" />
              ) : (
                <ServiceComparisonChart data={analytics?.serviceBreakdown ?? []} />
              )}

              {loading ? (
                <Skeleton className="h-[300px] rounded-xl" />
              ) : (
                <RatingDistributionChart data={analytics?.ratingDistribution ?? []} />
              )}
            </div>

            <div className="space-y-6">
              {loading ? (
                <Skeleton className="h-[320px] rounded-xl" />
              ) : (
                <ImprovementAreasCard data={advancedAnalytics?.improvementAreas ?? []} />
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Current emotional distribution across responses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "Positive",
                      value: advancedAnalytics?.sentiment.positive ?? 0,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Neutral",
                      value: advancedAnalytics?.sentiment.neutral ?? 0,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Negative",
                      value: advancedAnalytics?.sentiment.negative ?? 0,
                      color: "bg-rose-500",
                    },
                  ].map((item) => {
                    const pct = totalSentiment > 0 ? (item.value / totalSentiment) * 100 : 0;
                    return (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-semibold">{Math.round(pct)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={cn("h-full rounded-full", item.color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                    <p>
                      {positiveRate}% of analyzed responses are currently positive.
                    </p>
                    <p className="mt-1">{totalSentiment} total responses analyzed.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Operational scorecard by service</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-28 rounded-xl" />
              ) : serviceDetails.length === 0 ? (
                <p className="text-sm text-muted-foreground">No service detail data available.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {serviceDetails.map((service) => (
                    <div key={service.serviceId} className="rounded-lg border bg-muted/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{service.serviceName}</p>
                        <p className="text-xs text-muted-foreground">{service.questionRatings.length} metrics</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                        <span>Avg Score</span>
                        <span className="font-medium text-foreground">
                          {(
                            service.questionRatings.reduce((sum, q) => sum + q.avgRating, 0) /
                            Math.max(service.questionRatings.length, 1)
                          ).toFixed(1)}
                          /5
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                        <span>Total Feedback</span>
                        <span className="font-medium text-foreground">
                          {analytics?.serviceBreakdown.find((s) => s.serviceId === service.serviceId)?.totalFeedback ?? 0}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                        <span>Participation</span>
                        <span className="font-medium text-foreground">{service.responseRate}%</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                        <span>Top Complaint</span>
                        <span className="font-medium text-foreground">{findTopComplaintCategory(service.serviceName)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            {improvementCount} improvement area{improvementCount !== 1 ? "s" : ""} currently tracked.
          </p>
        </div>
      </AppShell>
    </AdminOnly>
  );
}
