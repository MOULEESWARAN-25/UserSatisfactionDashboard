"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar, TrendingUp, TrendingDown, Minus,
  FileText, RefreshCw, Loader2, Award, AlertCircle,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { WeeklySummary } from "@/types/analytics";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItemLeft,
  cardHoverProps,
  iconHoverProps,
  badgePop,
  scaleIn,
} from "@/lib/animations";

interface WeeklySummaryCardProps {
  summary: WeeklySummary | null;
  onRegenerateClicked?: () => Promise<void>;
  index?: number;
}

export function WeeklySummaryCard({ summary, onRegenerateClicked, index = 0 }: WeeklySummaryCardProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
    if (trend === "increasing" || trend === "improving")
      return <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    if (trend === "decreasing" || trend === "declining")
      return <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
    return <Minus className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
  };

  const getTrendColor = (trend: "increasing" | "decreasing" | "stable" | "improving" | "declining") => {
    if (trend === "increasing" || trend === "improving") return "text-emerald-600 dark:text-emerald-400";
    if (trend === "decreasing" || trend === "declining") return "text-rose-600 dark:text-rose-400";
    return "text-amber-600 dark:text-amber-400";
  };

  return (
    <motion.div
      ref={ref}
      className="h-full"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...cardHoverProps}
    >
      <Card className="h-full border-2 overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500"
                {...iconHoverProps}
              >
                <Calendar className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Weekly Summary
                  <AnimatePresence>
                    {summary && (
                      <motion.div variants={badgePop} initial="hidden" animate="visible">
                        <Badge variant="secondary" className="rounded-full">AI Generated</Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardTitle>
                <CardDescription>
                  {summary
                    ? `${new Date(summary.weekStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(summary.weekEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "AI-generated executive report"}
                </CardDescription>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                    {summary ? "Regenerating..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {summary ? "Regenerate" : "Generate"}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!summary ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <FileText className="mb-3 h-12 w-12 text-muted-foreground/50" />
                </motion.div>
                <p className="text-sm font-medium text-muted-foreground">No summary generated yet</p>
                <p className="text-xs text-muted-foreground">Click "Generate" to create weekly report</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Key Metrics Banner */}
                <motion.div
                  className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:from-indigo-950 dark:to-purple-950"
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 }}
                >
                  <h3 className="mb-2 text-sm font-semibold">Key Metrics</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {summary.totalFeedback} total responses • {summary.avgSatisfaction.toFixed(1)}/5 average satisfaction
                  </p>
                </motion.div>

                {/* Key Insights */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <span className="text-lg">💡</span> Key Insights ({summary.keyInsights.length})
                  </h3>
                  <motion.ul
                    className="space-y-1.5"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    {summary.keyInsights.map((insight, idx) => (
                      <motion.li
                        key={idx}
                        variants={staggerItemLeft}
                        className="flex gap-2 text-sm rounded-md p-1 hover:bg-muted/30 transition-colors cursor-default"
                      >
                        <motion.span
                          className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500"
                          initial={{ scale: 0 }}
                          animate={inView ? { scale: 1 } : {}}
                          transition={{ delay: idx * 0.06 + 0.2, type: "spring" }}
                        />
                        <span className="leading-relaxed text-muted-foreground">{insight}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* Score Banner */}
                <motion.div
                  className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                  variants={scaleIn}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Overall Satisfaction</p>
                    <motion.p
                      className="text-2xl font-bold"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {summary.avgSatisfaction.toFixed(1)}
                    </motion.p>
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
                </motion.div>

                {/* Top & Bottom */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Top Service",
                      icon: Award,
                      colorClass: "emerald",
                      name: summary.highestService.name,
                      score: summary.highestService.score,
                    },
                    {
                      label: "Needs Attention",
                      icon: AlertCircle,
                      colorClass: "rose",
                      name: summary.lowestService.name,
                      score: summary.lowestService.score,
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        className={`space-y-2 rounded-lg border bg-${item.colorClass}-50/50 p-3 dark:bg-${item.colorClass}-950/50`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.35 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 text-${item.colorClass}-600 dark:text-${item.colorClass}-400`} />
                          <h4 className={`text-xs font-semibold text-${item.colorClass}-900 dark:text-${item.colorClass}-100`}>
                            {item.label}
                          </h4>
                        </div>
                        <div className="text-sm">
                          <p className={`font-medium text-${item.colorClass}-800 dark:text-${item.colorClass}-200`}>
                            {item.name}
                          </p>
                          <p className={`font-semibold text-${item.colorClass}-700 dark:text-${item.colorClass}-300`}>
                            {item.score.toFixed(1)}/5
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <span className="text-lg">🎯</span> Recommendations ({summary.recommendations.length})
                  </h3>
                  <motion.ul
                    className="space-y-2"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    {summary.recommendations.map((rec, idx) => (
                      <motion.li
                        key={idx}
                        variants={staggerItemLeft}
                        className="rounded-lg border bg-background p-2.5 text-sm hover:shadow-sm transition-shadow cursor-default"
                        whileHover={{ x: 3, transition: { duration: 0.16 } }}
                      >
                        <p className="leading-relaxed text-muted-foreground">{rec}</p>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* Timestamp */}
                <motion.div
                  className="pt-2 text-center text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  Generated:{" "}
                  {new Date(summary.generatedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
