"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { SERVICES } from "@/lib/constants";
import type { FeedbackRecord } from "@/types/feedback";

interface RecentFeedbackProps {
  feedback: FeedbackRecord[];
  index?: number;
}

function ScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 4
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      : score >= 3
        ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variant}`}
    >
      {score.toFixed(1)}
    </span>
  );
}

export function RecentFeedback({ feedback, index = 0 }: RecentFeedbackProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
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
            Recent Feedback
          </CardTitle>
          <CardDescription>Latest submissions across services</CardDescription>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <motion.div
          className="divide-y divide-border/50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {feedback.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No feedback submitted yet
              </p>
            </div>
          )}
          {feedback.map((item) => {
            const service = SERVICES.find((s) => s.id === item.serviceId);
            return (
              <motion.div
                key={item._id}
                variants={itemVariants}
                className="flex items-start justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {item.serviceName || service?.name || item.serviceId}
                    </span>
                    <ScoreBadge score={item.overallSatisfaction} />
                  </div>
                  {item.comment && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {item.comment}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(item.submittedAt)}</span>
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
