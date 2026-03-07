"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { RatingDistribution } from "@/types/analytics";

interface RatingDistributionChartProps {
  data: RatingDistribution[];
}

const COLORS = [
  "#ef4444", // 1 – red
  "#f97316", // 2 – orange
  "#eab308", // 3 – yellow
  "#3b82f6", // 4 – blue
  "#22c55e", // 5 – green
];

const LABELS = ["★ 1", "★ 2", "★ 3", "★ 4", "★ 5"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-background p-3 shadow-md text-xs">
        <p className="font-medium">{payload[0]?.payload?.label}</p>
        <p className="text-muted-foreground">
          Count: <span className="font-semibold text-foreground">{payload[0]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  const chartData = data.map((d, i) => ({ ...d, label: LABELS[i] ?? `★ ${d.rating}` }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Rating Distribution</CardTitle>
        <CardDescription>Count of each star rating (1–5)</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
