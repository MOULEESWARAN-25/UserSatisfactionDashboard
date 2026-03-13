"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImprovementArea {
  area: string;
  score: number;
  change: number;
}

interface ImprovementAreasCardProps {
  data: ImprovementArea[];
  index?: number;
}

function ChangeIndicator({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        +{change.toFixed(1)}
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-red-600 dark:text-red-400">
        <TrendingDown className="h-3 w-3" />
        {change.toFixed(1)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />
      0.0
    </span>
  );
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

export function ImprovementAreasCard({ data, index = 0 }: ImprovementAreasCardProps) {
  // Sort by score ascending to show areas needing improvement first
  const sortedData = [...data].sort((a, b) => a.score - b.score);

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
      <Card className="h-full overflow-hidden">
        <CardHeader className="flex min-h-[76px] flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              Areas for Improvement
            </CardTitle>
            <CardDescription>
              Service aspects ranked by satisfaction score
            </CardDescription>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950">
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-4 pt-0">
          {sortedData.map((item, idx) => (
            <motion.div
              key={item.area}
              className="space-y-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.area}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{item.score.toFixed(1)}</span>
                  <ChangeIndicator change={item.change} />
                </div>
              </div>
              <ScoreBar score={item.score} delay={0.3 + idx * 0.1} />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
