"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { TrendPoint } from "@/types/analytics";

interface SatisfactionTrendChartProps {
  data: TrendPoint[];
  index?: number;
  toolbar?: ReactNode;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
        <p className="mb-1 text-xs font-medium">{label}</p>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">
            Score:{" "}
            <span className="font-semibold text-foreground">
              {payload[0]?.value?.toFixed(2)}
            </span>
          </p>
          {payload[1] && (
            <p className="text-xs text-muted-foreground">
              Responses:{" "}
              <span className="font-semibold text-foreground">
                {payload[1]?.value}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function SatisfactionTrendChart({ data, index = 0, toolbar }: SatisfactionTrendChartProps) {
  const hasData = data.length > 0;

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
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex min-h-[76px] flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            Satisfaction Trend
          </CardTitle>
          <CardDescription>
            Average satisfaction score over time
          </CardDescription>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
          <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
      </CardHeader>
      {toolbar && <div className="border-t border-border/60 px-6 py-3">{toolbar}</div>}
      <CardContent className="pb-4 pt-0">
        {hasData ? (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
              >
                <defs>
                  <linearGradient id="satisfactionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  domain={[1, 5]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#satisfactionGrad)"
                  dot={{
                    r: 2,
                    fill: "var(--primary)",
                    stroke: "var(--background)",
                    strokeWidth: 1,
                  }}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "var(--background)",
                    fill: "var(--primary)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No trend data available for the selected range.
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
