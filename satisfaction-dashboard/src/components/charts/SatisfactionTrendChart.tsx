"use client";

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

export function SatisfactionTrendChart({ data, index = 0 }: SatisfactionTrendChartProps) {
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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
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
      <CardContent className="pb-4 pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
            >
              <defs>
                <linearGradient id="satisfactionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={[1, 5]}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#satisfactionGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                  fill: "hsl(var(--chart-2))",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
