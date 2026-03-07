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

// Advanced Analytics Types
export interface PeakHour {
  hour: number;
  label: string;
  count: number;
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface MonthlyComparison {
  month: string;
  thisYear: number;
  lastYear: number;
}

export interface QuestionRating {
  questionId: string;
  questionLabel: string;
  avgRating: number;
  responseCount: number;
}

export interface ServiceDetailedAnalytics {
  serviceId: string;
  serviceName: string;
  responseRate: number;
  avgResponseTime: number;
  questionRatings: QuestionRating[];
}

export interface AdvancedAnalytics {
  peakHours: PeakHour[];
  sentiment: SentimentBreakdown;
  monthlyComparison: MonthlyComparison[];
  serviceDetails: ServiceDetailedAnalytics[];
  topIssues: string[];
  improvementAreas: { area: string; score: number; change: number }[];
}
