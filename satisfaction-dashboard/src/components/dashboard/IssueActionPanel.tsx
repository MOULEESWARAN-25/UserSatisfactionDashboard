"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ManagedIssue, IssueStatus, IssueSeverity } from "@/types/analytics";

interface IssueActionPanelProps {
  issues: ManagedIssue[];
  onAssignIssue?: (issueId: string, assigneeId: string) => void;
  onUpdateStatus?: (issueId: string, status: IssueStatus) => void;
  onEscalate?: (issueId: string) => void;
  onResolve?: (issueId: string, solution: string) => void;
  onAddComment?: (issueId: string, comment: string) => void;
}

export function IssueActionPanel({ 
  issues, 
  onAssignIssue,
  onUpdateStatus,
  onEscalate,
  onResolve,
  onAddComment 
}: IssueActionPanelProps) {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | IssueStatus>("all");

  const filteredIssues = filter === "all" 
    ? issues 
    : issues.filter(i => i.status === filter);

  const criticalCount = issues.filter(i => i.severity === "critical").length;
  const overdueCount = issues.filter(i => i.isOverdue).length;
  const openCount = issues.filter(i => i.status === "open").length;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Issue Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track and resolve service issues with full accountability
            </p>
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                {criticalCount} Critical
              </Badge>
            )}
            {overdueCount > 0 && (
              <Badge variant="warning" className="gap-1">
                <Clock className="w-3 h-3" />
                {overdueCount} Overdue
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            label="Open Issues" 
            value={openCount} 
            color="blue"
            icon={AlertCircle}
          />
          <StatCard 
            label="In Progress" 
            value={issues.filter(i => i.status === "in_progress").length} 
            color="yellow"
            icon={Clock}
          />
          <StatCard 
            label="Resolved" 
            value={issues.filter(i => i.status === "resolved").length} 
            color="green"
            icon={CheckCircle2}
          />
          <StatCard 
            label="Overdue" 
            value={overdueCount} 
            color="red"
            icon={AlertTriangle}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <FilterButton 
            active={filter === "all"} 
            onClick={() => setFilter("all")}
          >
            All ({issues.length})
          </FilterButton>
          <FilterButton 
            active={filter === "open"} 
            onClick={() => setFilter("open")}
          >
            Open ({openCount})
          </FilterButton>
          <FilterButton 
            active={filter === "in_progress"} 
            onClick={() => setFilter("in_progress")}
          >
            In Progress ({issues.filter(i => i.status === "in_progress").length})
          </FilterButton>
          <FilterButton 
            active={filter === "investigating"} 
            onClick={() => setFilter("investigating")}
          >
            Investigating ({issues.filter(i => i.status === "investigating").length})
          </FilterButton>
          <FilterButton 
            active={filter === "resolved"} 
            onClick={() => setFilter("resolved")}
          >
            Resolved ({issues.filter(i => i.status === "resolved").length})
          </FilterButton>
        </div>

        {/* Issue List */}
        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No {filter === "all" ? "" : filter} issues</p>
              <p className="text-sm">All systems operating normally</p>
            </div>
          ) : (
            filteredIssues
              .sort((a, b) => {
                // Sort by priority (overdue first, then by priority score)
                if (a.isOverdue && !b.isOverdue) return -1;
                if (!a.isOverdue && b.isOverdue) return 1;
                return b.priority - a.priority;
              })
              .map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue}
                  isExpanded={selectedIssue === issue.id}
                  onToggle={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                  onAssign={onAssignIssue}
                  onUpdateStatus={onUpdateStatus}
                  onEscalate={onEscalate}
                  onResolve={onResolve}
                  onAddComment={onAddComment}
                />
              ))
          )}
        </div>
      </div>
    </Card>
  );
}

function StatCard({ 
  label, 
  value, 
  color,
  icon: Icon 
}: { 
  label: string; 
  value: number; 
  color: "blue" | "yellow" | "green" | "red";
  icon: React.ElementType;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs font-medium mt-1">{label}</div>
        </div>
        <Icon className="w-8 h-8 opacity-60" />
      </div>
    </div>
  );
}

function FilterButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function IssueCard({ 
  issue,
  isExpanded,
  onToggle,
  onAssign,
  onUpdateStatus,
  onEscalate,
  onResolve,
  onAddComment
}: { 
  issue: ManagedIssue;
  isExpanded: boolean;
  onToggle: () => void;
  onAssign?: (issueId: string, assigneeId: string) => void;
  onUpdateStatus?: (issueId: string, status: IssueStatus) => void;
  onEscalate?: (issueId: string) => void;
  onResolve?: (issueId: string, solution: string) => void;
  onAddComment?: (issueId: string, comment: string) => void;
}) {
  const severityColors: Record<IssueSeverity, string> = {
    critical: "bg-red-100 text-red-700 border-red-300",
    high: "bg-orange-100 text-orange-700 border-orange-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    low: "bg-blue-100 text-blue-700 border-blue-300",
  };

  const statusIcons: Record<IssueStatus, React.ElementType> = {
    open: AlertCircle,
    investigating: Clock,
    in_progress: Clock,
    resolved: CheckCircle2,
    closed: CheckCircle2,
    escalated: ArrowUpCircle,
  };

  const StatusIcon = statusIcons[issue.status];

  return (
    <div 
      className={`border rounded-lg transition-all ${
        issue.isOverdue ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
      } ${isExpanded ? "shadow-lg" : "hover:shadow-md"}`}
    >
      {/* Issue Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${severityColors[issue.severity]} text-xs`}>
                {issue.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Priority: {issue.priority}/10
              </Badge>
              {issue.isOverdue && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <Clock className="w-3 h-3" />
                  OVERDUE
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs gap-1">
                <StatusIcon className="w-3 h-3" />
                {issue.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
            
            <div className="flex flexitems-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                📍 {issue.serviceName}
              </span>
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                {issue.currentValue.toFixed(1)} (↓ {Math.abs(issue.changePercent).toFixed(0)}%)
              </span>
              {issue.assignment && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {issue.assignedToName}
                </span>
              )}
              {issue.relatedFeedbackCount > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {issue.relatedFeedbackCount} complaints
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {issue.daysSinceDetection}d ago
              </span>
            </div>
          </div>
          
          <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t p-4 space-y-4 bg-gray-50">
          {/* Assignment Details */}
          {issue.assignment && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-sm mb-2">Assignment Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="font-medium">{issue.assignment.assignedTo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span>{issue.assignment.assignedTo.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span>{issue.assignment.assignedTo.departmentName}</span>
                </div>
                {issue.assignment.expectedResolutionDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected resolution:</span>
                    <span className="font-medium">
                      {formatDate(new Date(issue.assignment.expectedResolutionDate))}
                    </span>
                  </div>
                )}
                {issue.assignment.notes && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-gray-600 text-xs">{issue.assignment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Root Cause Analysis */}
          {issue.rootCauseAnalysis && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-sm mb-2">Root Cause Analysis</h4>
              <p className="text-sm mb-2">{issue.rootCauseAnalysis.rootCause}</p>
              {issue.rootCauseAnalysis.contributingFactors.length > 0 && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Contributing factors:</span>
                  <ul className="list-disc list-inside mt-1">
                    {issue.rootCauseAnalysis.contributingFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Resolution Details */}
          {issue.resolution && (
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <h4 className="font-semibold text-sm mb-2 text-green-800">Resolution</h4>
              <p className="text-sm mb-2">{issue.resolution.resolutionNotes}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Before:</span>
                  <span className="font-bold ml-2 text-red-600">
                    {issue.resolution.satisfactionBefore.toFixed(1)}
                  </span>
                </div>
                {issue.resolution.satisfactionAfter && (
                  <div>
                    <span className="text-gray-600">After:</span>
                    <span className="font-bold ml-2 text-green-600">
                      {issue.resolution.satisfactionAfter.toFixed(1)}
                    </span>
                    {issue.resolution.improvementPercent && (
                      <span className="text-xs ml-1">
                        (+{issue.resolution.improvementPercent.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Comments */}
          {issue.comments && issue.comments.length > 0 && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-sm mb-2">Recent Updates</h4>
              <div className="space-y-2">
                {issue.comments.slice(-3).map((comment) => (
                  <div key={comment.id} className="text-sm border-l-2 border-blue-500 pl-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(comment.timestamp))}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {issue.status !== "resolved" && issue.status !== "closed" && (
              <>
                <Button size="sm" variant="default">
                  Update Status
                </Button>
                <Button size="sm" variant="outline">
                  Add Comment
                </Button>
                {!issue.assignment && (
                  <Button size="sm" variant="secondary">
                    Assign
                  </Button>
                )}
                {issue.daysSinceDetection > 7 && (
                  <Button size="sm" variant="destructive">
                    <ArrowUpCircle className="w-4 h-4 mr-1" />
                    Escalate
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
