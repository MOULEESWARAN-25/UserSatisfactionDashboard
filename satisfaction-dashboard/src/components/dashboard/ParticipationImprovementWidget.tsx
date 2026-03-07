"use client";

import { Users, TrendingUp, Target, Lightbulb, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ParticipationInsight, ParticipationStrategy } from "@/types/analytics";

interface ParticipationImprovementWidgetProps {
  insights: ParticipationInsight[];
  strategies?: ParticipationStrategy[];
  onImplementStrategy?: (insightType: string) => void;
}

export function ParticipationImprovementWidget({ 
  insights, 
  strategies = [],
  onImplementStrategy 
}: ParticipationImprovementWidgetProps) {
  const activeStrategies = strategies.filter(s => !s.endDate);
  const successfulStrategies = strategies.filter(s => s.isSuccessful);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participation Improvement
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Identify low participation areas and take action
          </p>
        </div>

        {/* Strategy Stats */}
        {strategies.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{activeStrategies.length}</div>
              <div className="text-xs font-medium text-blue-600 mt-1">Active Strategies</div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{successfulStrategies.length}</div>
              <div className="text-xs font-medium text-green-600 mt-1">Successful</div>
            </div>
            
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">
                {successfulStrategies.length > 0 
                  ? (successfulStrategies.reduce((sum, s) => 
                      sum + ((s.currentParticipation || s.targetParticipation) - s.baselineParticipation), 0
                    ) / successfulStrategies.length).toFixed(0)
                  : "0"}%
              </div>
              <div className="text-xs font-medium text-purple-600 mt-1">Avg Lift</div>
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Identified Issues
          </h3>
          
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No participation issues detected</p>
              <p className="text-sm mt-1">All services have healthy response rates</p>
            </div>
          ) : (
            insights
              .sort((a, b) => {
                // Sort by severity (high first) then gap (largest first)
                const severityOrder = { high: 3, medium: 2, low: 1 };
                if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                  return severityOrder[b.severity] - severityOrder[a.severity];
                }
                return b.gap - a.gap;
              })
              .map((insight) => (
                <InsightCard 
                  key={`${insight.type}-${insight.affectedService || "all"}`} 
                  insight={insight}
                  onImplement={onImplementStrategy}
                />
              ))
          )}
        </div>

        {/* Active Strategies */}
        {activeStrategies.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Active Strategies
            </h3>
            
            {activeStrategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function InsightCard({ 
  insight,
  onImplement 
}: { 
  insight: ParticipationInsight;
  onImplement?: (insightType: string) => void;
}) {
  const severityColors = {
    high: "border-red-300 bg-red-50",
    medium: "border-yellow-300 bg-yellow-50",
    low: "border-blue-300 bg-blue-50",
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    implemented: "bg-green-100 text-green-700",
    monitoring: "bg-purple-100 text-purple-700",
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 ${severityColors[insight.severity]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4" />
            <h4 className="font-semibold">{insight.title}</h4>
            <Badge className={`${statusColors[insight.status]} text-xs`}>
              {insight.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge variant={insight.severity === "high" ? "destructive" : "secondary"} className="text-xs">
              {insight.severity.toUpperCase()}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
          
          {/* Metrics */}
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current:</span>
              <span className="font-bold ml-1 text-red-600">{insight.currentRate.toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Target:</span>
              <span className="font-bold ml-1 text-green-600">{insight.targetRate.toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Gap:</span>
              <span className="font-bold ml-1 text-orange-600">{insight.gap.toFixed(0)}%</span>
            </div>
          </div>
{insight.affectedService && (
            <div className="text-xs text-gray-600 mt-1">
              📍 {insight.affectedService}
            </div>
          )}
          {insight.affectedSegment && (
            <div className="text-xs text-gray-600 mt-1">
              👥 Segment: {insight.affectedSegment}
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {insight.recommendations.length > 0 && (
        <div className="mt-3 p-3 bg-white rounded space-y-2">
          <h5 className="text-xs font-semibold text-gray-700 mb-2">Recommended Actions:</h5>
          {insight.recommendations
            .sort((a, b) => b.priority - a.priority)
            .map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{rec.action}</span>
                    <Badge variant="outline" className="text-xs">
                      {rec.effort} effort
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Expected: {rec.expectedImpact}
                  </div>
                </div>
                {insight.status === "new" && onImplement && (
                  <Button size="sm" variant="secondary" onClick={() => onImplement(insight.type)}>
                    Implement
                  </Button>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Result Metrics (if implemented) */}
      {insight.resultMetrics && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <h5 className="text-xs font-semibold text-green-800 mb-2">Results:</h5>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-600">Before:</span>
              <span className="font-bold ml-1">{insight.resultMetrics.beforeRate.toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-gray-600">After:</span>
              <span className="font-bold ml-1 text-green-600">{insight.resultMetrics.afterRate.toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Improvement:</span>
              <span className="font-bold ml-1 text-green-600">
                +{insight.resultMetrics.improvement.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: ParticipationStrategy }) {
  const progress = strategy.currentParticipation 
    ? ((strategy.currentParticipation - strategy.baselineParticipation) / 
       (strategy.targetParticipation - strategy.baselineParticipation)) * 100
    : 0;

  const isOnTrack = progress >= 50;

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{strategy.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
          
          {strategy.targetedService && (
            <div className="text-xs text-gray-600">📍 {strategy.targetedService}</div>
          )}
          {strategy.targetedSegment && (
            <div className="text-xs text-gray-600">👥 {strategy.targetedSegment}</div>
          )}
        </div>
        
        <Badge variant={isOnTrack ? "success" : "secondary"}>
          {isOnTrack ? "On Track" : "In Progress"}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress to Target</span>
          <span className="font-medium">{Math.min(100, progress).toFixed(0)}%</span>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${isOnTrack ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          <span>Baseline: {strategy.baselineParticipation.toFixed(0)}%</span>
          {strategy.currentParticipation && (
            <span>Current: {strategy.currentParticipation.toFixed(0)}%</span>
          )}
          <span>Target: {strategy.targetParticipation.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
