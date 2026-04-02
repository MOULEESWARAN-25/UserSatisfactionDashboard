"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import type { RatingDistribution } from "@/types/analytics";

interface RatingDistributionChartProps {
  data: RatingDistribution[];
  index?: number;
}

const COLORS = [
  { fill: "#ef4444", label: "1 Star",  bg: "bg-red-500" },
  { fill: "#f97316", label: "2 Stars", bg: "bg-orange-500" },
  { fill: "#eab308", label: "3 Stars", bg: "bg-yellow-500" },
  { fill: "#3b82f6", label: "4 Stars", bg: "bg-blue-500" },
  { fill: "#22c55e", label: "5 Stars", bg: "bg-emerald-500" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0];
    const total = data?.payload?.total ?? 1;
    const pct = ((data?.value / total) * 100).toFixed(1);
    return (
      <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur px-4 py-3 shadow-2xl">
        <p className="mb-1 text-sm font-semibold text-foreground">{data?.name}</p>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">
            Count: <span className="font-bold text-foreground">{data?.value}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Share: <span className="font-bold text-foreground">{pct}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function RatingDistributionChart({ data, index = 0 }: RatingDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const chartData = data.map((d, i) => ({
    name: COLORS[i]?.label ?? `${d.rating} Stars`,
    value: d.count,
    total,
    color: COLORS[i]?.fill ?? "#6b7280",
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
            <PieChartIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-0">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                  labelLine={false}
                  label={renderCustomLabel}
                  animationBegin={200}
                  animationDuration={800}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {chartData.map((item, idx) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.06 }}
                  className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-2"
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{pct}%</span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
