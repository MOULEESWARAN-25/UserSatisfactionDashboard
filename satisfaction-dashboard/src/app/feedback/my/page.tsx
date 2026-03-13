"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Star, EyeOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StudentOnly } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import { MOCK_FEEDBACK } from "@/lib/mock-data";
import type { FeedbackRecord } from "@/types/feedback";

export default function MyFeedbackPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<FeedbackRecord[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    fetch(`/api/feedback?studentId=${encodeURIComponent(user.id)}&limit=100`)
      .then((r) => r.json())
      .then((d) => setRecords(d.feedback ?? []))
      .catch(() => {
        setRecords(MOCK_FEEDBACK.filter((f) => f.studentId === user.id));
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const averageScore = useMemo(() => {
    if (records.length === 0) return 0;
    return records.reduce((sum, r) => sum + r.overallSatisfaction, 0) / records.length;
  }, [records]);

  return (
    <StudentOnly>
      <AppShell
        title="My Feedback"
        description="View your submitted feedback history"
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Submissions</p>
                <p className="mt-1 text-2xl font-semibold">{records.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Average Rating</p>
                <p className="mt-1 text-2xl font-semibold">{averageScore.toFixed(2)} / 5</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Submission History</CardTitle>
              <CardDescription>
                Anonymous submissions are intentionally not linked back to your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : records.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <MessageSquare className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium">No feedback submitted yet</p>
                  <p className="text-xs text-muted-foreground">Submit your first service feedback to see it here.</p>
                </div>
              ) : (
                records.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.serviceName}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.comment || "No comment provided"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline" className="rounded-full">
                        <Star className="mr-1 h-3 w-3" />
                        {item.overallSatisfaction}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(item.submittedAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-300/60 bg-amber-50/40 dark:bg-amber-950/20">
            <CardContent className="flex items-start gap-3 p-4">
              <EyeOff className="mt-0.5 h-4 w-4 text-amber-700 dark:text-amber-400" />
              <p className="text-xs text-muted-foreground">
                If you choose anonymous submission, your response is saved without personal identity and cannot appear in this list.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </StudentOnly>
  );
}
