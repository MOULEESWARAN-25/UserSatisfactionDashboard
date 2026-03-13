"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { ServiceSatisfaction } from "@/types/analytics";

interface ServiceComparisonChartProps {
  data: ServiceSatisfaction[];
  index?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur px-4 py-3 shadow-2xl">
        <p className="mb-1.5 text-sm font-semibold text-foreground">{data?.serviceName}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Score</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {data?.avgScore?.toFixed(1)} / 5
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Feedback</span>
            <span className="text-sm font-semibold">{data?.totalFeedback}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ServiceComparisonChart({ data, index = 0 }: ServiceComparisonChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    fullMark: 5,
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
              Service Comparison
            </CardTitle>
            <CardDescription>
              Radar view of satisfaction across all services
            </CardDescription>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-950">
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <PolarGrid 
                  stroke="#e5e7eb" 
                  strokeDasharray="3 3"
                  className="dark:stroke-zinc-700"
                />
                <PolarAngleAxis
                  dataKey="serviceName"
                  tick={{ 
                    fontSize: 11, 
                    fill: "#6b7280",
                    fontWeight: 500,
                  }}
                  className="dark:fill-zinc-400"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickCount={6}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Radar
                  name="Satisfaction"
                  dataKey="avgScore"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#radarGradient)"
                  dot={{
                    r: 5,
                    fill: "#8b5cf6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#7c3aed",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Score Cards */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {chartData.map((item, idx) => {
              const scoreColor = 
                item.avgScore >= 4.5 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950" :
                item.avgScore >= 4 ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950" :
                item.avgScore >= 3.5 ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950" :
                item.avgScore >= 3 ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950" :
                "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950";
              
              return (
                <motion.div
                  key={item.serviceId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className={`flex flex-col items-center rounded-xl p-3 ${scoreColor}`}
                >
                  <span className="text-lg font-bold">{item.avgScore.toFixed(1)}</span>
                  <span className="text-[10px] font-medium opacity-80 text-center leading-tight">
                    {item.serviceName}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
