"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  RefreshCw,
  Loader2,
  Award,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { WeeklySummary } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface WeeklySummaryCardProps {
  summary: WeeklySummary | null;
  onRegenerateClicked?: () => Promise<void>;
  index?: number;
}

export function WeeklySummaryCard({ summary, onRegenerateClicked, index = 0 }: WeeklySummaryCardProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (onRegenerateClicked) {
      setIsRegenerating(true);
      try {
        await onRegenerateClicked();
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const getTrendIcon = (trend: "increasing" | "decreasing" | "stable" | "improving" | "declining") => {
    if (trend === "increasing" || trend === "improving") {
      return <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    }
    if (trend === "decreasing" || trend === "declining") {
      return <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
    }
    return <Minus className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
  };

  const getTrendColor = (trend: "increasing" | "decreasing" | "stable" | "improving" | "declining") => {
    if (trend === "increasing" || trend === "improving") {
      return "text-emerald-600 dark:text-emerald-400";
    }
    if (trend === "decreasing" || trend === "declining") {
      return "text-rose-600 dark:text-rose-400";
    }
    return "text-amber-600 dark:text-amber-400";
  };

  if (!summary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="h-full border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Weekly Summary</CardTitle>
                  <CardDescription>AI-generated executive report</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="gap-2 rounded-xl"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No summary generated yet</p>
              <p className="text-xs text-muted-foreground">Click "Generate" to create weekly report</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const startDate = new Date(summary.weekStart).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endDate = new Date(summary.weekEnd).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Weekly Summary
                  <Badge variant="secondary" className="rounded-full">
                    AI Generated
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {startDate} - {endDate}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="gap-2 rounded-xl"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Executive Summary */}
          <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:from-indigo-950 dark:to-purple-950">
            <h3 className="mb-2 text-sm font-semibold">Key Metrics</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {summary.totalFeedback} total responses • {summary.avgSatisfaction.toFixed(1)}/5 average satisfaction
            </p>
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span className="text-lg">💡</span> Key Insights ({summary.keyInsights.length})
            </h3>
            <ul className="space-y-1.5">
              {summary.keyInsights.map((insight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-2 text-sm"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                  <span className="leading-relaxed text-muted-foreground">{insight}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Satisfaction Change */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Overall Satisfaction</p>
              <p className="text-2xl font-bold">{summary.avgSatisfaction.toFixed(1)}</p>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(summary.trend)}
              <div className="text-right">
                <p className={cn("text-sm font-semibold", getTrendColor(summary.trend))}>
                  {summary.satisfactionChange >= 0 ? "+" : ""}
                  {summary.satisfactionChange.toFixed(1)} pts
                </p>
                <p className="text-xs text-muted-foreground">vs last week</p>
              </div>
            </div>
          </div>

          {/* Top & Bottom Services */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 rounded-lg border bg-emerald-50/50 p-3 dark:bg-emerald-950/50">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Top Service</h4>
              </div>
              <div className="text-sm">
                <p className="font-medium text-emerald-800 dark:text-emerald-200">{summary.highestService.name}</p>
                <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {summary.highestService.score.toFixed(1)}/5
                </p>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border bg-rose-50/50 p-3 dark:bg-rose-950/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <h4 className="text-xs font-semibold text-rose-900 dark:text-rose-100">Needs Attention</h4>
              </div>
              <div className="text-sm">
                <p className="font-medium text-rose-800 dark:text-rose-200">{summary.lowestService.name}</p>
                <p className="font-semibold text-rose-700 dark:text-rose-300">
                  {summary.lowestService.score.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span className="text-lg">🎯</span> Recommendations ({summary.recommendations.length})
            </h3>
            <ul className="space-y-2">
              {summary.recommendations.map((rec, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-lg border bg-background p-2.5 text-sm hover:shadow-sm"
                >
                  <p className="leading-relaxed text-muted-foreground">{rec}</p>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Generation Timestamp */}
          <div className="pt-2 text-center text-xs text-muted-foreground">
            Generated: {new Date(summary.generatedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
