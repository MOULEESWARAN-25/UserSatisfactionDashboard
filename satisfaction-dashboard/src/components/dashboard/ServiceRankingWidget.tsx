"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Trophy, Award, Medal } from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { ServiceRanking } from "@/types/analytics";
import { cn, formatScore } from "@/lib/utils";
import {
  staggerContainer,
  staggerItemLeft,
  cardHoverProps,
  rowHoverProps,
  progressBar,
  badgePop,
  iconHoverProps,
} from "@/lib/animations";

interface ServiceRankingWidgetProps {
  rankings: ServiceRanking[];
  index?: number;
}

const rankIcons = [
  { icon: Trophy, color: "text-amber-500" },
  { icon: Award, color: "text-slate-400" },
  { icon: Medal, color: "text-amber-600" },
];

export function ServiceRankingWidget({ rankings, index = 0 }: ServiceRankingWidgetProps) {
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
              <Trophy className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="text-base font-semibold">Service Performance Ranking</CardTitle>
              <CardDescription>Ordered by satisfaction score</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-2.5"
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {rankings.map((service, idx) => {
              const RankIcon = idx < 3 ? rankIcons[idx].icon : null;
              const rankColor = idx < 3 ? rankIcons[idx].color : "";
              const scorePct = (service.score / 5) * 100;

              return (
                <motion.div
                  key={service.serviceId}
                  variants={staggerItemLeft}
                  className={cn(
                    "group flex flex-col gap-2 rounded-lg border p-3 cursor-default transition-colors",
                    idx === 0 && "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30",
                    idx === rankings.length - 1 &&
                      service.score < 3.0 &&
                      "border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/30"
                  )}
                  {...rowHoverProps}
                  whileHover={{
                    x: 4,
                    backgroundColor: "rgba(var(--muted) / 0.4)",
                    transition: { duration: 0.18 },
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <motion.div
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                        idx === 0 && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                        idx === 1 && "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
                        idx === 2 && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                        idx > 2 && "bg-muted text-muted-foreground"
                      )}
                      whileHover={{ scale: 1.15, rotate: idx === 0 ? 10 : 0 }}
                    >
                      {RankIcon ? <RankIcon className={cn("h-4 w-4", rankColor)} /> : idx + 1}
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{service.serviceName}</p>
                        <div className="flex items-center gap-2">
                          <motion.span
                            className={cn(
                              "text-sm font-bold",
                              service.score >= 4.0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : service.score >= 3.0
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-rose-600 dark:text-rose-400"
                            )}
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ delay: idx * 0.06 + 0.3 }}
                          >
                            {formatScore(service.score)} / 5
                          </motion.span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{service.departmentName}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {service.trend === "up" && (
                            <>
                              <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                +{service.change.toFixed(1)}%
                              </span>
                            </>
                          )}
                          {service.trend === "down" && (
                            <>
                              <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                              <span className="font-medium text-rose-600 dark:text-rose-400">
                                {service.change.toFixed(1)}%
                              </span>
                            </>
                          )}
                          {service.trend === "stable" && (
                            <>
                              <Minus className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">Stable</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    {idx === 0 && (
                      <motion.div variants={badgePop}>
                        <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          Top
                        </Badge>
                      </motion.div>
                    )}
                    {idx === rankings.length - 1 && service.score < 3.0 && (
                      <motion.div variants={badgePop}>
                        <Badge className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                          Needs Attention
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Animated progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        service.score >= 4.0
                          ? "bg-emerald-500"
                          : service.score >= 3.0
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      )}
                      variants={progressBar}
                      custom={scorePct}
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
