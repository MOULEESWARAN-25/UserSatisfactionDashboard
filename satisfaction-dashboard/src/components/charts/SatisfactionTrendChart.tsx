"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { TrendPoint } from "@/types/analytics";

interface SatisfactionTrendChartProps {
  data: TrendPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-background p-3 shadow-md text-xs">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{payload[0]?.value?.toFixed(2)}</span>
        </p>
        <p className="text-muted-foreground">
          Responses: <span className="font-semibold text-foreground">{payload[1]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function SatisfactionTrendChart({ data }: SatisfactionTrendChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Satisfaction Trend</CardTitle>
        <CardDescription>Average score over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="satisfactionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(220.9 39.3% 11%)" stopOpacity={0.12} />
                <stop offset="95%" stopColor="hsl(220.9 39.3% 11%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[1, 5]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#satisfactionGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
