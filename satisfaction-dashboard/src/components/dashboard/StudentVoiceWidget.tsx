"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Smile, Frown, Meh, Quote, Hash } from "lucide-react";
import { motion } from "framer-motion";
import type { AggregatedStudentVoice } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface StudentVoiceWidgetProps {
  studentVoice: AggregatedStudentVoice | null;
  index?: number;
}

const sentimentConfig = {
  positive: {
    icon: Smile,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    label: "Positive",
  },
  neutral: {
    icon: Meh,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
    label: "Neutral",
  },
  negative: {
    icon: Frown,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950",
    borderColor: "border-rose-200 dark:border-rose-800",
    label: "Negative",
  },
};

export function StudentVoiceWidget({ studentVoice, index = 0 }: StudentVoiceWidgetProps) {
  if (!studentVoice) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="h-full border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Student Voice</CardTitle>
                <CardDescription>Representative feedback comments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No comments available</p>
              <p className="text-xs text-muted-foreground">Student feedback will appear here</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                Student Voice
                <Badge variant="secondary" className="rounded-full">
                  {studentVoice.representativeComments.length} comments
                </Badge>
              </CardTitle>
              <CardDescription>What students are saying • AI-curated</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Representative Comments */}
          <div className="space-y-3">
            {studentVoice.representativeComments.map((comment, idx) => {
              const config = sentimentConfig[comment.sentiment];
              const SentimentIcon = config.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "relative rounded-lg border-l-4 p-4 shadow-sm transition-all hover:shadow-md",
                    config.bgColor,
                    config.borderColor
                  )}
                >
                  <Quote className={cn("absolute right-3 top-3 h-8 w-8 opacity-10", config.color)} />
                  <div className="mb-2 flex items-center gap-2">
                    <SentimentIcon className={cn("h-4 w-4", config.color)} />
                    <Badge variant="outline" className={cn("rounded-full text-xs font-medium", config.color)}>
                      {config.label}
                    </Badge>
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {comment.service}
                    </Badge>
                  </div>
                  <p className="relative text-sm italic leading-relaxed text-foreground/90">"{comment.text}"</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Rating: {comment.rating}/5</span>
                    <span>{new Date(comment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Common Phrases */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Hash className="h-4 w-4" />
              Common Phrases & Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {studentVoice.commonPhrases.map((phrase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900 dark:from-cyan-950 dark:to-blue-950 dark:text-cyan-100"
                  >
                    {phrase}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sentiment Summary */}
          <div className="grid grid-cols-3 gap-2">
            {(["positive", "neutral", "negative"] as const).map((sentiment) => {
              const config = sentimentConfig[sentiment];
              const SentimentIcon = config.icon;
              const count = studentVoice.representativeComments.filter(
                (c) => c.sentiment === sentiment
              ).length;
              const percentage = ((count / studentVoice.representativeComments.length) * 100).toFixed(0);

              return (
                <div
                  key={sentiment}
                  className={cn("flex flex-col items-center gap-1 rounded-lg border p-3", config.bgColor)}
                >
                  <SentimentIcon className={cn("h-5 w-5", config.color)} />
                  <span className={cn("text-lg font-bold", config.color)}>{count}</span>
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
