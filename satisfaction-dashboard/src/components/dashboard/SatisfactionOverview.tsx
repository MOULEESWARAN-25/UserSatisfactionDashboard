"use client";

import { useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn, formatScore } from "@/lib/utils";
import type { ServiceSatisfaction } from "@/types/analytics";
import { SERVICES } from "@/lib/constants";
import {
  staggerContainer,
  staggerItem,
  cardHoverProps,
  iconHoverProps,
  progressBar,
} from "@/lib/animations";

interface SatisfactionOverviewProps {
  data: ServiceSatisfaction[];
  index?: number;
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={trend}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
        {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
        {trend === "stable" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
      </motion.span>
    </AnimatePresence>
  );
}

export function SatisfactionOverview({ data, index = 0 }: SatisfactionOverviewProps) {
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
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Service Satisfaction</CardTitle>
            <CardDescription>Average scores per service</CardDescription>
          </div>
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950"
            {...iconHoverProps}
          >
            <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {data.map((item, idx) => {
              const pct = (item.avgScore / 5) * 100;
              const barColor =
                item.avgScore >= 4
                  ? "bg-emerald-500"
                  : item.avgScore >= 3
                  ? "bg-amber-500"
                  : "bg-red-500";

              return (
                <motion.div
                  key={item.serviceId}
                  variants={staggerItem}
                  className="space-y-2 cursor-default"
                  whileHover={{ x: 3, transition: { duration: 0.18 } }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.serviceName}</span>
                      <TrendIcon trend={item.trend} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {item.totalFeedback} reviews
                      </span>
                      <motion.span
                        className="min-w-[2.5rem] text-right font-semibold tabular-nums"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: idx * 0.06 + 0.3 }}
                      >
                        {formatScore(item.avgScore)}
                      </motion.span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={cn("h-full rounded-full", barColor)}
                      variants={progressBar}
                      custom={pct}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          {data.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Star className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No data available</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
