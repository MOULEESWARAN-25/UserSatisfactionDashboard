"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { DepartmentPerformance } from "@/types/analytics";
import { cn, formatScore } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  cardHoverProps,
  iconHoverProps,
  progressBar,
} from "@/lib/animations";

interface DepartmentPerformanceWidgetProps {
  departments: DepartmentPerformance[];
  index?: number;
}

export function DepartmentPerformanceWidget({ departments, index = 0 }: DepartmentPerformanceWidgetProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const sortedDepartments = [...departments].sort((a, b) => b.avgScore - a.avgScore);

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
              <Building2 className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="text-base font-semibold">Department Accountability</CardTitle>
              <CardDescription>Performance by responsible department</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {sortedDepartments.map((dept, idx) => {
              const scorePercentage = (dept.avgScore / 5) * 100;

              return (
                <motion.div
                  key={dept.departmentId}
                  variants={staggerItem}
                  className="space-y-2 group cursor-default"
                  whileHover={{ x: 3, transition: { duration: 0.18 } }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {dept.departmentName}
                      </p>
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
                    <motion.span
                      className={cn(
                        "text-sm font-bold",
                        dept.avgScore >= 4.0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : dept.avgScore >= 3.0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                      )}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: idx * 0.07 + 0.25, type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {formatScore(dept.avgScore)}
                    </motion.span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        dept.avgScore >= 4.0
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : dept.avgScore >= 3.0
                          ? "bg-amber-500 dark:bg-amber-400"
                          : "bg-rose-500 dark:bg-rose-400"
                      )}
                      variants={progressBar}
                      custom={scorePercentage}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
