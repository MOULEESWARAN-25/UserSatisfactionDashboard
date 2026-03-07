"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { ServiceParticipation } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface ParticipationByServiceProps {
  participationData: ServiceParticipation[];
  index?: number;
}

const reliabilityConfig = {
  high: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    label: "Reliable",
  },
  medium: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    label: "Moderate",
  },
  low: {
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    label: "Low Sample",
  },
};

export function ParticipationByService({ participationData, index = 0 }: ParticipationByServiceProps) {
  const sortedData = [...participationData].sort((a, b) => b.participationRate - a.participationRate);
  const avgParticipation =
    participationData.reduce((sum, p) => sum + p.participationRate, 0) / participationData.length;

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
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Participation by Service</CardTitle>
              <CardDescription>
                Response rates and data reliability - Avg: {avgParticipation.toFixed(1)}%
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedData.map((service, idx) => {
              const reliabilityInfo = reliabilityConfig[service.reliability];
              const percentage = service.participationRate;

              return (
                <motion.div
                  key={service.serviceId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold">{service.serviceName}</p>
                        <Badge
                          variant="secondary"
                          className={cn("rounded-full text-xs font-medium", reliabilityInfo.bgColor)}
                        >
                          {reliabilityInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {service.totalResponses} / {service.expectedResponses} responses
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {service.trend === "increasing" && (
                            <>
                              <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                Increasing
                              </span>
                            </>
                          )}
                          {service.trend === "decreasing" && (
                            <>
                              <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                              <span className="font-medium text-rose-600 dark:text-rose-400">
                                Decreasing
                              </span>
                            </>
                          )}
                          {service.trend === "stable" && (
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
                          "text-lg font-bold",
                          percentage >= 20
                            ? "text-emerald-600 dark:text-emerald-400"
                            : percentage >= 15
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        percentage >= 20
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : percentage >= 15
                          ? "bg-amber-500 dark:bg-amber-400"
                          : "bg-rose-500 dark:bg-rose-400"
                      )}
                    />
                  </div>

                  {/* Warning for low participation */}
                  {service.reliability === "low" && (
                    <div className="flex items-center gap-2 rounded-md bg-rose-50 p-2 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span>Low participation may affect data reliability</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Overall Insights */}
          <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-3 text-xs">
            <p className="font-medium">Insights:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                • {sortedData[0].serviceName} has the highest participation ({sortedData[0].participationRate.toFixed(1)}%)
              </li>
              <li>
                • {sortedData[sortedData.length - 1].serviceName} needs more engagement (
                {sortedData[sortedData.length - 1].participationRate.toFixed(1)}%)
              </li>
              {sortedData.filter((s) => s.reliability === "low").length > 0 && (
                <li className="text-rose-600 dark:text-rose-400">
                  • {sortedData.filter((s) => s.reliability === "low").length} service(s) with low
                  sample size
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
