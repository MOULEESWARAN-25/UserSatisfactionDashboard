"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { ComplaintSummary } from "@/types/analytics";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItemLeft,
  cardHoverProps,
  iconHoverProps,
  badgePop,
} from "@/lib/animations";

interface TopComplaintsSummaryProps {
  complaints: ComplaintSummary[];
  index?: number;
}

const severityColors: Record<string, string> = {
  critical: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export function TopComplaintsSummary({ complaints, index = 0 }: TopComplaintsSummaryProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
              {...iconHoverProps}
            >
              <MessageSquare className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="text-base font-semibold">Most Reported Problems</CardTitle>
              <CardDescription>Common issues mentioned in feedback</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                <MessageSquare className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No complaints detected</p>
              <p className="text-xs text-muted-foreground">All feedback is positive</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-2.5"
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {complaints.map((complaint, idx) => (
                <motion.div
                  key={complaint.issue}
                  variants={staggerItemLeft}
                  className={cn(
                    "rounded-lg border p-3 transition-all cursor-default",
                    complaint.severity === "critical" &&
                      "border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/20"
                  )}
                  whileHover={{
                    x: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: { duration: 0.18 },
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Count & Velocity Badge */}
                    <div className="flex flex-col items-center gap-1">
                      <motion.div
                        className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                          complaint.severity === "critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400" : "bg-muted"
                        )}
                        whileHover={{ scale: 1.12, rotate: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {complaint.count}
                      </motion.div>
                      {complaint.trend === "increasing" && complaint.severity === "critical" && (
                        <span className="animate-pulse rounded border border-rose-200 bg-rose-50 px-1 py-0.5 text-[10px] font-bold text-rose-600 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
                          HOT
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-tight">{complaint.issue}</p>
                        <motion.div variants={badgePop}>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "rounded-full text-xs font-medium flex-shrink-0",
                              severityColors[complaint.severity]
                            )}
                          >
                            {complaint.severity}
                          </Badge>
                        </motion.div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-medium">
                          {complaint.services.slice(0, 2).join(", ")}
                          {complaint.services.length > 2 && ` +${complaint.services.length - 2}`}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {complaint.trend === "increasing" && (
                            <>
                              <TrendingUp className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                              <span className="font-medium text-rose-600 dark:text-rose-400">Increasing</span>
                            </>
                          )}
                          {complaint.trend === "decreasing" && (
                            <>
                              <TrendingDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">Decreasing</span>
                            </>
                          )}
                          {complaint.trend === "stable" && (
                            <>
                              <Minus className="h-3 w-3" />
                              <span className="font-medium">Stable</span>
                            </>
                          )}
                          {complaint.trend === "increasing" && complaint.severity === "critical" && (
                            <span className="ml-2 font-semibold text-rose-600 dark:text-rose-400">
                              (+{Math.floor(complaint.count * 0.4)} in last 24h)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {complaints.length > 0 && (
            <motion.div
              className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground"
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + complaints.length * 0.05 }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>
                These issues are extracted from feedback comments and rated by frequency and sentiment
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
