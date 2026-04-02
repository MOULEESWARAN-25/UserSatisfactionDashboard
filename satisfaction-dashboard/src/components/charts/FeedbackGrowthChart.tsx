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
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import type { TrendPoint } from "@/types/analytics";

interface FeedbackGrowthChartProps {
  data: TrendPoint[];
  index?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur px-4 py-3 shadow-2xl">
        <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          Submissions:{" "}
          <span className="font-bold text-foreground">
            {payload[0]?.value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function FeedbackGrowthChart({ data, index = 0 }: FeedbackGrowthChartProps) {
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
            Feedback Volume
          </CardTitle>
          <CardDescription>Daily submission count over time</CardDescription>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
          <Activity className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
            >
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
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#8b5cf6",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                  fill: "#8b5cf6",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
