// ==================== SAAS FOUNDATION TYPES ====================

// Multi-Tenancy: College/Institution
export interface College {
  id: string; // collegeId
  name: string;
  domain: string; // subdomain or custom domain
  logo?: string;
  primaryColor?: string;
  address?: string;
  contactEmail: string;
  contactPhone?: string;
  settings: CollegeSettings;
  subscription: SubscriptionTier;
  createdAt: string;
  status: "active" | "suspended" | "trial";
}

export interface CollegeSettings {
  enableAIInsights: boolean;
  enableNotifications: boolean;
  submissionLimit: number; // submissions per student per week
  requireDemographics: boolean;
  customServices: string[]; // Service IDs configured for this college
  customQuestions: string[]; // Question IDs configured
  notificationThresholds: {
    criticalIssueScore: number; // e.g., satisfaction below 2.0
    lowParticipation: number; // e.g., below 30%
  };
}

export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface SubscriptionLimits {
  tier: SubscriptionTier;
  maxAdmins: number;
  maxServices: number;
  maxFeedbackPerMonth: number;
  aiInsightsEnabled: boolean;
  automatedReportsEnabled: boolean;
  apiAccessEnabled: boolean;
}

// Role-Based Access Control
export type UserRole = "platform_admin" | "college_admin" | "department_manager" | "viewer" | "student";

export interface RolePermissions {
  role: UserRole;
  canViewDashboard: boolean;
  canViewAnalytics: boolean;
  canManageIssues: boolean;
  canConfigureServices: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canAccessAI: boolean;
  canManageNotifications: boolean;
}

// Notification System
export type NotificationType = "issue_detected" | "issue_resolved" | "satisfaction_drop" | "low_participation" | "weekly_summary" | "system_alert";
export type NotificationPriority = "urgent" | "high" | "normal" | "low";
export type NotificationStatus = "unread" | "read" | "archived";

export interface Notification {
  id: string;
  collegeId: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  metadata?: {
    issueId?: string;
    serviceId?: string;
    serviceName?: string;
    currentValue?: number;
    threshold?: number;
  };
  recipients: string[]; // User IDs or emails
  createdAt: string;
  readAt?: string;
  actionUrl?: string; // Deep link to relevant dashboard section
}

export interface NotificationSettings {
  userId: string;
  collegeId: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    [key in NotificationType]: boolean;
  };
  digestFrequency: "instant" | "daily" | "weekly" | "never";
}

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
  collegeId?: string; // Multi-tenant support
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

// Issue Detection & Alerts
export type IssueSeverity = "critical" | "high" | "medium" | "low";
export type IssueStatus = "open" | "investigating" | "in_progress" | "resolved" | "closed" | "escalated";
export type IssueCategory = "service_quality" | "infrastructure" | "staff" | "accessibility" | "other";

// Staff Member for Assignment
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string;
  departmentName: string;
  avatar?: string;
  isActive: boolean;
}

// Issue Action Assignment
export interface IssueAssignment {
  assignedTo: StaffMember;
  assignedBy: string; // Admin user ID
  assignedAt: string;
  expectedResolutionDate?: string;
  estimatedDays?: number;
  notes?: string;
}

// Resolution Verification
export interface ResolutionVerification {
  resolvedAt: string;
  resolvedBy: string; // Staff member ID
  resolutionNotes: string;
  satisfactionBefore: number;
  satisfactionAfter?: number; // Updated after re-measurement period
  verificationPeriodDays: number; // How long to measure improvement (default: 7)
  isVerified: boolean; // True after verification period shows improvement
  verifiedAt?: string;
  improvementPercent?: number;
}

// Issue Escalation
export interface IssueEscalation {
  escalatedAt: string;
  escalatedBy: string;
  escalationReason: "deadline_missed" | "no_progress" | "severity_increase" | "manual";
  escalatedTo: string; // Higher authority staff ID
  previousAssignee?: string;
  notes: string;
}

// Root Cause Analysis
export interface RootCauseAnalysis {
  identifiedAt: string;
  rootCause: string;
  contributingFactors: string[];
  affectedServices: string[];
  relatedComplaints: string[]; // Common phrases/keywords
  confidence: number; // 0-100, AI confidence in root cause
  aiGenerated: boolean;
}

// Issue Timeline Event
export type IssueEventType = "created" | "assigned" | "status_changed" | "escalated" | "resolved" | "verified" | "comment_added";

export interface IssueTimelineEvent {
  id: string;
  eventType: IssueEventType;
  timestamp: string;
  userId: string;
  userName: string;
  description: string;
  metadata?: Record<string, any>;
}

// Enhanced Issue with Operational Features
export interface DetectedIssue {
  id: string;
  title: string;
  description: string;
  serviceId: string;
  serviceName: string;
  servicesAffected: string[]; // Multiple services can be affected
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  detectedAt: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  priority: number; // 1-10, higher = more urgent
  collegeId?: string; // Multi-tenant support
  
  // Operational Features
  assignment?: IssueAssignment;
  resolution?: ResolutionVerification;
  escalation?: IssueEscalation;
  rootCauseAnalysis?: RootCauseAnalysis;
  timeline: IssueTimelineEvent[];
  
  // Metrics
  affectedStudentCount?: number;
  relatedFeedbackCount: number;
  daysSinceDetection: number;
  isOverdue: boolean;
  
  // Comments/Updates
  comments: IssueComment[];
}

export interface IssueComment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  timestamp: string;
  isInternal: boolean; // Internal staff notes vs public updates
}

// Department Accountability
export interface Department {
  id: string;
  name: string;
  serviceIds: string[];
}

export interface DepartmentPerformance {
  departmentId: string;
  departmentName: string;
  avgScore: number;
  totalFeedback: number;
  trend: "up" | "down" | "stable";
  serviceCounts: number;
}

// Participation Metrics
export interface ParticipationMetrics {
  totalStudents: number;
  totalResponses: number;
  participationRate: number; // percentage
  uniqueRespondents: number;
  averageResponsesPerStudent: number;
}

// Top Complaints
export interface ComplaintSummary {
  issue: string;
  count: number;
  services: string[];
  severity: IssueSeverity;
  trend: "increasing" | "stable" | "decreasing";
}

// Service Ranking
export interface ServiceRanking {
  rank: number;
  serviceId: string;
  serviceName: string;
  score: number;
  change: number; // vs previous period
  trend: "up" | "down" | "stable";
  departmentName: string;
}

// Enhanced Dashboard with new metrics
export interface EnhancedDashboard extends AnalyticsDashboard {
  detectedIssues: DetectedIssue[];
  serviceRankings: ServiceRanking[];
  participation: ParticipationMetrics;
  topComplaints: ComplaintSummary[];
  departmentPerformance: DepartmentPerformance[];
  // Operational features
  managedIssues?: ManagedIssue[];
  historicalComparison?: HistoricalComparison | null;
  serviceHealth?: ServiceHealth[];
  participationByService?: ServiceParticipation[];
  aiInsights?: AIInsight[];
  weeklySummary?: WeeklySummary | null;
  studentVoice?: AggregatedStudentVoice | null;
}

// ==================== NEW OPERATIONAL FEATURES ====================

// Issue Action Tracking & Resolution Workflow
export interface IssueAction {
  id: string;
  issueId: string;
  action: string;
  takenBy: string;
  takenByRole?: string; // e.g., "College Admin", "Department Manager"
  timestamp: string;
  notes?: string;
  actionType?: "comment" | "status_change" | "assignment" | "resolution"; // Type of action
}

export interface ManagedIssue extends DetectedIssue {
  assignedToName: string; // Specific person, not just department
  assignedToEmail?: string;
  assignedToRole?: string; // e.g., "Library Manager", "Hostel Supervisor"
  
  // SLA Management
  expectedResolution?: string; // Date string - SLA deadline
  slaStatus?: "on-time" | "at-risk" | "overdue"; // Calculated based on expectedResolution
  slaHoursRemaining?: number; // Hours until deadline
  
  // Action tracking
  actions: IssueAction[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Service owner reference (links to ServiceOwner)
  serviceOwnerId?: string;
  
  // Improvement verification
  improvementVerified?: boolean;
  verificationDetails?: {
    beforeScore: number;
    afterScore: number;
    improvementPercent: number;
    verifiedAt: string;
    verifiedBy: string;
  };
}

// Historical Comparison
export interface HistoricalPeriod {
  label: string;
  startDate: string;
  endDate: string;
  avgSatisfaction: number;
  totalFeedback: number;
  topIssue?: string;
}

export interface HistoricalComparison {
  currentPeriod: HistoricalPeriod;
  previousPeriod: HistoricalPeriod;
  changePercent: number;
  trend: "improving" | "declining" | "stable";
  insights: string[];
  significantChanges?: {
    service: string;
    currentValue: number;
    previousValue: number;
    changePercent: number;
    changeDirection: "improvement" | "decline" | "stable";
  }[];
}

export interface ServiceHistoricalData {
  serviceId: string;
  serviceName: string;
  periods: HistoricalPeriod[];
  overallTrend: "improving" | "declining" | "stable";
}

// Service Health Indicator
export type ServiceHealthStatus = "excellent" | "good" | "warning" | "critical";

export interface ServiceHealth {
  serviceId: string;
  serviceName: string;
  collegeId?: string; // Multi-tenant support
  status: ServiceHealthStatus;
  score: number;
  participationRate: number;
  issueCount: number;
  trend: "up" | "down" | "stable";
  message: string; // e.g., "All metrics performing well"
  ownerId?: string; // Reference to ServiceOwner
  lastUpdated?: string;
}

// Participation by Service
export interface ServiceParticipation {
  serviceId: string;
  serviceName: string;
  collegeId?: string; // Multi-tenant support
  totalResponses: number;
  expectedResponses: number; // Based on enrolled students
  participationRate: number; // percentage
  trend: "increasing" | "decreasing" | "stable";
  reliability: "high" | "medium" | "low"; // Based on sample size
  lastResponseDate?: string;
}

// Service Ownership
export interface ServiceOwner {
  id: string; // Service owner ID
  serviceId: string;
  serviceName: string;
  departmentName: string;
  ownerName: string;
  ownerTitle: string;
  ownerEmail?: string;
  ownerPhone?: string;
  collegeId: string; // Multi-tenant support
  
  // Performance metrics
  assignedIssues?: number;
  resolvedIssues?: number;
  avgResolutionTime?: number; // in hours
  serviceHealthScore?: number;
}

// Improvement Tracking
export interface Improvement {
  id: string;
  issueId: string;
  issueName: string;
  serviceId: string;
  serviceName: string;
  collegeId: string; // Multi-tenant support
  implementedAt: string;
  implementedBy: string;
  description: string;
  beforeScore: number;
  afterScore: number;
  improvement: number; // percentage
  status: "measuring" | "confirmed" | "failed";
  measurementPeriod: number; // days after implementation to measure
  measurementEndDate?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

// AI-Generated Insights
export interface AIInsight {
  id: string;
  collegeId: string; // Multi-tenant support
  type: "trend" | "anomaly" | "recommendation" | "summary";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  affectedServices: string[];
  generatedAt: string;
  confidence: number; // 0-1
  actionable: boolean;
  suggestedAction?: string;
  status?: "new" | "acknowledged" | "acted_upon" | "dismissed"; // Track admin response
}

// Weekly Summary
export interface WeeklySummary {
  id: string;
  collegeId: string; // Multi-tenant support
  weekStart: string;
  weekEnd: string;
  totalFeedback: number;
  avgSatisfaction: number;
  satisfactionChange: number; // vs previous week
  lowestService: {
    name: string;
    score: number;
  };
  highestService: {
    name: string;
    score: number;
  };
  topComplaint: string;
  newIssues: number;
  resolvedIssues: number;
  participationRate: number;
  trend: "improving" | "declining" | "stable";
  keyInsights: string[];
  recommendations: string[];
  generatedAt: string;
  generatedBy: "ai" | "system";
  emailedTo?: string[]; // Track who received the summary
}

// Student Voice / Actual Comments
export interface StudentVoice {
  serviceId: string;
  serviceName: string;
  representativeComments: {
    comment: string;
    sentiment: "positive" | "neutral" | "negative";
    votes: number; // How many students mentioned similar
    submittedAt: string;
  }[];
  commonPhrases: string[]; // e.g., ["too long", "poor quality"]
}

// Aggregated Student Voice (for dashboard overview widget)
export interface AggregatedStudentVoice {
  representativeComments: {
    text: string;
    service: string;
    sentiment: "positive" | "neutral" | "negative";
    rating: number;
    date: Date;
  }[];
  commonPhrases: string[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

// Participation Trend Over Time
export interface ParticipationTrend {
  period: string; // "Week 1", "Week 2", etc.
  date: string;
  participationRate: number;
  totalResponses: number;
  uniqueRespondents: number;
}

// ==================== STUDENT SEGMENTATION ====================

export type StudentSegmentType = "year" | "department" | "residence" | "program";

export interface StudentSegment {
  segmentType: StudentSegmentType;
  segmentValue: string; // e.g., "1", "2", "Computer Science", "hostel", "undergraduate"
  segmentLabel: string; // e.g., "Year 1", "CS Department", "Hostel Residents"
  totalStudents: number;
  totalResponses: number;
  participationRate: number;
  avgSatisfaction: number;
  topService: string;
  topIssue?: string;
}

export interface SegmentedAnalytics {
  byYear: StudentSegment[];
  byDepartment: StudentSegment[];
  byResidence: StudentSegment[];
  byProgram: StudentSegment[];
  insights: string[]; // e.g., "Year 1 students report 20% lower hostel satisfaction"
}

// Service Comparison by Segment
export interface ServiceBySegment {
  serviceId: string;
  serviceName: string;
  segments: {
    segmentLabel: string;
    avgSatisfaction: number;
    responseCount: number;
    participationRate: number;
  }[];
  significantDifferences: {
    segment1: string;
    segment2: string;
    difference: number;
    isSignificant: boolean; // Statistical significance
  }[];
}

// ==================== SERVICE PERFORMANCE BENCHMARK ====================

export interface ServiceBenchmark {
  serviceId: string;
  serviceName: string;
  collegeId: string;
  
  // Current performance
  currentScore: number;
  currentParticipation: number;
  currentIssueCount: number;
  
  // Benchmark comparisons
  campusAverage: number;
  categoryAverage?: number; // Average for similar services (e.g., all libraries)
  nationalAverage?: number; // If available
  topPerformer?: number; // Best score in category
  
  // Performance indicators
  vsAverage: number; // Difference from campus average
  performanceLabel: "excellent" | "above_average" | "average" | "below_average" | "needs_attention";
  percentile: number; // 0-100, where they rank
  
  // Trends
  trendVsLastPeriod: number;
  trendVsLastYear?: number;
  
  // Context
  lastUpdated: string;
}

export interface BenchmarkSummary {
  totalServices: number;
  aboveAverage: number;
  belowAverage: number;
  campusAverage: number;
  topPerformingService: string;
  needsAttentionService: string;
  benchmarks: ServiceBenchmark[];
}

 // ==================== ALERT SYSTEM ====================

export type AlertType = 
  | "satisfaction_drop"
  | "critical_issue"
  | "low_participation"
  | "deadline_missed"
  | "issue_escalated"
  | "service_degradation"
  | "high_complaint_volume";

export type AlertStatus = "active" | "acknowledged" | "resolved" | "dismissed";

export interface Alert {
  id: string;
  type: AlertType;
  severity: IssueSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  
  // Context
  serviceId?: string;
  serviceName?: string;
  issueId?: string;
  departmentId?: string;
  
  // Thresholds
  thresholdValue?: number;
  currentValue?: number;
  
  // Recipients
  recipients: string[]; // User IDs to notify
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  
  // Timing
  createdAt: string;
  expiresAt?: string;
  resolvedAt?: string;
  
  // Actions
  actionUrl?: string; // Deep link to relevant page
  recommendedActions?: string[];
  
  // Multi-tenant
  collegeId: string;
}

export interface AlertSettings {
  collegeId: string;
  enabled: boolean;
  
  // Thresholds
  satisfactionThreshold: number; // Alert if below this (e.g., 3.0)
  participationThreshold: number; // Alert if below this percentage (e.g., 30)
  issueAgeThreshold: number; // Days before escalation (e.g., 7)
  complaintVolumeThreshold: number; // Number of complaints to trigger alert
  
  // Notification channels
  emailEnabled: boolean;
  inAppEnabled: boolean;
  
  // Frequency limits
  maxAlertsPerDay: number;
  quietHoursStart?: string; // e.g., "22:00"
  quietHoursEnd?: string; // e.g., "08:00"
  
  // Recipients by alert type
  recipientsByType: {
    [key in AlertType]?: string[]; // User IDs
  };
}

// ==================== PARTICIPATION IMPROVEMENT ====================

export interface ParticipationInsight {
  type: "low_overall" | "low_service" | "declining_trend" | "segment_gap";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  
  // Data
  currentRate: number;
  targetRate:number;
  gap: number;
  affectedService?: string;
  affectedSegment?: string;
  
  // Recommendations
  recommendations: {
    action: string;
    expectedImpact: string;
    effort: "low" | "medium" | "high";
    priority: number;
  }[];
  
  // Tracking
  identifiedAt: string;
  status: "new" | "in_progress" | "implemented" | "monitoring";
  implementedAt?: string;
  resultMetrics?: {
    beforeRate: number;
    afterRate: number;
    improvement: number;
  };
}

export interface ParticipationStrategy {
  id: string;
  name: string;
  description: string;
  targetedService?: string;
  targetedSegment?: string;
  
  // Implementation
  implementedAt?: string;
  implementedBy?: string;
  
  // Success metrics
  baselineParticipation: number;
  targetParticipation: number;
  currentParticipation?: number;
  isSuccessful?: boolean;
  
  // Timeline
  startDate: string;
  endDate?: string;
  measurementPeriod: number; // Days to measure success
}

// ==================== IMPROVEMENT TIMELINE ====================

export type ImprovementPhase = "detected" | "investigating" | "implementing" | "measuring" | "verified" | "closed";

export interface ImprovementMilestone {
  phase: ImprovementPhase;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  metrics?: {
    satisfactionScore?: number;
    participationRate?: number;
    complaintCount?: number;
  };
}

export interface ImprovementTimeline {
  issueId: string;
  issueTitle: string;
  serviceId: string;
  serviceName: string;
  
  // Timeline
  startDate: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  totalDays?: number;
  
  // Phases
  milestones: ImprovementMilestone[];
  currentPhase: ImprovementPhase;
  
  // Before/After
  initialMetrics: {
    satisfactionScore: number;
    complaintCount: number;
    participationRate: number;
    measurementDate: string;
  };
  
  finalMetrics?: {
    satisfactionScore: number;
    complaintCount: number;
    participationRate: number;
    measurementDate: string;
  };
  
  // Impact
  improvementPercent?: number;
  isSuccessful?: boolean;
  successCriteria?: string;
  
  // Story
  problemDescription: string;
  solutionImplemented?: string;
  lessonsLearned?: string[];
  
  // Visibility
  isPublic: boolean; // Share with students?
  studentViewCount?: number;
}

// Complete Operational Dashboard
export interface OperationalDashboard extends EnhancedDashboard {
  managedIssues: ManagedIssue[];
  historicalComparison: HistoricalComparison;
  serviceHealth: ServiceHealth[];
  serviceParticipation: ServiceParticipation[];
  serviceOwners: ServiceOwner[];
  improvements: Improvement[];
  aiInsights: AIInsight[];
  weeklySummary: WeeklySummary;
  studentVoices: StudentVoice[];
  participationTrend: ParticipationTrend[];
  
  // New operational features
  segmentedAnalytics?: SegmentedAnalytics;
  serviceBenchmarks?: BenchmarkSummary;
  activeAlerts?: Alert[];
  participationInsights?: ParticipationInsight[];
  improvementTimelines?: ImprovementTimeline[];
}
