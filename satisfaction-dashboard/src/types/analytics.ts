export interface MetricSummary {
  totalFeedback: number;
  avgSatisfaction: number;
  weeklyResponses: number;
  topServiceScore: number;
  totalFeedbackDelta: number;
  avgSatisfactionDelta: number;
  weeklyResponsesDelta: number;
}

export interface TrendPoint {
  date: string;
  score: number;
  count: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface ServiceSatisfaction {
  serviceId: string;
  serviceName: string;
  avgScore: number;
  totalFeedback: number;
  trend: "up" | "down" | "stable";
}

export interface AnalyticsDashboard {
  metrics: MetricSummary;
  trends: TrendPoint[];
  ratingDistribution: RatingDistribution[];
  serviceBreakdown: ServiceSatisfaction[];
}
