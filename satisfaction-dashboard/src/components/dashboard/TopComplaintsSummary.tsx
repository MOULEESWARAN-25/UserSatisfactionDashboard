"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { ComplaintSummary } from "@/types/analytics";
import { cn } from "@/lib/utils";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Most Reported Problems</CardTitle>
              <CardDescription>Common issues mentioned in feedback</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                <MessageSquare className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No complaints detected</p>
              <p className="text-xs text-muted-foreground">All feedback is positive</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {complaints.map((complaint, idx) => (
                <motion.div
                  key={complaint.issue}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "rounded-lg border p-3 transition-all hover:bg-muted/50",
                    complaint.severity === "critical" &&
                      "border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Count Badge */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                      {complaint.count}
                    </div>

                    {/* Complaint Info */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-tight">{complaint.issue}</p>
                        <Badge
                          variant="secondary"
                          className={cn("rounded-full text-xs font-medium", severityColors[complaint.severity])}
                        >
                          {complaint.severity}
                        </Badge>
                      </div>

                      {/* Services & Trend */}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {complaints.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>
                These issues are extracted from feedback comments and rated by frequency and sentiment
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
