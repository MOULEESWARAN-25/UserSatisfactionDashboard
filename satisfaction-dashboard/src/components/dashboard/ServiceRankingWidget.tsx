"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Trophy, Award, Medal } from "lucide-react";
import { motion } from "framer-motion";
import type { ServiceRanking } from "@/types/analytics";
import { cn, formatScore } from "@/lib/utils";

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
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Service Performance Ranking</CardTitle>
              <CardDescription>Ordered by satisfaction score</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {rankings.map((service, idx) => {
              const RankIcon = idx < 3 ? rankIcons[idx].icon : null;
              const rankColor = idx < 3 ? rankIcons[idx].color : "";

              return (
                <motion.div
                  key={service.serviceId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50",
                    idx === 0 && "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30",
                    idx === rankings.length - 1 &&
                      service.score < 3.0 &&
                      "border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/30"
                  )}
                >
                  {/* Rank Number or Icon */}
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      idx === 0 && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                      idx === 1 && "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
                      idx === 2 && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                      idx > 2 && "bg-muted text-muted-foreground"
                    )}
                  >
                    {RankIcon ? <RankIcon className={cn("h-4 w-4", rankColor)} /> : idx + 1}
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{service.serviceName}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            service.score >= 4.0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : service.score >= 3.0
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                          )}
                        >
                          {formatScore(service.score)} / 5
                        </span>
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

                  {/* Performance Badge */}
                  {idx === 0 && (
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      Top
                    </Badge>
                  )}
                  {idx === rankings.length - 1 && service.score < 3.0 && (
                    <Badge className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                      Needs Attention
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
