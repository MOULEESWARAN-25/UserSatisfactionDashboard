"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingDown, AlertTriangle, Info, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { DetectedIssue, IssueSeverity } from "@/types/analytics";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItemLeft,
  cardHoverProps,
  badgePop,
  iconHoverProps,
  scaleIn,
} from "@/lib/animations";

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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const criticalIssues = issues.filter((i) => i.severity === "critical" || i.severity === "high");
  const hasIssues = issues.length > 0;

  return (
    <motion.div
      ref={ref}
      className="h-full"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...cardHoverProps}
    >
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                hasIssues ? "bg-rose-50 dark:bg-rose-950" : "bg-emerald-50 dark:bg-emerald-950"
              )}
              {...iconHoverProps}
              animate={{
                ...(hasIssues
                  ? { rotate: [0, -8, 8, -4, 0], transition: { duration: 0.6, repeat: Infinity, repeatDelay: 4 } }
                  : {}),
              }}
            >
              <AlertCircle
                className={cn(
                  "h-5 w-5",
                  hasIssues
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              />
            </motion.div>
            <div>
              <CardTitle className="text-base font-semibold">Issues Requiring Attention</CardTitle>
              <CardDescription>
                {hasIssues
                  ? `${criticalIssues.length} critical/high priority`
                  : "All systems performing well"}
              </CardDescription>
            </div>
          </div>
          <AnimatePresence>
            {hasIssues && (
              <motion.div
                variants={badgePop}
                initial="hidden"
                animate="visible"
                exit={{ scale: 0, opacity: 0 }}
              >
                <Badge variant="destructive" className="rounded-full">
                  {issues.length}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!hasIssues ? (
              <motion.div
                key="clear"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <motion.div
                  className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <p className="text-sm font-medium text-muted-foreground">No issues detected</p>
                <p className="text-xs text-muted-foreground">All services are operating normally</p>
              </motion.div>
            ) : (
              <motion.div
                key="issues"
                className="space-y-3"
                variants={staggerContainer}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {issues.slice(0, 5).map((issue) => {
                  const config = severityConfig[issue.severity];
                  const IconComponent = config.icon;

                  return (
                    <motion.div
                      key={issue.id}
                      variants={staggerItemLeft}
                      className={cn(
                        "rounded-lg border p-3 transition-all cursor-default",
                        config.bgColor
                      )}
                      whileHover={{
                        x: 4,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.09)",
                        transition: { duration: 0.18 },
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.18 }}
                        >
                          <IconComponent className={cn("mt-0.5 h-4 w-4 flex-shrink-0", config.color)} />
                        </motion.div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-tight">{issue.title}</p>
                            <motion.div variants={badgePop}>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "rounded-full text-xs font-medium flex-shrink-0",
                                  statusColors[issue.status]
                                )}
                              >
                                {issue.status}
                              </Badge>
                            </motion.div>
                          </div>
                          <p className="text-xs text-muted-foreground">{issue.description}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{issue.serviceName}</span>
                            <span>•</span>
                            <span
                              className={cn(
                                "font-semibold flex items-center gap-1",
                                issue.changePercent < 0 ? "text-rose-600 dark:text-rose-400" : ""
                              )}
                            >
                              <TrendingDown className="h-3 w-3" />
                              {Math.abs(issue.changePercent).toFixed(1)}% drop
                            </span>
                            {issue.assignment?.assignedTo && (
                              <>
                                <span>•</span>
                                <span>Assigned: {issue.assignment.assignedTo.name}</span>
                              </>
                            )}
                          </div>
                          
                          {/* AUTOMATED ACTION BLOCK */}
                          {(issue.severity === "critical" || issue.severity === "high") && issue.status === "open" && (
                            <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 px-3 py-2">
                              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                <Zap className="h-3.5 w-3.5" />
                                <span>Quick Action: Auto-Assign & Notify</span>
                              </div>
                              <Button size="sm" className="h-7 rounded-full px-3 text-xs font-semibold transition-transform hover:scale-105 active:scale-95">
                                Execute
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {issues.length > 5 && (
                  <motion.p
                    className="text-center text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                  >
                    +{issues.length - 5} more issues
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
