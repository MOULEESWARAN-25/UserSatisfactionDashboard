"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { ServiceComparisonChart } from "@/components/charts/ServiceComparisonChart";
import { SentimentCard } from "@/components/charts/SentimentCard";
import { ImprovementAreasCard } from "@/components/charts/ImprovementAreasCard";
import { RatingDistributionChart } from "@/components/charts/RatingDistributionChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { TrendingUp, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
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
        // Use mock advanced analytics for now
        setAdvancedAnalytics(MOCK_ADVANCED_ANALYTICS);
      })
      .finally(() => setLoading(false));
  }, [selected]);

  const responseRate = advancedAnalytics
    ? Math.round(
        advancedAnalytics.serviceDetails.reduce((acc, s) => acc + s.responseRate, 0) /
          advancedAnalytics.serviceDetails.length
      )
    : 0;

  return (
    <AdminOnly>
      <AppShell
        title="Analytics"
        description="Advanced insights and detailed analysis"
      >
        <div className="space-y-6">
          <ServiceFilter selected={selected} onChange={setSelected} />

          {/* Quick Stats Row - Simplified to 3 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{responseRate}%</p>
                        <p className="text-xs text-muted-foreground">Response Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">
                          {advancedAnalytics?.sentiment.positive ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Positive Reviews</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950">
                        <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">
                          {advancedAnalytics?.improvementAreas.length ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Improvement Areas</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>

          {/* Main Analytics Grid - Removed Peak Hours */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-[380px] rounded-xl" />
                <Skeleton className="h-[380px] rounded-xl" />
                <Skeleton className="h-[280px] rounded-xl" />
                <Skeleton className="h-[280px] rounded-xl" />
              </>
            ) : (
              <>
                <ServiceComparisonChart
                  data={analytics?.serviceBreakdown ?? []}
                  index={0}
                />
                <SentimentCard
                  data={advancedAnalytics?.sentiment ?? { positive: 0, neutral: 0, negative: 0 }}
                  index={1}
                />
                <RatingDistributionChart
                  data={analytics?.ratingDistribution ?? []}
                  index={2}
                />
                <ImprovementAreasCard
                  data={advancedAnalytics?.improvementAreas ?? []}
                  index={3}
                />
              </>
            )}
          </div>

          {/* Top Issues Section */}
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <Skeleton className="h-[350px] rounded-xl" />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold">
                        Top Issues Reported
                      </CardTitle>
                      <CardDescription>
                        Most frequently mentioned concerns from feedback
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {advancedAnalytics?.topIssues.map((issue, idx) => (
                        <motion.li
                          key={issue}
                          className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {idx + 1}
                          </span>
                          <span className="text-sm">{issue}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </AppShell>
    </AdminOnly>
  );
}
