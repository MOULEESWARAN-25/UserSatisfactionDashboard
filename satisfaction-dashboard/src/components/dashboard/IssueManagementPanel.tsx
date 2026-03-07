"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  User,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ManagedIssue } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface IssueManagementPanelProps {
  issues: ManagedIssue[];
  onUpdateIssue?: (issueId: string, updates: Partial<ManagedIssue>) => void;
  index?: number;
}

const statusConfig = {
  open: {
    icon: AlertCircle,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950",
    label: "Open",
  },
  investigating: {
    icon: Search,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    label: "Investigating",
  },
  in_progress: {
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    label: "In Progress",
  },
  resolved: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    label: "Resolved",
  },
  closed: {
    icon: CheckCircle2,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950",
    label: "Closed",
  },
};

const severityColors = {
  critical: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export function IssueManagementPanel({ issues, onUpdateIssue, index = 0 }: IssueManagementPanelProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ManagedIssue["status"] | "all">("all");

  const safeIssues = issues || [];
  const filteredIssues = filterStatus === "all" ? safeIssues : safeIssues.filter((i) => i.status === filterStatus);

  const statusCounts = {
    open: safeIssues.filter((i) => i.status === "open").length,
    investigating: safeIssues.filter((i) => i.status === "investigating").length,
    in_progress: safeIssues.filter((i) => i.status === "in_progress").length,
    resolved: safeIssues.filter((i) => i.status === "resolved").length,
    closed: safeIssues.filter((i) => i.status === "closed").length,
  };

  const toggleExpand = (issueId: string) => {
    setExpandedIssue(expandedIssue === issueId ? null : issueId);
  };

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const getDaysUntil = (date: Date | undefined) => {
    if (!date) return "Not set";
    const days = Math.floor((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full border-2 border-rose-200/50 dark:border-rose-800/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Issue Management
                  <Badge className="rounded-full bg-rose-600 text-white">{safeIssues.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {statusCounts.open} open • {statusCounts.investigating} investigating • {statusCounts.resolved}{" "}
                  resolved
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className="rounded-full"
            >
              All ({safeIssues.length})
            </Button>
            {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
              const config = statusConfig[status];
              const StatusIcon = config.icon;
              return (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="rounded-full gap-1.5"
                >
                  <StatusIcon className="h-3 w-3" />
                  {config.label} ({statusCounts[status]})
                </Button>
              );
            })}
          </div>

          {/* Issues List */}
          <div className="space-y-2">
            {filteredIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">
                  {filterStatus === "all" ? "No issues found" : `No ${filterStatus} issues`}
                </p>
              </div>
            ) : (
              filteredIssues.map((issue, idx) => {
                const config = statusConfig[issue.status as keyof typeof statusConfig] || statusConfig.open;
                const StatusIcon = config.icon;
                const isExpanded = expandedIssue === issue.id;

                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "rounded-lg border transition-all hover:shadow-md",
                      config.bgColor,
                      issue.severity === "critical" && "border-l-4 border-l-rose-600 dark:border-l-rose-400"
                    )}
                  >
                    <div className="p-3">
                      <div className="flex items-start gap-3">
                        <StatusIcon className={cn("mt-0.5 h-5 w-5 flex-shrink-0", config.color)} />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-sm leading-tight">{issue.title}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{issue.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              <Badge
                                variant="secondary"
                                className={cn("rounded-full text-xs font-medium", severityColors[issue.severity])}
                              >
                                {issue.severity}
                              </Badge>
                              <Badge variant="outline" className="rounded-full text-xs">
                                {issue.serviceName}
                              </Badge>
                            </div>
                          </div>

                          {/* Quick Info */}
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Detected {getDaysAgo(new Date(issue.detectedAt))}
                            </span>
                            {issue.assignedToName && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {issue.assignedToName}
                              </span>
                            )}
                            {issue.expectedResolution && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Due: {getDaysUntil(new Date(issue.expectedResolution))}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {issue.actions.length} {issue.actions.length === 1 ? "action" : "actions"}
                            </span>
                          </div>

                          {/* Expand/Collapse Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(issue.id)}
                            className="mt-2 h-7 gap-1 rounded-full px-3 text-xs"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3 w-3" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3" />
                                View Details
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 space-y-3 border-t pt-3">
                              {/* Action Log */}
                              <div>
                                <h4 className="mb-2 text-xs font-semibold">Action Log</h4>
                                <div className="space-y-2">
                                  {issue.actions.map((action, actionIdx) => (
                                    <div
                                      key={actionIdx}
                                      className="rounded-md border bg-background/50 p-2 text-xs"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">{action.action}</span>
                                        <span className="text-muted-foreground">
                                          {new Date(action.timestamp).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </span>
                                      </div>
                                      {action.notes && (
                                        <p className="mt-1 text-muted-foreground">{action.notes}</p>
                                      )}
                                      <p className="mt-1 text-muted-foreground">By: {action.takenBy}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Resolution Details */}
                              {issue.resolution && (
                                <div className="rounded-md border bg-emerald-50 p-3 dark:bg-emerald-950">
                                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Resolution
                                  </h4>
                                  <p className="mb-2 text-xs leading-relaxed text-emerald-800 dark:text-emerald-200">
                                    {issue.resolution.resolutionNotes || "No details provided."}
                                  </p>
                                  <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
                                    <span>
                                      Resolved: {" "}
                                      {issue.resolution.resolvedAt && new Date(issue.resolution.resolvedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                    {typeof issue.resolution.satisfactionAfter === "number" && (
                                      <span className="font-medium">
                                        Verified: {issue.resolution.satisfactionAfter.toFixed(1)}/5
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
