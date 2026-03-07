"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDelta, getDeltaColor } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  delta?: number;
  icon: LucideIcon;
  iconColor?: string;
  index?: number;
}

export function MetricCard({
  title,
  value,
  description,
  delta,
  icon: Icon,
  iconColor = "text-muted-foreground",
  index = 0,
}: MetricCardProps) {
  const DeltaIcon =
    delta === undefined
      ? null
      : delta > 0
        ? TrendingUp
        : delta < 0
          ? TrendingDown
          : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="space-y-1">
                <motion.p
                  className="text-2xl font-semibold tracking-tight"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                >
                  {value}
                </motion.p>
                {(description || delta !== undefined) && (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  >
                    {DeltaIcon && delta !== undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
                          delta > 0
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                            : delta < 0
                              ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        <DeltaIcon className="h-3 w-3" />
                        {formatDelta(delta)}
                      </span>
                    )}
                    {description && (
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
            <motion.div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10",
                iconColor
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
