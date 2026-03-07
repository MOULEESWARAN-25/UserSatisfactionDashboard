"use client";

import { TrendingUp, TrendingDown, Minus, Trophy, AlertTriangle, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ServiceBenchmark } from "@/types/analytics";

interface ServiceBenchmarkWidgetProps {
  benchmarks: ServiceBenchmark[];
  campusAverage: number;
}

export function ServiceBenchmarkWidget({ benchmarks, campusAverage }: ServiceBenchmarkWidgetProps) {
  // Sort by performance (best first)
  const sortedBenchmarks = [...benchmarks].sort((a, b) => b.currentScore - a.currentScore);
  
  const topPerformer = sortedBenchmarks[0];
  const needsAttention = sortedBenchmarks.filter(b => b.performanceLabel === "needs_attention");

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Service Performance Benchmark
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            How each service compares to campus average: {campusAverage.toFixed(2)}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {benchmarks.filter(b => b.vsAverage > 0).length}
            </div>
            <div className="text-xs font-medium text-green-600 mt-1">
              Above Average
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">
              {benchmarks.filter(b => Math.abs(b.vsAverage) < 0.2).length}
            </div>
            <div className="text-xs font-medium text-yellow-600 mt-1">
              At Average
            </div>
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-700">
              {benchmarks.filter(b => b.vsAverage < -0.2).length}
            </div>
            <div className="text-xs font-medium text-red-600 mt-1">
              Needs Attention
            </div>
          </div>
        </div>

        {/* Top Performer Highlight */}
        {topPerformer && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-700">Top Performing Service</div>
                <div className="text-lg font-bold">{topPerformer.serviceName}</div>
                <div className="text-sm text-gray-600">
                  Score: {topPerformer.currentScore.toFixed(2)} 
                  <span className="ml-2 text-green-600 font-medium">
                    +{topPerformer.vsAverage.toFixed(2)} vs average
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-700">
                  {topPerformer.percentile}th
                </div>
                <div className="text-xs text-gray-600">percentile</div>
              </div>
            </div>
          </div>
        )}

        {/* Benchmark List */}
        <div className="space-y-2">
          {sortedBenchmarks.map((benchmark, index) => (
            <BenchmarkRow 
              key={benchmark.serviceId} 
              benchmark={benchmark}
              campusAverage={campusAverage}
              rank={index + 1}
            />
          ))}
        </div>

        {/* Alert for Services Needing Attention */}
        {needsAttention.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-red-800 mb-1">
                  {needsAttention.length} Service{needsAttention.length > 1 ? "s" : ""} Need Attention
                </div>
                <div className="text-sm text-red-700">
                  {needsAttention.map(b => b.serviceName).join(", ")} {needsAttention.length > 1 ? "are" : "is"} performing 
                  significantly below campus average and require immediate review.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function BenchmarkRow({ 
  benchmark, 
  campusAverage, 
  rank 
}: { 
  benchmark: ServiceBenchmark; 
  campusAverage: number;
  rank: number;
}) {
  const percentDiff = ((benchmark.currentScore - campusAverage) / campusAverage) * 100;
  const isAboveAverage = benchmark.vsAverage > 0.1;
  const isBelowAverage = benchmark.vsAverage < -0.1;
  
  const labelColors = {
    excellent: "bg-green-100 text-green-700 border-green-300",
    above_average: "bg-blue-100 text-blue-700 border-blue-300",
    average: "bg-gray-100 text-gray-700 border-gray-300",
    below_average: "bg-orange-100 text-orange-700 border-orange-300",
    needs_attention: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center justify-between">
        {/* Left: Rank & Service */}
        <div className="flex items-center gap-3 flex-1">
          {/* Rank */}
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
            {rank <= 3 && rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
          </div>
          
          {/* Service Name & Status */}
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{benchmark.serviceName}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${labelColors[benchmark.performanceLabel]} text-xs px-2 py-0`}>
                {benchmark.performanceLabel.replace("_", " ").toUpperCase()}
              </Badge>
              {benchmark.currentIssueCount > 0 && (
                <span className="text-xs text-red-600">
                  {benchmark.currentIssueCount} active issue{benchmark.currentIssueCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Score & Comparison */}
        <div className="flex items-center gap-6 mx-6">
          {/* Current Score */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {benchmark.currentScore.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Current</div>
          </div>

          {/* vs Average */}
          <div className="text-center">
            <div className={`text-lg font-bold flex items-center gap-1 ${
              isAboveAverage ? "text-green-600" : isBelowAverage ? "text-red-600" : "text-gray-600"
            }`}>
              {isAboveAverage ? (
                <TrendingUp className="w-4 h-4" />
              ) : isBelowAverage ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              {benchmark.vsAverage > 0 ? "+" : ""}{benchmark.vsAverage.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">vs Campus Avg</div>
          </div>

          {/* Percentile */}
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {benchmark.percentile}th
            </div>
            <div className="text-xs text-gray-500">Percentile</div>
          </div>
        </div>

        {/* Right: Trend */}
        <div className="text-right">
          <div className={`flex items-center gap-1 justify-end font-medium ${
            benchmark.trendVsLastPeriod > 0 ? "text-green-600" : 
            benchmark.trendVsLastPeriod < 0 ? "text-red-600" : "text-gray-600"
          }`}>
            {benchmark.trendVsLastPeriod > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : benchmark.trendVsLastPeriod < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            {benchmark.trendVsLastPeriod > 0 ? "+" : ""}
            {benchmark.trendVsLastPeriod.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">vs Last Period</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              benchmark.performanceLabel === "excellent" || benchmark.performanceLabel === "above_average" 
                ? "bg-green-500" 
                : benchmark.performanceLabel === "average"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${(benchmark.currentScore / 5) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.0</span>
          <span className="text-gray-400">Campus Avg: {campusAverage.toFixed(2)}</span>
          <span>5.0</span>
        </div>
      </div>
    </div>
  );
}
