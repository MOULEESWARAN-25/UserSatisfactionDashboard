import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDelta, getDeltaColor } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  delta?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  description,
  delta,
  icon: Icon,
  iconColor = "text-muted-foreground",
}: MetricCardProps) {
  const DeltaIcon = delta === undefined ? null : delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {(description || delta !== undefined) && (
              <div className="flex items-center gap-1.5">
                {DeltaIcon && delta !== undefined && (
                  <span className={cn("flex items-center gap-0.5 text-xs font-medium", getDeltaColor(delta))}>
                    <DeltaIcon size={12} />
                    {formatDelta(delta)}
                  </span>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </div>
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0 ml-4",
            iconColor
          )}>
            <Icon size={16} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
