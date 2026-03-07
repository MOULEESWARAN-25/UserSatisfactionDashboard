"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { AIInsight } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface AIInsightsWidgetProps {
  insights: AIInsight[];
  onRegenerateClicked?: () => Promise<void>;
  index?: number;
}

const insightTypeConfig = {
  trend: {
    icon: TrendingUp,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    label: "Trend",
  },
  anomaly: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    label: "Anomaly",
  },
  recommendation: {
    icon: Lightbulb,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    label: "Recommendation",
  },
  summary: {
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    label: "Summary",
  },
};

const priorityColors = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export function AIInsightsWidget({ insights, onRegenerateClicked, index = 0 }: AIInsightsWidgetProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (onRegenerateClicked) {
      setIsRegenerating(true);
      try {
        await onRegenerateClicked();
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const actionableInsights = insights?.filter((i) => i.actionable) || [];
  const highPriorityInsights = insights?.filter((i) => i.priority === "high") || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  AI-Powered Insights
                  <Badge className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    Groq AI
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Intelligent analysis • {highPriorityInsights.length} high priority
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="gap-2 rounded-xl"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No insights generated yet</p>
              <p className="text-xs text-muted-foreground">Click "Regenerate" to analyze current data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.slice(0, 5).map((insight, idx) => {
                const typeConfig = insightTypeConfig[insight.type];
                const IconComponent = typeConfig.icon;

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "rounded-lg border p-4 transition-all hover:shadow-md",
                      typeConfig.bgColor,
                      insight.priority === "high" && "border-l-4 border-l-rose-500"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className={cn("mt-0.5 h-5 w-5 flex-shrink-0", typeConfig.color)} />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-tight">{insight.title}</p>
                          <div className="flex gap-1.5">
                            <Badge
                              variant="secondary"
                              className={cn("rounded-full text-xs font-medium", priorityColors[insight.priority])}
                            >
                              {insight.priority}
                            </Badge>
                            <Badge variant="secondary" className="rounded-full text-xs font-normal">
                              {typeConfig.label}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>

                        {/* Affected Services */}
                        {insight.affectedServices.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {insight.affectedServices.map((service) => (
                              <Badge
                                key={service}
                                variant="outline"
                                className="rounded-full text-xs font-normal"
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Suggested Action */}
                        {insight.suggestedAction && (
                          <div className="mt-2 rounded-md bg-background/50 p-2">
                            <p className="text-xs font-medium">💡 Suggested Action:</p>
                            <p className="text-xs text-muted-foreground">{insight.suggestedAction}</p>
                          </div>
                        )}

                        {/* Confidence Score */}
                        <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                          <div className="flex-1">
                            <div className="h-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                style={{ width: `${insight.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-medium">{(insight.confidence * 100).toFixed(0)}% confident</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {insights.length > 5 && (
                <p className="text-center text-xs text-muted-foreground">
                  +{insights.length - 5} more insights available
                </p>
              )}
            </div>
          )}

          {/* Summary Stats */}
          {insights.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-3 text-sm dark:from-purple-950 dark:to-blue-950">
              <span className="font-medium">AI Analysis Summary:</span>
              <div className="flex gap-3 text-xs">
                <span>
                  {actionableInsights.length}/{insights.length} actionable
                </span>
                <span>•</span>
                <span>{highPriorityInsights.length} high priority</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
