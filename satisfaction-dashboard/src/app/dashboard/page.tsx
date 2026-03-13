"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, TrendingUp, Users, AlertCircle, CheckCircle2, Clock, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { SatisfactionTrendChart } from "@/components/charts/SatisfactionTrendChart";
import { ServiceHealthIndicator } from "@/components/dashboard/ServiceHealthIndicator";
import { TopComplaintsSummary } from "@/components/dashboard/TopComplaintsSummary";
import { ServiceComparisonChart } from "@/components/charts/ServiceComparisonChart";
import { ImprovementAreasCard } from "@/components/charts/ImprovementAreasCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EnhancedDashboard } from "@/types/analytics";
import { formatScore, cn } from "@/lib/utils";
import { MOCK_ENHANCED_DASHBOARD, MOCK_FEEDBACK, MOCK_ADVANCED_ANALYTICS } from "@/lib/mock-data";

const statusConfig: Record<string, { icon: typeof AlertCircle; color: string; bg: string; label: string }> = {
  open: { icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/50", label: "Open" },
  investigating: { icon: Search, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/50", label: "Investigating" },
  in_progress: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/50", label: "In Progress" },
  resolved: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/50", label: "Resolved" },
};

const severityBadge: Record<string, string> = {
  critical: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function DashboardPage() {
  const [selectedService, setSelectedService] = useState("all");
  const [trendRange, setTrendRange] = useState<"7d" | "30d" | "semester" | "custom">("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [dashboard, setDashboard] = useState<EnhancedDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (selectedService !== "all") {
        const filtered = {
          ...MOCK_ENHANCED_DASHBOARD,
          detectedIssues: MOCK_ENHANCED_DASHBOARD.detectedIssues.filter(
            (i) => i.serviceId === selectedService
          ),
          topComplaints: MOCK_ENHANCED_DASHBOARD.topComplaints.filter((c) =>
            c.services?.some((s) =>
              s.toLowerCase().includes(selectedService.replace("-", " "))
            )
          ),
        };
        setDashboard(filtered);
      } else {
        setDashboard(MOCK_ENHANCED_DASHBOARD);
      }
      setLoading(false);
    }, 280);
  }, [selectedService]);

  const participationRate = dashboard?.participation?.participationRate ?? 0;
  const criticalIssues = (dashboard?.detectedIssues ?? []).filter(
    (i) => i.severity === "critical" || i.severity === "high"
  ).slice(0, 4);
  const recentFeedback = MOCK_FEEDBACK.slice(0, 5);
  const serviceHealth = dashboard?.serviceHealth ?? [];
  const healthSummary = {
    healthy: serviceHealth.filter((s) => s.status === "excellent" || s.status === "good").length,
    attention: serviceHealth.filter((s) => s.status === "warning").length,
    critical: serviceHealth.filter((s) => s.status === "critical").length,
  };

  const allTrends = dashboard?.trends ?? [];

  const parseTrendDate = (label: string): Date | null => {
    const [month, day] = label.split("/").map(Number);
    if (!month || !day) return null;
    const dt = new Date();
    dt.setMonth(month - 1);
    dt.setDate(day);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  let filteredTrends = allTrends;
  if (trendRange === "7d") filteredTrends = allTrends.slice(-7);
  if (trendRange === "30d") filteredTrends = allTrends.slice(-30);
  if (trendRange === "custom" && customStart && customEnd) {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    filteredTrends = allTrends.filter((point) => {
      const pointDate = parseTrendDate(point.date);
      if (!pointDate) return false;
      return pointDate >= start && pointDate <= end;
    });
  }

  const chartTrends = filteredTrends.length > 0 ? filteredTrends : allTrends;

  const trendAvgScore = chartTrends.length
    ? chartTrends.reduce((sum, t) => sum + t.score, 0) / chartTrends.length
    : 0;
  const trendResponses = chartTrends.reduce((sum, t) => sum + t.count, 0);

  return (
    <AdminOnly>
      <AppShell
        title="Dashboard"
        description="Campus service satisfaction at a glance"
      >
        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Filter */}
          <motion.div variants={staggerItem}>
            <ServiceFilter selected={selectedService} onChange={setSelectedService} />
          </motion.div>

          {/* KPI Row */}
          <motion.div variants={staggerItem} className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 xl:grid-cols-5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            ) : (
              <>
                <MetricCard
                  title="Total Feedback"
                  value={dashboard?.metrics.totalFeedback ?? 0}
                  delta={dashboard?.metrics.totalFeedbackDelta}
                  description="from last month"
                  icon={MessageSquare}
                  index={0}
                />
                <MetricCard
                  title="Avg Satisfaction"
                  value={`${formatScore(dashboard?.metrics.avgSatisfaction ?? 0)} / 5`}
                  delta={dashboard?.metrics.avgSatisfactionDelta}
                  description="overall score"
                  icon={Star}
                  index={1}
                />
                <MetricCard
                  title="Participation"
                  value={`${participationRate.toFixed(1)}%`}
                  description={`${dashboard?.participation?.uniqueRespondents ?? 0} of ${dashboard?.participation?.totalStudents ?? 0} students`}
                  icon={Users}
                  index={2}
                />
                <MetricCard
                  title="Active Issues"
                  value={criticalIssues.length}
                  description={criticalIssues.length === 0 ? "all systems normal" : "need attention"}
                  icon={TrendingUp}
                  index={3}
                />
                <MetricCard
                  title="Service Health"
                  value={`${healthSummary.healthy} good`}
                  description={`${healthSummary.attention} attention · ${healthSummary.critical} critical`}
                  icon={CheckCircle2}
                  index={4}
                />
              </>
            )}
          </motion.div>

          {/* Trend + Issues row */}
          <motion.div variants={staggerItem} className="grid gap-4 lg:grid-cols-5">
            {/* Satisfaction Trend - wider */}
            <div className="lg:col-span-3">
              {loading ? (
                <Skeleton className="h-72 rounded-xl" />
              ) : (
                <SatisfactionTrendChart
                  data={chartTrends}
                  index={0}
                  toolbar={(
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trend Window</p>
                        <select
                          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                          value={trendRange}
                          onChange={(e) => setTrendRange(e.target.value as "7d" | "30d" | "semester" | "custom")}
                        >
                          <option value="7d">Last 7 days</option>
                          <option value="30d">Last 30 days</option>
                          <option value="semester">Semester</option>
                          <option value="custom">Custom range</option>
                        </select>
                      </div>
                      {trendRange === "custom" && (
                        <>
                          <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">From</p>
                            <input
                              type="date"
                              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                              value={customStart}
                              onChange={(e) => setCustomStart(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">To</p>
                            <input
                              type="date"
                              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                              value={customEnd}
                              onChange={(e) => setCustomEnd(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                      <div className="ml-auto flex gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                          <p className="font-semibold">{trendAvgScore.toFixed(2)} / 5</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Responses</p>
                          <p className="font-semibold">{trendResponses}</p>
                        </div>
                      </div>
                    </div>
                  )}
                />
              )}
            </div>

            {/* Active Issues panel */}
            <div className="lg:col-span-2">
              {loading ? (
                <Skeleton className="h-72 rounded-xl" />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base font-semibold">Active Issues</CardTitle>
                          <CardDescription>Requires attention</CardDescription>
                        </div>
                        {criticalIssues.length > 0 && (
                          <Badge variant="destructive" className="rounded-full text-xs">
                            {criticalIssues.length}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4">
                      {criticalIssues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CheckCircle2 className="mb-2 h-10 w-10 text-emerald-500" />
                          <p className="text-sm font-medium">All systems normal</p>
                          <p className="text-xs text-muted-foreground">No issues detected</p>
                        </div>
                      ) : (
                        criticalIssues.map((issue, idx) => {
                          const cfg = statusConfig[issue.status] ?? statusConfig.open;
                          const StatusIcon = cfg.icon;
                          return (
                            <motion.div
                              key={issue.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + idx * 0.06 }}
                              className="flex items-start gap-2.5 rounded-lg border p-2.5 transition-colors hover:bg-muted/40"
                            >
                              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", cfg.bg)}>
                                <StatusIcon className={cn("h-3.5 w-3.5", cfg.color)} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium">{issue.title}</p>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                  <span className={cn("inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium", severityBadge[issue.severity])}>
                                    {issue.severity}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">{issue.serviceName}</span>
                                  <span className="text-[10px] text-muted-foreground">• {issue.daysSinceDetection ?? 0}d unresolved</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Service Health + Top Complaints */}
          <motion.div variants={staggerItem} className="grid gap-4 lg:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
              </>
            ) : (
              <>
                <ServiceHealthIndicator
                  services={dashboard?.serviceHealth ?? []}
                  index={2}
                />
                <TopComplaintsSummary
                  complaints={(dashboard?.topComplaints ?? []).slice(0, 4)}
                  index={3}
                />
              </>
            )}
          </motion.div>

          {/* Service Comparison + Improvement Areas */}
          <motion.div variants={staggerItem} className="grid gap-4 lg:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
              </>
            ) : (
              <>
                <ServiceComparisonChart data={dashboard?.serviceBreakdown ?? []} index={4} />
                <ImprovementAreasCard data={MOCK_ADVANCED_ANALYTICS.improvementAreas} index={5} />
              </>
            )}
          </motion.div>

          {/* Recent Feedback */}
          {loading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">Recent Feedback</CardTitle>
                        <CardDescription>Latest student submissions</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
                      <a href="/feedback">View all <ArrowRight className="h-3 w-3" /></a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {recentFeedback.map((item, idx) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + idx * 0.05 }}
                        className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/30"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.serviceName}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.comment || "No comment"}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                            item.overallSatisfaction >= 4
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : item.overallSatisfaction >= 3
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                          )}>
                            <Star className="h-3 w-3 fill-current" />
                            {item.overallSatisfaction}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.studentName?.split(" ")[0]}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </AppShell>
    </AdminOnly>
  );
}
