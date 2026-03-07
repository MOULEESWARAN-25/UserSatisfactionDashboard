"use client";

import { useState } from "react";
import { Bell, AlertTriangle, TrendingDown, Users, Clock, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import type { Alert, AlertType, AlertStatus, IssueSeverity } from "@/types/analytics";

interface AlertSystemProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
}

export function AlertSystem({ alerts, onAcknowledge, onDismiss, onResolve }: AlertSystemProps) {
  const [filter, setFilter] = useState<AlertStatus | "all">("active");

  const activeAlerts = alerts.filter(a => a.status === "active");
  const acknowledgedAlerts = alerts.filter(a => a.status === "acknowledged");
  const criticalAlerts = activeAlerts.filter(a => a.severity === "critical");

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => a.status === filter);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">Alerts & Notifications</h2>
              <p className="text-sm text-gray-600">
                {activeAlerts.length} active • {criticalAlerts.length} critical
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          {activeAlerts.length > 0 && (
            <Button size="sm" variant="outline">
              Acknowledge All
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <FilterBadge
            label="Active"
            count={activeAlerts.length}
            active={filter === "active"}
            onClick={() => setFilter("active")}
            variant="default"
          />
          <FilterBadge
            label="Acknowledged"
            count={acknowledgedAlerts.length}
            active={filter === "acknowledged"}
            onClick={() => setFilter("acknowledged")}
            variant="secondary"
          />
          <FilterBadge
            label="Resolved"
            count={alerts.filter(a => a.status === "resolved").length}
            active={filter === "resolved"}
            onClick={() => setFilter("resolved")}
            variant="success"
          />
          <FilterBadge
            label="All"
            count={alerts.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
            variant="outline"
          />
        </div>

        {/* Alert List */}
        <div className="space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No {filter === "all" ? "" : filter} alerts</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={onAcknowledge}
                onDismiss={onDismiss}
                onResolve={onResolve}
              />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function FilterBadge({
  label,
  count,
  active,
  onClick,
  variant,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  variant: "default" | "secondary" | "success" | "outline";
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label} ({count})
    </button>
  );
}

function AlertCard({
  alert,
  onAcknowledge,
  onDismiss,
  onResolve,
}: {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onResolve?: (id: string) => void;
}) {
  const alertTypeIcons: Record<AlertType, React.ElementType> = {
    satisfaction_drop: TrendingDown,
    critical_issue: AlertTriangle,
    low_participation: Users,
    deadline_missed: Clock,
    issue_escalated: AlertTriangle,
    service_degradation: TrendingDown,
    high_complaint_volume: AlertTriangle,
  };

  const severityColors: Record<IssueSeverity, string> = {
    critical: "border-l-red-500 bg-red-50",
    high: "border-l-orange-500 bg-orange-50",
    medium: "border-l-yellow-500 bg-yellow-50",
    low: "border-l-blue-500 bg-blue-50",
  };

  const Icon = alertTypeIcons[alert.type];

  return (
    <div
      className={`border-l-4 rounded-lg p-4 ${severityColors[alert.severity]} ${
        alert.status === "active" ? "bg-white" : "opacity-60"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3 flex-1">
          <div className="mt-1">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{alert.title}</h3>
              <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                {alert.severity}
              </Badge>
              {alert.status === "acknowledged" && (
                <Badge variant="outline" className="text-xs">
                  Acknowledged
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
            
            <div className="flex gap-4 text-xs text-gray-600">
              {alert.serviceName && (
                <span className="flex items-center gap-1">
                  📍 {alert.serviceName}
                </span>
              )}
              {alert.currentValue !== undefined && alert.thresholdValue !== undefined && (
                <span className="flex items-center gap-1">
                  Current: <strong>{alert.currentValue.toFixed(1)}</strong> / 
                  Threshold: {alert.thresholdValue.toFixed(1)}
                </span>
              )}
              <span>{formatTimeAgo(new Date(alert.createdAt))}</span>
            </div>

            {/* Recommended Actions */}
            {alert.recommendedActions && alert.recommendedActions.length > 0 && (
              <div className="mt-2 p-2 bg-white rounded text-xs">
                <p className="font-medium mb-1">Recommended Actions:</p>
                <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                  {alert.recommendedActions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          {alert.status === "active" && onAcknowledge && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAcknowledge(alert.id)}
              title="Acknowledge"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          {alert.status !== "resolved" && onResolve && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onResolve(alert.id)}
              title="Mark as Resolved"
            >
              ✓
            </Button>
          )}
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(alert.id)}
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
