import type { AnalyticsDashboard } from "@/types/analytics";
import type { FeedbackRecord } from "@/types/feedback";

// Generate dates for the last 14 days
function getRecentDates(days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`);
  }
  return dates;
}

const recentDates = getRecentDates(14);

export const MOCK_ANALYTICS: AnalyticsDashboard = {
  metrics: {
    totalFeedback: 1247,
    avgSatisfaction: 4.2,
    weeklyResponses: 156,
    topServiceScore: 4.7,
    totalFeedbackDelta: 12.5,
    avgSatisfactionDelta: 0.3,
    weeklyResponsesDelta: 8.2,
  },
  trends: recentDates.map((date, i) => ({
    date,
    score: 3.8 + Math.sin(i * 0.5) * 0.5 + Math.random() * 0.3,
    count: 8 + Math.floor(Math.random() * 15),
  })),
  ratingDistribution: [
    { rating: 1, count: 23 },
    { rating: 2, count: 45 },
    { rating: 3, count: 187 },
    { rating: 4, count: 456 },
    { rating: 5, count: 536 },
  ],
  serviceBreakdown: [
    {
      serviceId: "cafeteria",
      serviceName: "Cafeteria",
      avgScore: 4.2,
      totalFeedback: 312,
      trend: "up",
    },
    {
      serviceId: "library",
      serviceName: "Library",
      avgScore: 4.7,
      totalFeedback: 289,
      trend: "up",
    },
    {
      serviceId: "online-course",
      serviceName: "Online Course Portal",
      avgScore: 3.8,
      totalFeedback: 245,
      trend: "down",
    },
    {
      serviceId: "hostel",
      serviceName: "Hostel",
      avgScore: 3.9,
      totalFeedback: 198,
      trend: "stable",
    },
    {
      serviceId: "campus-event",
      serviceName: "Campus Events",
      avgScore: 4.5,
      totalFeedback: 203,
      trend: "up",
    },
  ],
};

// Generate some recent timestamps
function getRecentTimestamp(daysAgo: number, hoursAgo: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

export const MOCK_FEEDBACK: FeedbackRecord[] = [
  {
    _id: "fb001",
    studentId: "STU2024001",
    studentName: "Alice Johnson",
    serviceId: "cafeteria",
    serviceName: "Cafeteria",
    ratings: { quality: 5, variety: 4, cleanliness: 5, value: 4 },
    overallSatisfaction: 5,
    comment: "Great food options and very clean environment!",
    submittedAt: getRecentTimestamp(0, 2),
  },
  {
    _id: "fb002",
    studentId: "STU2024015",
    studentName: "Bob Smith",
    serviceId: "library",
    serviceName: "Library",
    ratings: { resources: 5, environment: 5, staff: 4, hours: 5 },
    overallSatisfaction: 5,
    comment: "Excellent study environment with great resources.",
    submittedAt: getRecentTimestamp(0, 5),
  },
  {
    _id: "fb003",
    studentId: "STU2024042",
    studentName: "Carol Davis",
    serviceId: "online-course",
    serviceName: "Online Course Portal",
    ratings: { usability: 3, content: 4, support: 3, reliability: 2 },
    overallSatisfaction: 3,
    comment: "Platform could be more stable during peak hours.",
    submittedAt: getRecentTimestamp(0, 8),
  },
  {
    _id: "fb004",
    studentId: "STU2024078",
    studentName: "David Wilson",
    serviceId: "hostel",
    serviceName: "Hostel",
    ratings: { cleanliness: 4, amenities: 3, security: 5, maintenance: 4 },
    overallSatisfaction: 4,
    comment: "Good security but needs better WiFi coverage.",
    submittedAt: getRecentTimestamp(1, 3),
  },
  {
    _id: "fb005",
    studentId: "STU2024103",
    studentName: "Eva Martinez",
    serviceId: "campus-event",
    serviceName: "Campus Events",
    ratings: { variety: 5, organization: 5, communication: 4, timing: 4 },
    overallSatisfaction: 5,
    comment: "Loved the tech fest! More events like this please.",
    submittedAt: getRecentTimestamp(1, 6),
  },
  {
    _id: "fb006",
    studentId: "STU2024089",
    studentName: "Frank Lee",
    serviceId: "cafeteria",
    serviceName: "Cafeteria",
    ratings: { quality: 4, variety: 3, cleanliness: 4, value: 3 },
    overallSatisfaction: 4,
    comment: "Would appreciate more vegetarian options.",
    submittedAt: getRecentTimestamp(1, 12),
  },
  {
    _id: "fb007",
    studentId: "STU2024156",
    studentName: "Grace Chen",
    serviceId: "library",
    serviceName: "Library",
    ratings: { resources: 4, environment: 5, staff: 5, hours: 4 },
    overallSatisfaction: 4,
    comment: "Staff is very helpful. Extended hours during exams would be great.",
    submittedAt: getRecentTimestamp(2, 1),
  },
  {
    _id: "fb008",
    studentId: "STU2024201",
    studentName: "Henry Brown",
    serviceId: "online-course",
    serviceName: "Online Course Portal",
    ratings: { usability: 4, content: 5, support: 4, reliability: 3 },
    overallSatisfaction: 4,
    comment: "Course content is excellent, minor technical issues.",
    submittedAt: getRecentTimestamp(2, 4),
  },
  {
    _id: "fb009",
    studentId: "STU2024234",
    studentName: "Ivy Taylor",
    serviceId: "hostel",
    serviceName: "Hostel",
    ratings: { cleanliness: 3, amenities: 3, security: 4, maintenance: 3 },
    overallSatisfaction: 3,
    comment: "Maintenance requests take too long to resolve.",
    submittedAt: getRecentTimestamp(2, 9),
  },
  {
    _id: "fb010",
    studentId: "STU2024267",
    studentName: "Jack Anderson",
    serviceId: "campus-event",
    serviceName: "Campus Events",
    ratings: { variety: 4, organization: 4, communication: 5, timing: 5 },
    overallSatisfaction: 4,
    comment: "Good events but could use more weekend activities.",
    submittedAt: getRecentTimestamp(3, 2),
  },
  {
    _id: "fb011",
    studentId: "STU2024312",
    studentName: "Kelly White",
    serviceId: "cafeteria",
    serviceName: "Cafeteria",
    ratings: { quality: 3, variety: 4, cleanliness: 4, value: 2 },
    overallSatisfaction: 3,
    comment: "Prices have gone up but quality hasn't improved.",
    submittedAt: getRecentTimestamp(3, 7),
  },
  {
    _id: "fb012",
    studentId: "STU2024345",
    studentName: "Leo Garcia",
    serviceId: "library",
    serviceName: "Library",
    ratings: { resources: 5, environment: 4, staff: 4, hours: 3 },
    overallSatisfaction: 4,
    comment: "Need more power outlets in study areas.",
    submittedAt: getRecentTimestamp(4, 3),
  },
];

// Flag to use mock data (set to true for development without MongoDB)
export const USE_MOCK_DATA = true;
