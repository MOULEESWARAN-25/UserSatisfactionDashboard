import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, formatScore } from "@/lib/utils";
import type { ServiceSatisfaction } from "@/types/analytics";
import { SERVICES } from "@/lib/constants";

interface SatisfactionOverviewProps {
  data: ServiceSatisfaction[];
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp size={13} className="text-emerald-500" />;
  if (trend === "down") return <TrendingDown size={13} className="text-red-500" />;
  return <Minus size={13} className="text-muted-foreground" />;
}

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? "bg-emerald-500" : score >= 3 ? "bg-blue-500" : "bg-red-400";
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function SatisfactionOverview({ data }: SatisfactionOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Service Satisfaction</CardTitle>
        <CardDescription>Average scores per service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const service = SERVICES.find((s) => s.id === item.serviceId);
          return (
            <div key={item.serviceId} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <span>{service?.icon}</span>
                  <span className="font-medium">{item.serviceName}</span>
                  <TrendIcon trend={item.trend} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {item.totalFeedback} reviews
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatScore(item.avgScore)}
                  </span>
                </div>
              </div>
              <ScoreBar score={item.avgScore} />
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No data yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
