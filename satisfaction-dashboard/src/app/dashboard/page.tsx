"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { RecentFeedback } from "@/components/dashboard/RecentFeedback";
import { IssueDetectionWidget } from "@/components/dashboard/IssueDetectionWidget";
import { ServiceRankingWidget } from "@/components/dashboard/ServiceRankingWidget";
import { TopComplaintsSummary } from "@/components/dashboard/TopComplaintsSummary";
import { DepartmentPerformanceWidget } from "@/components/dashboard/DepartmentPerformanceWidget";
import { SatisfactionTrendChart } from "@/components/charts/SatisfactionTrendChart";
import { ServiceHealthIndicator } from "@/components/dashboard/ServiceHealthIndicator";
import { ParticipationByService } from "@/components/dashboard/ParticipationByService";
import { AIInsightsWidget } from "@/components/dashboard/AIInsightsWidget";
import { WeeklySummaryCard } from "@/components/dashboard/WeeklySummaryCard";
import { StudentVoiceWidget } from "@/components/dashboard/StudentVoiceWidget";
import { HistoricalComparisonWidget } from "@/components/dashboard/HistoricalComparisonWidget";
import { IssueManagementPanel } from "@/components/dashboard/IssueManagementPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import type { EnhancedDashboard, OperationalDashboard } from "@/types/analytics";
import type { FeedbackRecord } from "@/types/feedback";
import { formatScore } from "@/lib/utils";
import { MOCK_ENHANCED_DASHBOARD } from "@/lib/mock-data";

export default function DashboardPage() {
  const [selectedService, setSelectedService] = useState("all");
  const [dashboard, setDashboard] = useState<EnhancedDashboard | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // For now, use mock data - in production, fetch from API
    // const analyticsParams =
    //   selectedService !== "all" ? `?serviceId=${selectedService}` : "";
    // const feedbackParams =
    //   selectedService !== "all"
    //     ? `?serviceId=${selectedService}&limit=8`
    //     : "?limit=8";
    // Promise.all([
    //   fetch(`/api/analytics/enhanced${analyticsParams}`).then((r) => r.json()),
    //   fetch(`/api/feedback${feedbackParams}`).then((r) => r.json()),
    // ])
    //   .then(([dashboardData, feedbackData]) => {
    //     setDashboard(dashboardData);
    //     setFeedback(feedbackData.feedback ?? []);
    //   })
    //   .finally(() => setLoading(false));

    // Simulate API call with mock data
    setTimeout(() => {
      setDashboard(MOCK_ENHANCED_DASHBOARD);
      // Filter dashboard data if service is selected
      if (selectedService !== "all") {
        const filtered = {
          ...MOCK_ENHANCED_DASHBOARD,
          detectedIssues: MOCK_ENHANCED_DASHBOARD.detectedIssues.filter(
            (i) => i.serviceId === selectedService
          ),
          topComplaints: MOCK_ENHANCED_DASHBOARD.topComplaints.filter((c) =>
            c.services.some((s) =>
              s.toLowerCase().includes(selectedService.replace("-", " "))
            )
          ),
        };
        setDashboard(filtered);
      }
      // Mock feedback data filtering would go here
      setFeedback([]);
      setLoading(false);
    }, 300);
  }, [selectedService]);

  const participationRate = dashboard?.participation.participationRate ?? 0;
  const issuesCount = dashboard?.detectedIssues.length ?? 0;

  return (
    <AdminOnly>
      <AppShell
        title="Dashboard"
        description="Campus service satisfaction & issue management"
      >
        <div className="space-y-6">
          {/* Filter */}
          <ServiceFilter
            selected={selectedService}
            onChange={setSelectedService}
          />

          {/* KPI Cards - Enhanced with Participation Rate */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))
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
                  title="Participation Rate"
                  value={`${participationRate.toFixed(1)}%`}
                  description={`${dashboard?.participation.uniqueRespondents ?? 0} of ${dashboard?.participation.totalStudents ?? 0} students`}
                  icon={Users}
                  index={2}
                />
                <MetricCard
                  title="Issues Detected"
                  value={issuesCount}
                  description={
                    issuesCount === 0
                      ? "all systems normal"
                      : `${dashboard?.detectedIssues.filter((i) => i.severity === "critical" || i.severity === "high").length ?? 0} critical/high`
                  }
                  icon={TrendingUp}
                  index={3}
                />
              </>
            )}
          </div>

          {/* Priority Section - Issues Requiring Attention */}
          {loading ? (
            <Skeleton className="h-96 rounded-xl" />
          ) : (
            <IssueManagementPanel
              issues={
                dashboard?.managedIssues ?? 
                dashboard?.detectedIssues.map((issue) => ({
                  id: issue.issueId,
                  title: issue.title,
                  description: issue.description,
                  service: issue.servicesAffected[0] || "Unknown",
                  severity: issue.severity,
                  status: "open" as const,
                  detectedDate: new Date(),
                  actionLog: [],
                })) ?? 
                []
              }
              index={0}
            />
          )}

          {/* AI & Intelligence Section */}
          <div className="grid gap-4 lg:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
              </>
            ) : (
              <>
                <AIInsightsWidget
                  insights={dashboard?.aiInsights ?? []}
                  index={1}
                />
                <WeeklySummaryCard
                  summary={dashboard?.weeklySummary ?? null}
                  index={2}
                />
              </>
            )}
          </div>

          {/* Service Health & Participation */}
          <div className="grid gap-4 lg:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
              </>
            ) : (
              <>
                <ServiceHealthIndicator
                  serviceHealth={dashboard?.serviceHealth ?? []}
                  index={3}
                />
                <ParticipationByService
                  participationData={dashboard?.participationByService ?? []}
                  index={4}
                />
              </>
            )}
          </div>

          {/* Historical Comparison & Student Voice */}
          <div className="grid gap-4 lg:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
              </>
            ) : (
              <>
                <HistoricalComparisonWidget
                  comparison={dashboard?.historicalComparison ?? null}
                  index={5}
                />
                <StudentVoiceWidget
                  studentVoice={dashboard?.studentVoice ?? null}
                  index={6}
                />
              </>
            )}
          </div>

          {/* Service Performance & Rankings */}
          <div className="grid gap-4 lg:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-[450px] rounded-xl" />
                <Skeleton className="h-[450px] rounded-xl" />
              </>
            ) : (
              <>
                <ServiceRankingWidget
                  rankings={dashboard?.serviceRankings ?? []}
                  index={1}
                />
                <DepartmentPerformanceWidget
                  departments={dashboard?.departmentPerformance ?? []}
                  index={2}
                />
              </>
            )}
          </div>

          {/* Satisfaction Trend - What is happening over time? */}
          {loading ? (
            <Skeleton className="h-80 rounded-xl" />
          ) : (
            <SatisfactionTrendChart data={dashboard?.trends ?? []} index={3} />
          )}

          {/* Top Complaints - What are students complaining about? */}
          {loading ? (
            <Skeleton className="h-96 rounded-xl" />
          ) : (
            <TopComplaintsSummary
              complaints={dashboard?.topComplaints ?? []}
              index={4}
            />
          )}

          {/* Recent Feedback - Latest submissions */}
          {loading ? (
            <Skeleton className="h-72 rounded-xl" />
          ) : (
            dashboard &&
            dashboard.serviceBreakdown && (
              <RecentFeedback
                feedback={dashboard.serviceBreakdown.slice(0, 8).map((s, i) => ({
                  _id: `temp-${i}`,
                  studentId: `STU${i}`,
                  serviceId: s.serviceId,
                  serviceName: s.serviceName,
                  overallSatisfaction: Math.round(s.avgScore),
                  submittedAt: new Date(
                    Date.now() - i * 24 * 60 * 60 * 1000
                  ).toISOString(),
                  ratings: {},
                }))}
                index={5}
              />
            )
          )}
        </div>
      </AppShell>
    </AdminOnly>
  );
}
