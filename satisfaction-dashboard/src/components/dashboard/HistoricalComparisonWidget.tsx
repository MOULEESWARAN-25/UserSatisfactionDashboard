"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { HistoricalComparison } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface HistoricalComparisonWidgetProps {
  comparison: HistoricalComparison | null;
  index?: number;
}

export function HistoricalComparisonWidget({ comparison, index = 0 }: HistoricalComparisonWidgetProps) {
  if (!comparison) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="h-full border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Historical Comparison</CardTitle>
                <CardDescription>Period-over-period analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No comparison data</p>
              <p className="text-xs text-muted-foreground">Historical data will appear here</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950";
    if (change < 0) return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950";
    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950";
  };

  const formatPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      current: "Current Period",
      previous: "Previous Period",
      lastMonth: "Last Month",
      lastQuarter: "Last Quarter",
      lastSemester: "Last Semester",
    };
    return labels[period] || period;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Historical Comparison</CardTitle>
              <CardDescription>
                {formatPeriodLabel(comparison.currentPeriod.label)} vs {formatPeriodLabel(comparison.previousPeriod.label)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Period Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 dark:from-violet-950 dark:to-fuchsia-950">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {formatPeriodLabel(comparison.currentPeriod.label)}
              </p>
              <p className="text-3xl font-bold">{comparison.currentPeriod.avgSatisfaction.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{comparison.currentPeriod.totalFeedback} responses</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {formatPeriodLabel(comparison.previousPeriod.label)}
              </p>
              <p className="text-3xl font-bold">{comparison.previousPeriod.avgSatisfaction.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{comparison.previousPeriod.totalFeedback} responses</p>
            </div>
          </div>

          {/* Overall Change */}
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border p-4",
              getTrendColor(comparison.changePercent)
            )}
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground">Overall Change</p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  comparison.changePercent > 0
                    ? "text-emerald-700 dark:text-emerald-300"
                    : comparison.changePercent < 0
                      ? "text-rose-700 dark:text-rose-300"
                      : "text-amber-700 dark:text-amber-300"
                )}
              >
                {comparison.changePercent > 0 ? "+" : ""}
                {comparison.changePercent.toFixed(1)}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(comparison.changePercent)}
              <span
                className={cn(
                  "text-sm font-semibold",
                  comparison.changePercent > 0
                    ? "text-emerald-700 dark:text-emerald-300"
                    : comparison.changePercent < 0
                      ? "text-rose-700 dark:text-rose-300"
                      : "text-amber-700 dark:text-amber-300"
                )}
              >
                {Math.abs(comparison.currentPeriod.avgSatisfaction - comparison.previousPeriod.avgSatisfaction).toFixed(2)} points
              </span>
            </div>
          </div>

          {/* Significant Changes */}
          {comparison.significantChanges && comparison.significantChanges.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold">Significant Changes by Service</h3>
              <div className="space-y-2">
                {comparison.significantChanges.map((change, idx) => {
                const isImprovement = change.changeDirection === "improvement";
                const isDecline = change.changeDirection === "decline";

                return (
                  <motion.div
                    key={change.service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "rounded-lg border p-3 transition-all hover:shadow-md",
                      isImprovement
                        ? "bg-emerald-50 dark:bg-emerald-950"
                        : isDecline
                          ? "bg-rose-50 dark:bg-rose-950"
                          : "bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <p className="font-semibold text-sm">{change.service}</p>
                          {isImprovement && (
                            <Badge className="rounded-full bg-emerald-600 text-white">Improved</Badge>
                          )}
                          {isDecline && <Badge className="rounded-full bg-rose-600 text-white">Declined</Badge>}
                          {change.changeDirection === "stable" && (
                            <Badge variant="secondary" className="rounded-full">
                              Stable
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{change.previousValue.toFixed(1)}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-medium">{change.currentValue.toFixed(1)}</span>
                          <span
                            className={cn(
                              "ml-1 font-semibold",
                              isImprovement
                                ? "text-emerald-700 dark:text-emerald-300"
                                : isDecline
                                  ? "text-rose-700 dark:text-rose-300"
                                  : "text-amber-700 dark:text-amber-300"
                            )}
                          >
                            ({change.changePercent > 0 ? "+" : ""}
                            {change.changePercent.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      {getTrendIcon(change.changePercent)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          )}

          {/* Comparison Summary */}
          <div className="rounded-lg border bg-gradient-to-r from-violet-50 to-fuchsia-50 p-3 text-sm dark:from-violet-950 dark:to-fuchsia-950">
            <p className="font-medium">
              {comparison.changePercent > 5
                ? "🎉 Significant improvement detected!"
                : comparison.changePercent < -5
                  ? "⚠️ Attention needed - satisfaction declining"
                  : comparison.changePercent > 0
                    ? "✅ Slight improvement observed"
                    : comparison.changePercent < 0
                      ? "📉 Minor decline detected"
                      : "📊 Performance stable"}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
