"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BarChart3, Calendar, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_ANALYTICS, MOCK_FEEDBACK, MOCK_ADVANCED_ANALYTICS, MOCK_TOP_COMPLAINTS } from "@/lib/mock-data";

// ── CSV helpers ───────────────────────────────────────────────────────
function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsv(val: string | number | undefined | null): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateMonthlySummaryCSV(): string {
  const rows: string[][] = [
    ["Metric", "Value"],
    ["Total Feedback", String(MOCK_ANALYTICS.metrics.totalFeedback)],
    ["Average Satisfaction", MOCK_ANALYTICS.metrics.avgSatisfaction.toFixed(2)],
    ["Weekly Responses", String(MOCK_ANALYTICS.metrics.weeklyResponses)],
    ["Top Service Score", String(MOCK_ANALYTICS.metrics.topServiceScore)],
    [],
    ["Service", "Avg Score", "Total Feedback", "Trend"],
    ...MOCK_ANALYTICS.serviceBreakdown.map((s) => [
      s.serviceName,
      s.avgScore.toFixed(2),
      String(s.totalFeedback),
      s.trend,
    ]),
    [],
    ["Rating", "Count"],
    ...MOCK_ANALYTICS.ratingDistribution.map((r) => [
      `${r.rating} Star${r.rating !== 1 ? "s" : ""}`,
      String(r.count),
    ]),
  ];
  return rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
}

function generateServiceBreakdownCSV(): string {
  const rows: string[][] = [
    ["Service", "Avg Score", "Total Feedback", "Trend", "Response Rate"],
    ...MOCK_ANALYTICS.serviceBreakdown.map((s) => {
      const detail = MOCK_ADVANCED_ANALYTICS.serviceDetails.find(
        (d) => d.serviceId === s.serviceId
      );
      return [
        s.serviceName,
        s.avgScore.toFixed(2),
        String(s.totalFeedback),
        s.trend,
        detail ? `${detail.responseRate}%` : "N/A",
      ];
    }),
    [],
    ["Improvement Areas"],
    ["Area", "Score", "Change"],
    ...MOCK_ADVANCED_ANALYTICS.improvementAreas.map((a) => [
      a.area,
      a.score.toFixed(2),
      a.change >= 0 ? `+${a.change.toFixed(1)}` : a.change.toFixed(1),
    ]),
  ];
  return rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
}

function generateFeedbackTrendCSV(): string {
  const rows: string[][] = [
    ["Date", "Avg Score", "Response Count"],
    ...MOCK_ANALYTICS.trends.map((t) => [
      t.date,
      t.score.toFixed(2),
      String(t.count),
    ]),
    [],
    ["Student Feedback Records"],
    ["ID", "Student", "Service", "Score", "Comment", "Submitted At"],
    ...MOCK_FEEDBACK.map((f) => [
      f._id,
      f.studentName ?? f.studentId,
      f.serviceName,
      String(f.overallSatisfaction),
      f.comment ?? "",
      new Date(f.submittedAt).toLocaleDateString(),
    ]),
  ];
  return rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
}

function generateProblemInsightsCSV(): string {
  const rows: string[][] = [
    ["Issue", "Mentions", "Severity", "Trend", "Services Affected", "Service Impact"],
    ...MOCK_TOP_COMPLAINTS.map((issue) => [
      issue.issue,
      String(issue.count),
      issue.severity,
      issue.trend,
      issue.services.join(" | "),
      `${issue.services.length} service${issue.services.length !== 1 ? "s" : ""}`,
    ]),
  ];

  return rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
}

const REPORT_TYPES = [
  {
    id: "monthly",
    title: "Monthly Summary",
    description: "Aggregate satisfaction scores, feedback volumes, and rating distribution for the current period",
    icon: Calendar,
    badge: "Overview",
    generateCSV: generateMonthlySummaryCSV,
    filename: "monthly-summary.csv",
    rows: `${MOCK_ANALYTICS.metrics.totalFeedback} feedback entries`,
  },
  {
    id: "service",
    title: "Service Breakdown",
    description: "Per-service analytics with question-level ratings, response rates, and improvement areas",
    icon: BarChart3,
    badge: "Detailed",
    generateCSV: generateServiceBreakdownCSV,
    filename: "service-breakdown.csv",
    rows: `${MOCK_ANALYTICS.serviceBreakdown.length} services covered`,
  },
  {
    id: "trends",
    title: "Trend Report",
    description: "Day-by-day satisfaction trends and all individual feedback records with student comments",
    icon: FileText,
    badge: "Full Data",
    generateCSV: generateFeedbackTrendCSV,
    filename: "feedback-trends.csv",
    rows: `${MOCK_ANALYTICS.trends.length + MOCK_FEEDBACK.length} rows`,
  },
  {
    id: "problems",
    title: "Problem Insights Report",
    description: "Top complaint clusters with severity, trend direction, and cross-service impact",
    icon: AlertTriangle,
    badge: "Issues",
    generateCSV: generateProblemInsightsCSV,
    filename: "problem-insights.csv",
    rows: `${MOCK_TOP_COMPLAINTS.length} problem groups`,
  },
];

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const handleDownload = (report: (typeof REPORT_TYPES)[number]) => {
    setDownloading(report.id);
    // Simulate brief processing
    setTimeout(() => {
      downloadCSV(report.filename, report.generateCSV());
      setDownloading(null);
      setDownloaded((prev) => new Set(Array.from(prev).concat(report.id)));
      setTimeout(() => {
        setDownloaded((prev) => {
          const next = new Set(prev);
          next.delete(report.id);
          return next;
        });
      }, 3000);
    }, 600);
  };

  return (
    <AdminOnly>
      <AppShell
        title="Reports"
        description="Generate and download analytics reports as CSV"
      >
        <div className="space-y-6">
          <div className="rounded-xl border bg-muted/30 px-5 py-4">
            <p className="text-sm text-muted-foreground">
              Reports are generated from the latest available data and exported as CSV files.
              Open with Excel, Google Sheets, or any spreadsheet application.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {REPORT_TYPES.map((report, idx) => {
              const isDownloading = downloading === report.id;
              const isDownloaded = downloaded.has(report.id);
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                          <report.icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {report.badge}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3 text-base">{report.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-end gap-3 pt-0">
                      <p className="text-xs text-muted-foreground">{report.rows}</p>
                      <Button
                        variant="outline"
                        className="w-full gap-2 rounded-xl"
                        onClick={() => handleDownload(report)}
                        disabled={isDownloading}
                      >
                        <AnimatePresence mode="wait">
                          {isDownloading ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating…
                            </motion.span>
                          ) : isDownloaded ? (
                            <motion.span
                              key="done"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Downloaded
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Export CSV
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AppShell>
    </AdminOnly>
  );
}

