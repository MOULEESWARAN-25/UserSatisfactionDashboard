import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";
import type { FeedbackRecord } from "@/types/feedback";

interface RecentFeedbackProps {
  feedback: FeedbackRecord[];
}

function ScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 4 ? "success" :
    score >= 3 ? "secondary" :
    "destructive";
  return <Badge variant={variant as any}>{score.toFixed(1)}</Badge>;
}

export function RecentFeedback({ feedback }: RecentFeedbackProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Feedback</CardTitle>
        <CardDescription>Latest submissions across all services</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {feedback.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              No feedback submitted yet.
            </p>
          )}
          {feedback.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.serviceName}</p>
                {item.comment && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-xs">
                    "{item.comment}"
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <ScoreBadge score={item.overallSatisfaction} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(item.submittedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
