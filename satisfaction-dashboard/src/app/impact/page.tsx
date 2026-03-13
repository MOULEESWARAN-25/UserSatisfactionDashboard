"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Megaphone,
  Wrench,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

import { IMPACT_STORIES } from "@/lib/mock-data";

export default function ImpactPage() {
  const [activeStory, setActiveStory] = useState(IMPACT_STORIES[0].id);

  return (
    <AppShell
      title="Feedback Impact"
      description="See how your voice is driving real change across campus."
    >
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right_bottom,rgba(255,255,255,0.2),transparent)]" />
          <div className="relative px-8 py-12 md:px-12 md:py-16 lg:py-20">
            <div className="max-w-2xl space-y-4">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/20 border-none">
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Closing the Loop
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                You Spoke. <br /> We Listened.
              </h1>
              <p className="max-w-xl text-primary-foreground/80 md:text-lg">
                We believe feedback shouldn't disappear into a black hole. Here is exactly what we've changed based on your recent ratings and comments.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Timeline List */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Improvements
            </h3>
            <div className="space-y-3">
              {IMPACT_STORIES.map((story) => (
                <motion.div key={story.id} variants={staggerItem}>
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      activeStory === story.id 
                        ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                        : "hover:border-primary/50"
                    )}
                    onClick={() => setActiveStory(story.id)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <Badge variant="outline" className="font-medium text-muted-foreground bg-background">
                          {story.serviceName}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(story.date))}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm font-medium">
                        {story.issueSummary}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed View */}
          <div className="md:col-span-2">
            <AnimatePresence mode="popLayout">
              {IMPACT_STORIES.map((story) => {
                if (story.id !== activeStory) return null;
                
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="h-full"
                  >
                    <Card className="h-full overflow-hidden border-2">
                        <div className="bg-muted/30 px-6 py-4 border-b">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <h2 className="text-lg font-semibold">Resolution Report: {story.serviceName}</h2>
                        </div>
                      </div>
                      
                      <CardContent className="p-0">
                        <div className="grid divide-y md:divide-x md:divide-y-0 md:grid-cols-2">
                          
                          {/* You Spoke */}
                          <div className="p-6 md:p-8 space-y-4 bg-rose-50/30 dark:bg-rose-950/10">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/50">
                                <Megaphone className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                              </div>
                              <h3 className="font-semibold text-rose-900 dark:text-rose-300">The Problem</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground italic">
                              &ldquo;{story.studentComplaintQuote}&rdquo;
                            </p>
                          </div>

                          {/* We Listened */}
                          <div className="p-6 md:p-8 space-y-4 bg-emerald-50/30 dark:bg-emerald-950/10">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                                <Wrench className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <h3 className="font-semibold text-emerald-900 dark:text-emerald-300">{story.resolutionTitle}</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {story.resolutionDescription}
                            </p>
                          </div>

                        </div>

                        {/* Impact Metric */}
                        <div className="border-t bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8">
                          <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Measurable Impact
                          </h3>
                          
                          <div className="flex items-center justify-center gap-4 sm:gap-8">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground text-center">
                                {story.metrics.metricName} <br /> (Before)
                              </span>
                              <div className="flex h-16 w-24 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
                                <span className="text-xl font-bold text-slate-400">{story.metrics.beforeValue}</span>
                              </div>
                            </div>
                            
                            <ArrowRight className="h-6 w-6 text-muted-foreground/40 mt-10" />
                            
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 text-center">
                                {story.metrics.metricName} <br /> (After)
                              </span>
                              <div className="flex h-16 w-24 items-center justify-center rounded-2xl bg-white shadow-sm ring-2 ring-emerald-500/20 dark:bg-slate-800">
                                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{story.metrics.afterValue}</span>
                              </div>
                            </div>
                            
                            <div className="hidden sm:flex flex-col items-start gap-1 ml-4 border-l-2 pl-8 border-emerald-100 dark:border-emerald-900 mt-6">
                              <span className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                                Improvement
                              </span>
                              <span className="flex items-center gap-1 text-2xl font-black text-emerald-500">
                                <TrendingUp className="h-5 w-5" />
                                +{story.metrics.improvementPercent}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </AppShell>
  );
}
