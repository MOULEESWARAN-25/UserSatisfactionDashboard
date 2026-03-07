"use client";

import { Users, TrendingUp, TrendingDown, GraduationCap, Home, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SegmentedAnalytics, StudentSegment, StudentSegmentType } from "@/types/analytics";

interface StudentSegmentationWidgetProps {
  analytics: SegmentedAnalytics;
}

export function StudentSegmentationWidget({ analytics }: StudentSegmentationWidgetProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Student Segmentation Analytics
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Identify satisfaction patterns across different student groups
          </p>
        </div>

        {/* Key Insights */}
        {analytics.insights.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Key Insights</h3>
            <ul className="space-y-2">
              {analytics.insights.map((insight, idx) => (
                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">💡</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Segment Sections */}
        <div className="space-y-6">
          {/* By Year of Study */}
          {analytics.byYear.length > 0 && (
            <SegmentSection
              title="By Year of Study"
              icon={GraduationCap}
              segments={analytics.byYear}
            />
          )}

          {/* By Department */}
          {analytics.byDepartment.length > 0 && (
            <SegmentSection
              title="By Department"
              icon={Briefcase}
              segments={analytics.byDepartment}
            />
          )}

          {/* By Residence */}
          {analytics.byResidence.length > 0 && (
            <SegmentSection
              title="By Residence Type"
              icon={Home}
              segments={analytics.byResidence}
            />
          )}

          {/* By Program */}
          {analytics.byProgram.length > 0 && (
            <SegmentSection
              title="By Program Type"
              icon={GraduationCap}
              segments={analytics.byProgram}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

function SegmentSection({
  title,
  icon: Icon,
  segments,
}: {
  title: string;
  icon: React.ElementType;
  segments: StudentSegment[];
}) {
  // Sort by satisfaction (lowest first to highlight issues)
  const sortedSegments = [...segments].sort((a, b) => a.avgSatisfaction - b.avgSatisfaction);
  const avgSatisfaction = segments.reduce((sum, s) => sum + s.avgSatisfaction, 0) / segments.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Icon className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-gray-500 ml-auto">
          Avg: {avgSatisfaction.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedSegments.map((segment) => (
          <SegmentCard key={segment.segmentValue} segment={segment} average={avgSatisfaction} />
        ))}
      </div>
    </div>
  );
}

function SegmentCard({ segment, average }: { segment: StudentSegment; average: number }) {
  const isAboveAverage = segment.avgSatisfaction > average;
  const diff = segment.avgSatisfaction - average;
  const diffPercent = (diff / average) * 100;

  const satisfactionColor = 
    segment.avgSatisfaction >= 4.0 ? "text-green-600" :
    segment.avgSatisfaction >= 3.5 ? "text-blue-600" :
    segment.avgSatisfaction >= 3.0 ? "text-yellow-600" :
    "text-red-600";

  const participationColor =
    segment.participationRate >= 50 ? "text-green-600" :
    segment.participationRate >= 30 ? "text-yellow-600" :
    "text-red-600";

  return (
    <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{segment.segmentLabel}</h4>
          <div className="text-xs text-gray-500 mt-1">
            {segment.totalStudents} students • {segment.totalResponses} responses
          </div>
        </div>
        
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isAboveAverage ? "text-green-600" : "text-red-600"
        }`}>
          {isAboveAverage ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(diffPercent).toFixed(0)}%
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Satisfaction */}
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className={`text-xl font-bold ${satisfactionColor}`}>
            {segment.avgSatisfaction.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Satisfaction</div>
        </div>

        {/* Participation */}
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className={`text-xl font-bold ${participationColor}`}>
            {segment.participationRate.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">Participation</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t text-xs space-y-1">
        {segment.topService && (
          <div className="flex justify-between">
            <span className="text-gray-600">Top Service:</span>
            <span className="font-medium">{segment.topService}</span>
          </div>
        )}
        {segment.topIssue && (
          <div className="flex justify-between">
            <span className="text-gray-600">Top Issue:</span>
            <span className="font-medium text-orange-600">{segment.topIssue}</span>
          </div>
        )}
      </div>

      {/* Alert if significantly below average */}
      {diff < -0.3 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          ⚠️ Significantly below average - needs attention
        </div>
      )}
    </div>
  );
}
