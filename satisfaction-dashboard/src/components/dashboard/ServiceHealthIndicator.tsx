"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, AlertCircle, XCircle, Activity } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { ServiceHealth } from "@/types/analytics";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItemLeft,
  cardHoverProps,
  iconHoverProps,
  progressBar,
  badgePop,
} from "@/lib/animations";

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
    barColor: "bg-emerald-500",
    label: "Excellent",
  },
  good: {
    icon: CheckCircle,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-900",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    barColor: "bg-blue-500",
    label: "Good",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-900",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    barColor: "bg-amber-500",
    label: "Warning",
  },
  critical: {
    icon: XCircle,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950",
    borderColor: "border-rose-200 dark:border-rose-900",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    barColor: "bg-rose-500",
    label: "Critical",
  },
};

export function ServiceHealthIndicator({ services, index = 0 }: ServiceHealthIndicatorProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const criticalCount = services.filter((s) => s.status === "critical").length;
  const warningCount = services.filter((s) => s.status === "warning").length;

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
                {...iconHoverProps}
              >
                <Activity className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <CardTitle className="text-base font-semibold">Service Health Status</CardTitle>
                <CardDescription>Real-time performance indicators</CardDescription>
              </div>
            </div>
            {(criticalCount > 0 || warningCount > 0) && (
              <div className="flex gap-2">
                <AnimatePresence>
                  {criticalCount > 0 && (
                    <motion.div
                      variants={badgePop}
                      initial="hidden"
                      animate="visible"
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <Badge variant="destructive" className="rounded-full">
                        {criticalCount} Critical
                      </Badge>
                    </motion.div>
                  )}
                  {warningCount > 0 && (
                    <motion.div
                      variants={badgePop}
                      initial="hidden"
                      animate="visible"
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <Badge className={healthConfig.warning.badgeColor}>
                        {warningCount} Warning
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-2.5"
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {services.map((service, idx) => {
              const config = healthConfig[service.status];
              const IconComponent = config.icon;
              const scorePct = (service.score / 5) * 100;

              return (
                <motion.div
                  key={service.serviceId}
                  variants={staggerItemLeft}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border p-3 cursor-default transition-all hover:shadow-sm",
                    config.bgColor,
                    config.borderColor
                  )}
                  whileHover={{ x: 3, transition: { duration: 0.18 } }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: service.status === "critical" ? 15 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className={cn("h-5 w-5 flex-shrink-0", config.color)} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold truncate">{service.serviceName}</p>
                        <motion.div variants={badgePop}>
                          <Badge
                            variant="secondary"
                            className={cn("rounded-full text-xs font-medium", config.badgeColor)}
                          >
                            {config.label}
                          </Badge>
                        </motion.div>
                      </div>
                      <p className="text-xs text-muted-foreground">{service.message}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="font-medium">Score: {service.score.toFixed(1)}/5</span>
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
                  {/* Animated score bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <motion.div
                      className={cn("h-full rounded-full", config.barColor)}
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

          {/* Overall Summary */}
          <motion.div
            className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + services.length * 0.05 }}
          >
            <span className="font-medium">Overall System Health:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${criticalCount}-${warningCount}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {criticalCount === 0 && warningCount === 0 ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    All Systems Operational
                  </span>
                ) : (
                  <span className="font-semibold">
                    {criticalCount > 0 ? `${criticalCount} Critical, ` : ""}
                    {warningCount > 0 ? `${warningCount} Warning` : ""}
                  </span>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
