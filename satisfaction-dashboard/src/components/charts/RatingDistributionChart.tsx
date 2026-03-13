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
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { RatingDistribution } from "@/types/analytics";

interface RatingDistributionChartProps {
  data: RatingDistribution[];
  index?: number;
}

const COLORS = [
  "hsl(0, 84%, 60%)",    // 1 - red
  "hsl(25, 95%, 53%)",   // 2 - orange
  "hsl(48, 96%, 53%)",   // 3 - yellow
  "hsl(221, 83%, 53%)",  // 4 - blue
  "hsl(142, 76%, 36%)",  // 5 - green
];

const LABELS = ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
        <p className="mb-0.5 text-xs font-medium">{payload[0]?.payload?.label}</p>
        <p className="text-xs text-muted-foreground">
          Count:{" "}
          <span className="font-semibold text-foreground">
            {payload[0]?.value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function RatingDistributionChart({ data, index = 0 }: RatingDistributionChartProps) {
  const chartData = data.map((d, i) => ({
    ...d,
    label: LABELS[i] ?? `${d.rating} Stars`,
    shortLabel: d.rating.toString(),
  }));

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
            Rating Distribution
          </CardTitle>
          <CardDescription>Breakdown by star rating</CardDescription>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
          <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="shortLabel"
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
