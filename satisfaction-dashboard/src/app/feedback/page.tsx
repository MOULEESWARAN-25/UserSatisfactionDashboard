"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, User } from "lucide-react";
import { formatDate, formatScore } from "@/lib/utils";
import type { FeedbackRecord } from "@/types/feedback";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { cn } from "@/lib/utils";

export default function FeedbackPage() {
  const [selected, setSelected] = useState("all");
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params =
      selected !== "all" ? `?serviceId=${selected}&limit=50` : "?limit=50";
    fetch(`/api/feedback${params}`)
      .then((r) => r.json())
      .then((d) => setFeedback(d.feedback ?? []))
      .finally(() => setLoading(false));
  }, [selected]);

  const filtered = feedback.filter(
    (f) =>
      !search ||
      f.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      f.comment?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminOnly>
      <AppShell title="Feedback" description="All submitted feedback entries">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                className="h-10 rounded-xl pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ServiceFilter selected={selected} onChange={setSelected} />
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Feedback Entries</CardTitle>
                  <CardDescription>
                    {filtered.length} records found
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Service
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Score
                        </th>
                        <th className="hidden px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                          Comment
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filtered.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-16 text-center text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <p>No feedback found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                      {filtered.map((item) => (
                        <tr
                          key={item._id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span className="font-medium">
                                {item.serviceName ?? item.serviceId}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                                item.overallSatisfaction >= 4
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                  : item.overallSatisfaction >= 3
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                              )}
                            >
                              {formatScore(item.overallSatisfaction)}
                            </span>
                          </td>
                          <td className="hidden max-w-xs truncate px-6 py-4 text-muted-foreground md:table-cell">
                            {item.comment || (
                              <span className="italic text-muted-foreground/50">
                                No comment
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                            {formatDate(item.submittedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </AdminOnly>
  );
}
