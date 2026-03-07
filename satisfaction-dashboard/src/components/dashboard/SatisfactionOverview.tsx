"use client";

import { motion } from "framer-motion";
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

interface SatisfactionOverviewProps {
  data: ServiceSatisfaction[];
  index?: number;
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up")
    return (
      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
    );
  if (trend === "down")
    return (
      <TrendingDown className="h-3.5 w-3.5 text-red-500" />
    );
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

function ScoreBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const pct = (score / 5) * 100;
  const color =
    score >= 4
      ? "bg-emerald-500"
      : score >= 3
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    </div>
  );
}

export function SatisfactionOverview({ data, index = 0 }: SatisfactionOverviewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            Service Satisfaction
          </CardTitle>
          <CardDescription>Average scores per service</CardDescription>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
          <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {data.map((item, idx) => {
          const service = SERVICES.find((s) => s.id === item.serviceId);
          return (
            <motion.div key={item.serviceId} className="space-y-2" variants={itemVariants}>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.serviceName}</span>
                  <TrendIcon trend={item.trend} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {item.totalFeedback} reviews
                  </span>
                  <span className="min-w-[2.5rem] text-right font-semibold tabular-nums">
                    {formatScore(item.avgScore)}
                  </span>
                </div>
              </div>
              <ScoreBar score={item.avgScore} delay={0.3 + idx * 0.1} />
            </motion.div>
          );
        })}
        </motion.div>
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Star className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
