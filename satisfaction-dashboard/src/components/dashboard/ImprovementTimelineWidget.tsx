"use client";

import { CheckCircle2, Clock, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { ImprovementTimeline, ImprovementPhase, ImprovementMilestone } from "@/types/analytics";

interface ImprovementTimelineWidgetProps {
  timelines: ImprovementTimeline[];
  showAll?: boolean;
}

export function ImprovementTimelineWidget({ timelines, showAll = false }: ImprovementTimelineWidgetProps) {
  // Show successful improvements by default, or all if showAll is true
  const displayTimelines = showAll 
    ? timelines 
    : timelines.filter(t => t.isSuccessful).slice(0, 5);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Improvement Timeline
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track problem detection through resolution and verification
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {timelines.filter(t => t.isSuccessful).length}
            </div>
            <div className="text-xs font-medium text-green-600 mt-1">
              Successful Improvements
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {timelines.filter(t => t.currentPhase !== "verified" && t.currentPhase !== "closed").length}
            </div>
            <div className="text-xs font-medium text-blue-600 mt-1">
              In Progress
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">
              {(timelines.reduce((sum, t) => sum + (t.improvementPercent || 0), 0) / timelines.length).toFixed(0)}%
            </div>
            <div className="text-xs font-medium text-purple-600 mt-1">
              Avg Improvement
            </div>
          </div>
        </div>

        {/* Timeline Cards */}
        <div className="space-y-4">
          {displayTimelines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No improvement timelines yet</p>
            </div>
          ) : (
            displayTimelines.map((timeline) => (
              <TimelineCard key={timeline.issueId} timeline={timeline} />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function TimelineCard({ timeline }: { timeline: ImprovementTimeline }) {
  const phases: ImprovementPhase[] = ["detected", "investigating", "implementing", "measuring", "verified", "closed"];
  
  const currentPhaseIndex = phases.indexOf(timeline.currentPhase);
  const completedMilestones = timeline.milestones.filter(m => m.completedAt);
  const progressPercent = (completedMilestones.length / phases.length) * 100;

  const improvementPercent = timeline.improvementPercent || 0;
  const isSuccessful = timeline.isSuccessful;

  return (
    <div className={`border rounded-lg overflow-hidden ${
      isSuccessful ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
    }`}>
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{timeline.issueTitle}</h3>
              {isSuccessful && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              )}
              {!isSuccessful && timeline.currentPhase !== "closed" && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {timeline.currentPhase.replace("_", " ").toUpperCase()}
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              📍 {timeline.serviceName}
            </div>
          </div>

          {/* Impact Metrics */}
          {timeline.finalMetrics && (
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                improvementPercent > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {improvementPercent > 0 ? "+" : ""}{improvementPercent.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Improvement</div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-medium text-gray-900">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              isSuccessful ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="p-4">
        <div className="space-y-3">
          {phases.map((phase, index) => {
            const milestone = timeline.milestones.find(m => m.phase === phase);
            const isCompleted = !!milestone?.completedAt;
            const isCurrent = index === currentPhaseIndex;
            
            return (
              <PhaseRow
                key={phase}
                phase={phase}
                milestone={milestone}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
              />
            );
          })}
        </div>
      </div>

      {/* Before/After Comparison */}
      {timeline.finalMetrics && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Satisfaction */}
            <div>
              <div className="text-xs text-gray-600 mb-1">Satisfaction</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-red-600">
                  {timeline.initialMetrics.satisfactionScore.toFixed(1)}
                </span>
                <span className="text-gray-400">→</span>
                <span className="text-sm font-semibold text-green-600">
                  {timeline.finalMetrics.satisfactionScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Complaints */}
            <div>
              <div className="text-xs text-gray-600 mb-1">Complaints</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-red-600">
                  {timeline.initialMetrics.complaintCount}
                </span>
                <span className="text-gray-400">→</span>
                <span className="text-sm font-semibold text-green-600">
                  {timeline.finalMetrics.complaintCount}
                </span>
              </div>
            </div>

            {/* Participation */}
            <div>
              <div className="text-xs text-gray-600 mb-1">Participation</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-gray-600">
                  {timeline.initialMetrics.participationRate.toFixed(0)}%
                </span>
                <span className="text-gray-400">→</span>
                <span className="text-sm font-semibold text-blue-600">
                  {timeline.finalMetrics.participationRate.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solution & Lessons */}
      {timeline.solutionImplemented && (
        <div className="p-4 border-t">
          <div className="space-y-2">
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Solution Implemented:</h4>
              <p className="text-sm text-gray-600">{timeline.solutionImplemented}</p>
            </div>
            
            {timeline.lessonsLearned && timeline.lessonsLearned.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Lessons Learned:</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-0.5">
                  {timeline.lessonsLearned.map((lesson, idx) => (
                    <li key={idx}>{lesson}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseRow({
  phase,
  milestone,
  isCompleted,
  isCurrent,
}: {
  phase: ImprovementPhase;
  milestone?: ImprovementMilestone;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  const phaseLabels: Record<ImprovementPhase, string> = {
    detected: "Issue Detected",
    investigating: "Root Cause Investigation",
    implementing: "Solution Implementation",
    measuring: "Impact Measurement",
    verified: "Improvement Verified",
    closed: "Issue Closed",
  };

  return (
    <div className={`flex items-start gap-3 ${isCompleted ? "opacity-100" : "opacity-50"}`}>
      {/* Status Icon */}
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        isCompleted ? "bg-green-500 text-white" : 
        isCurrent ? "bg-blue-500 text-white" : 
        "bg-gray-300 text-gray-600"
      }`}>
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : isCurrent ? (
          <Clock className="w-4 h-4" />
        ) : (
          <span className="text-xs">○</span>
        )}
      </div>

      {/* Phase Info */}
      <div className="flex-1">
        <div className="font-medium text-sm">{phaseLabels[phase]}</div>
        {milestone?.completedAt && (
          <div className="text-xs text-gray-500 mt-0.5">
            {formatDate(new Date(milestone.completedAt))}
            {milestone.completedBy && ` by ${milestone.completedBy}`}
          </div>
        )}
        {milestone?.notes && (
          <div className="text-xs text-gray-600 mt-1 italic">
            "{milestone.notes}"
          </div>
        )}
      </div>
    </div>
  );
}
