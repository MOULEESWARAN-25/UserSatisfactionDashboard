"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, AlertCircle, XCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";
import type { ServiceHealth } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface ServiceHealthIndicatorProps {
  services: ServiceHealth[];
  index?: number;
}

const healthConfig = {
  excellent: {
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    borderColor: "border-emerald-200 dark:border-emerald-900",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    label: "Excellent",
    description: "All metrics performing well",
  },
  good: {
    icon: CheckCircle,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-900",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    label: "Good",
    description: "Performance is satisfactory",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-900",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    label: "Warning",
    description: "Attention needed",
  },
  critical: {
    icon: XCircle,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950",
    borderColor: "border-rose-200 dark:border-rose-900",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    label: "Critical",
    description: "Immediate action required",
  },
};

export function ServiceHealthIndicator({ services, index = 0 }: ServiceHealthIndicatorProps) {
  if (!services || services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Service Health</CardTitle>
                <CardDescription>System status overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No health data available</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const criticalCount = services.filter((s) => s.status === "critical").length;
  const warningCount = services.filter((s) => s.status === "warning").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Service Health Status</CardTitle>
                <CardDescription>Real-time service performance indicators</CardDescription>
              </div>
            </div>
            {(criticalCount > 0 || warningCount > 0) && (
              <div className="flex gap-2">
                {criticalCount > 0 && (
                  <Badge variant="destructive" className="rounded-full">
                    {criticalCount} Critical
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge className={healthConfig.warning.badgeColor}>
                    {warningCount} Warning
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {services.map((service, idx) => {
              const config = healthConfig[service.status];
              const IconComponent = config.icon;

              return (
                <motion.div
                  key={service.serviceId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 transition-all hover:shadow-sm",
                    config.bgColor,
                    config.borderColor
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <IconComponent className={cn("h-5 w-5 flex-shrink-0", config.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate">{service.serviceName}</p>
                        <Badge
                          variant="secondary"
                          className={cn("rounded-full text-xs font-medium", config.badgeColor)}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{service.message}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="font-medium">
                          Score: {service.score.toFixed(1)}/5
                        </span>
                        <span>•</span>
                        <span>
                          {service.issueCount === 0
                            ? "No issues"
                            : `${service.issueCount} issue${service.issueCount > 1 ? "s" : ""}`}
                        </span>
                        <span>•</span>
                        <span>{service.participationRate.toFixed(0)}% participation</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Overall Summary */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
            <span className="font-medium">Overall System Health:</span>
            <span>
              {criticalCount === 0 && warningCount === 0 ? (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  All Systems Operational
                </span>
              ) : (
                <span className="font-semibold">
                  {criticalCount > 0
                    ? `${criticalCount} Critical, `
                    : ""}
                  {warningCount > 0 ? `${warningCount} Warning` : ""}
                </span>
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
