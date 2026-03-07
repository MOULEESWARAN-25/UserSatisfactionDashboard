"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SmilePlus, Meh, Frown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SentimentBreakdown } from "@/types/analytics";

interface SentimentCardProps {
  data: SentimentBreakdown;
  index?: number;
}

export function SentimentCard({ data, index = 0 }: SentimentCardProps) {
  const total = data.positive + data.neutral + data.negative;
  const positivePercent = total > 0 ? (data.positive / total) * 100 : 0;
  const neutralPercent = total > 0 ? (data.neutral / total) * 100 : 0;
  const negativePercent = total > 0 ? (data.negative / total) * 100 : 0;

  const sentiments = [
    { 
      label: "Positive", 
      value: data.positive, 
      percent: positivePercent,
      icon: SmilePlus,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500",
      bgLight: "bg-emerald-50 dark:bg-emerald-950"
    },
    { 
      label: "Neutral", 
      value: data.neutral, 
      percent: neutralPercent,
      icon: Meh,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500",
      bgLight: "bg-amber-50 dark:bg-amber-950"
    },
    { 
      label: "Negative", 
      value: data.negative, 
      percent: negativePercent,
      icon: Frown,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500",
      bgLight: "bg-red-50 dark:bg-red-950"
    },
  ];

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
        <CardHeader className="pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              Sentiment Analysis
            </CardTitle>
            <CardDescription>
              Overall feedback sentiment based on ratings
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            <motion.div
              className="bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${positivePercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${neutralPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />
            <motion.div
              className="bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${negativePercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {sentiments.map((s, idx) => (
              <motion.div
                key={s.label}
                className={cn("flex flex-col items-center rounded-xl p-3", s.bgLight)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
              >
                <s.icon className={cn("h-5 w-5 mb-1", s.color)} />
                <span className="text-lg font-semibold">{s.percent.toFixed(0)}%</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-xs text-muted-foreground">({s.value})</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
