"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import type { DepartmentPerformance } from "@/types/analytics";
import { cn, formatScore } from "@/lib/utils";

interface DepartmentPerformanceWidgetProps {
  departments: DepartmentPerformance[];
  index?: number;
}

export function DepartmentPerformanceWidget({ departments, index = 0 }: DepartmentPerformanceWidgetProps) {
  const sortedDepartments = [...departments].sort((a, b) => b.avgScore - a.avgScore);

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
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Department Accountability</CardTitle>
              <CardDescription>Performance by responsible department</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedDepartments.map((dept, idx) => {
              const scorePercentage = (dept.avgScore / 5) * 100;

              return (
                <motion.div
                  key={dept.departmentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{dept.departmentName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {dept.serviceCounts} service{dept.serviceCounts !== 1 ? "s" : ""}
                        </span>
                        <span>•</span>
                        <span>{dept.totalFeedback} responses</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {dept.trend === "up" && (
                            <>
                              <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">Improving</span>
                            </>
                          )}
                          {dept.trend === "down" && (
                            <>
                              <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                              <span className="font-medium text-rose-600 dark:text-rose-400">Declining</span>
                            </>
                          )}
                          {dept.trend === "stable" && (
                            <>
                              <Minus className="h-3 w-3" />
                              <span className="font-medium">Stable</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          dept.avgScore >= 4.0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : dept.avgScore >= 3.0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {formatScore(dept.avgScore)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercentage}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        dept.avgScore >= 4.0
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : dept.avgScore >= 3.0
                          ? "bg-amber-500 dark:bg-amber-400"
                          : "bg-rose-500 dark:bg-rose-400"
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
