"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceFilter } from "@/components/dashboard/ServiceFilter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDate, formatScore } from "@/lib/utils";
import type { FeedbackRecord } from "@/types/feedback";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedbackPage() {
  const [selected, setSelected] = useState("all");
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = selected !== "all" ? `?serviceId=${selected}&limit=50` : "?limit=50";
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
    <AppShell title="Feedback" description="All submitted feedback entries">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <Input
              placeholder="Search feedback..."
              className="pl-8 h-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ServiceFilter selected={selected} onChange={setSelected} />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Feedback Entries</CardTitle>
            <CardDescription>{filtered.length} records</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-md" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Comment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                          No feedback found.
                        </td>
                      </tr>
                    )}
                    {filtered.map((item) => (
                      <tr key={item._id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3 font-medium">{item.serviceName ?? item.serviceId}</td>
                        <td className="px-6 py-3">
                          <Badge
                            variant={
                              item.overallSatisfaction >= 4 ? "success" :
                              item.overallSatisfaction >= 3 ? "secondary" :
                              "destructive" as any
                            }
                          >
                            {formatScore(item.overallSatisfaction)}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 hidden md:table-cell text-muted-foreground max-w-xs truncate">
                          {item.comment ?? "—"}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
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
  );
}
