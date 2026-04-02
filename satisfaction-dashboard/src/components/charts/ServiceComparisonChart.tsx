"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceSatisfaction } from "@/types/analytics";

interface ServiceComparisonChartProps {
  data: ServiceSatisfaction[];
  index?: number;
}

const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#ec4899", // pink
  "#f43f5e", // rose
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur px-4 py-3 shadow-2xl">
        <p className="mb-1.5 text-sm font-semibold text-foreground">{data?.serviceName}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-muted-foreground">Avg Score</span>
            <span className="text-sm font-bold text-primary">
              {data?.avgScore?.toFixed(1)} / 5
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-muted-foreground">Total Feedback</span>
            <span className="text-sm font-semibold">{data?.totalFeedback}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs text-muted-foreground">Trend</span>
            <span className={cn(
              "text-xs font-medium",
              data?.trend === "up" ? "text-emerald-500" :
              data?.trend === "down" ? "text-rose-500" : "text-muted-foreground"
            )}>
              {data?.trend === "up" ? "↑ Improving" : data?.trend === "down" ? "↓ Declining" : "→ Stable"}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ServiceComparisonChart({ data, index = 0 }: ServiceComparisonChartProps) {
  const sortedData = [...data].sort((a, b) => b.avgScore - a.avgScore);

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
              Service Comparison
            </CardTitle>
            <CardDescription>
              Average satisfaction scores by service
            </CardDescription>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-950">
            <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 4, right: 40, bottom: 4, left: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tickCount={6}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="serviceName"
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Bar dataKey="avgScore" radius={[0, 6, 6, 0]} barSize={28}>
                  {sortedData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="avgScore"
                    position="right"
                    formatter={(value: number) => value.toFixed(1)}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      fill: "hsl(var(--foreground))",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend indicators */}
          <div className="mt-3 flex flex-wrap gap-2">
            {sortedData.map((item, idx) => (
              <motion.div
                key={item.serviceId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-xs font-medium">{item.serviceName}</span>
                <span className={cn(
                  "text-[10px] font-semibold",
                  item.trend === "up" ? "text-emerald-500" :
                  item.trend === "down" ? "text-rose-500" : "text-muted-foreground"
                )}>
                  {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "—"}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
