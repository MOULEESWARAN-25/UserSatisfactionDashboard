"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingDown, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { DetectedIssue, IssueSeverity } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface IssueDetectionWidgetProps {
  issues: DetectedIssue[];
  index?: number;
}

const severityConfig: Record<
  IssueSeverity,
  { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; label: string }
> = {
  critical: {
    icon: AlertCircle,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900",
    label: "Critical",
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-900",
    label: "High",
  },
  medium: {
    icon: TrendingDown,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900",
    label: "Medium",
  },
  low: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900",
    label: "Low",
  },
};

const statusColors: Record<string, string> = {
  open: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  investigating: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
};

export function IssueDetectionWidget({ issues, index = 0 }: IssueDetectionWidgetProps) {
  const criticalIssues = issues.filter((i) => i.severity === "critical" || i.severity === "high");
  const hasIssues = issues.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                hasIssues ? "bg-rose-50 dark:bg-rose-950" : "bg-emerald-50 dark:bg-emerald-950"
              )}
            >
              <AlertCircle
                className={cn(
                  "h-5 w-5",
                  hasIssues ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                )}
              />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Issues Requiring Attention</CardTitle>
              <CardDescription>
                {hasIssues ? `${criticalIssues.length} critical/high priority` : "All systems performing well"}
              </CardDescription>
            </div>
          </div>
          {hasIssues && (
            <Badge variant="destructive" className="rounded-full">
              {issues.length}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {!hasIssues ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No issues detected</p>
              <p className="text-xs text-muted-foreground">All services are operating normally</p>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.slice(0, 5).map((issue, idx) => {
                const config = severityConfig[issue.severity];
                const IconComponent = config.icon;

                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "rounded-lg border p-3 transition-all hover:shadow-sm",
                      config.bgColor
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className={cn("mt-0.5 h-4 w-4 flex-shrink-0", config.color)} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">{issue.title}</p>
                          <Badge
                            variant="secondary"
                            className={cn("rounded-full text-xs font-medium", statusColors[issue.status])}
                          >
                            {issue.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{issue.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium">{issue.serviceName}</span>
                          <span>•</span>
                          <span
                            className={cn(
                              "font-semibold",
                              issue.changePercent < 0 ? "text-rose-600 dark:text-rose-400" : ""
                            )}
                          >
                            {issue.changePercent > 0 ? "+" : ""}
                            {issue.changePercent.toFixed(1)}%
                          </span>
                          {issue.assignedTo && (
                            <>
                              <span>•</span>
                              <span>Assigned to: {issue.assignedTo}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {issues.length > 5 && (
                <p className="text-center text-xs text-muted-foreground">
                  +{issues.length - 5} more issues
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
