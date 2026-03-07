/**
 * Groq AI Integration for Intelligent Dashboard Insights
 * Uses Groq's fast LLM inference for real-time analysis
 */

import type {
  AIInsight,
  WeeklySummary,
  ServiceHealth,
  DetectedIssue,
  ComplaintSummary,
  HistoricalComparison,
} from "@/types/analytics";
import type { FeedbackRecord } from "@/types/feedback";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Make a request to Groq API
 */
async function callGroqAPI(messages: GroqMessage[], temperature: number = 0.7): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast and capable model
        messages,
        temperature,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API call failed:", error);
    throw error;
  }
}

/**
 * Generate AI insights from dashboard metrics
 */
export async function generateAIInsights(
  issues: DetectedIssue[],
  complaints: ComplaintSummary[],
  serviceHealth: ServiceHealth[]
): Promise<AIInsight[]> {
  const systemPrompt = `You are an expert educational institution operations analyst. 
Analyze student satisfaction data and provide actionable insights for administrators.
Focus on trends, patterns, and concrete recommendations.`;

  const userPrompt = `Analyze this student feedback data and provide 3-4 key insights:

Issues Detected:
${issues.map((i) => `- ${i.serviceName}: ${i.title} (${i.severity}, ${i.changePercent.toFixed(1)}%)`).join("\n")}

Top Complaints:
${complaints.map((c) => `- ${c.issue} (${c.count} mentions, ${c.trend})`).join("\n")}

Service Health:
${serviceHealth.map((s) => `- ${s.serviceName}: ${s.status} (${s.score.toFixed(1)}/5)`).join("\n")}

Provide insights in JSON format:
[
  {
    "type": "trend|anomaly|recommendation",
    "priority": "high|medium|low",
    "title": "Brief insight title",
    "description": "Detailed explanation",
    "affectedServices": ["service1", "service2"],
    "actionable": true,
    "suggestedAction": "What should be done"
  }
]`;

  try {
    const response = await callGroqAPI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      0.5
    );

    // Parse JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI insights");
    }

    const rawInsights = JSON.parse(jsonMatch[0]);
    
    return rawInsights.map((insight: any, index: number) => ({
      id: `ai-insight-${Date.now()}-${index}`,
      type: insight.type || "recommendation",
      priority: insight.priority || "medium",
      title: insight.title,
      description: insight.description,
      affectedServices: insight.affectedServices || [],
      generatedAt: new Date().toISOString(),
      confidence: 0.85,
      actionable: insight.actionable !== false,
      suggestedAction: insight.suggestedAction,
    }));
  } catch (error) {
    console.error("Failed to generate AI insights:", error);
    // Return fallback insights
    return [
      {
        id: `ai-insight-${Date.now()}`,
        collegeId: "",
        type: "summary",
        priority: "medium",
        title: "AI Analysis Unavailable",
        description: "Unable to generate AI insights at this time. Please review the data manually.",
        affectedServices: [],
        generatedAt: new Date().toISOString(),
        confidence: 0,
        actionable: false,
      },
    ];
  }
}

/**
 * Generate weekly summary report
 */
export async function generateWeeklySummary(
  weekData: {
    totalFeedback: number;
    avgSatisfaction: number;
    previousAvg: number;
    lowestService: string;
    lowestScore: number;
    highestService: string;
    highestScore: number;
    topComplaints: string[];
    newIssues: number;
    resolvedIssues: number;
    participationRate: number;
  }
): Promise<WeeklySummary> {
  const systemPrompt = `You are a concise report writer for educational institutions.
Generate brief, actionable weekly summaries for busy administrators.`;

  const userPrompt = `Generate a weekly summary based on this data:

Total Feedback: ${weekData.totalFeedback}
Average Satisfaction: ${weekData.avgSatisfaction.toFixed(1)}/5 (Previous: ${weekData.previousAvg.toFixed(1)})
Lowest Service: ${weekData.lowestService} (${weekData.lowestScore.toFixed(1)}/5)
Highest Service: ${weekData.highestService} (${weekData.highestScore.toFixed(1)}/5)
Top Complaints: ${weekData.topComplaints.join(", ")}
New Issues: ${weekData.newIssues}
Resolved Issues: ${weekData.resolvedIssues}
Participation Rate: ${weekData.participationRate.toFixed(1)}%

Provide 3-4 key insights and 2-3 recommendations in JSON format:
{
  "keyInsights": ["insight1", "insight2", "insight3"],
  "recommendations": ["action1", "action2"]
}`;

  try {
    const response = await callGroqAPI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      0.4
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse weekly summary");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const satisfactionChange = weekData.avgSatisfaction - weekData.previousAvg;
    const trend = satisfactionChange > 0.1 ? "improving" : satisfactionChange < -0.1 ? "declining" : "stable";

    return {
      id: `weekly-summary-${Date.now()}`,
      collegeId: "",
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      weekEnd: new Date().toISOString(),
      totalFeedback: weekData.totalFeedback,
      avgSatisfaction: weekData.avgSatisfaction,
      satisfactionChange,
      lowestService: {
        name: weekData.lowestService,
        score: weekData.lowestScore,
      },
      highestService: {
        name: weekData.highestService,
        score: weekData.highestScore,
      },
      topComplaint: weekData.topComplaints[0] || "No major complaints",
      newIssues: weekData.newIssues,
      resolvedIssues: weekData.resolvedIssues,
      participationRate: weekData.participationRate,
      trend,
      keyInsights: parsed.keyInsights || [],
      recommendations: parsed.recommendations || [],
      generatedAt: new Date().toISOString(),
      generatedBy: "ai",
    };
  } catch (error) {
    console.error("Failed to generate weekly summary:", error);
    // Return fallback summary
    const satisfactionChange = weekData.avgSatisfaction - weekData.previousAvg;
    return {
      id: `weekly-summary-${Date.now()}`,
      collegeId: "",
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      weekEnd: new Date().toISOString(),
      totalFeedback: weekData.totalFeedback,
      avgSatisfaction: weekData.avgSatisfaction,
      satisfactionChange,
      lowestService: { name: weekData.lowestService, score: weekData.lowestScore },
      highestService: { name: weekData.highestService, score: weekData.highestScore },
      topComplaint: weekData.topComplaints[0] || "No major complaints",
      newIssues: weekData.newIssues,
      resolvedIssues: weekData.resolvedIssues,
      participationRate: weekData.participationRate,
      trend: satisfactionChange > 0.1 ? "improving" : satisfactionChange < -0.1 ? "declining" : "stable",
      keyInsights: ["Weekly summary generated from system data"],
      recommendations: ["Review detailed metrics for specific issues"],
      generatedAt: new Date().toISOString(),
      generatedBy: "system",
    };
  }
}

/**
 * Summarize feedback comments for a service
 */
export async function summarizeFeedbackComments(
  serviceName: string,
  comments: string[]
): Promise<{ summary: string; topConcerns: string[]; sentiment: string }> {
  if (comments.length === 0) {
    return {
      summary: "No feedback comments available.",
      topConcerns: [],
      sentiment: "neutral",
    };
  }

  const systemPrompt = `You are analyzing student feedback for a campus service.
Summarize the key themes and concerns from student comments.`;

  const userPrompt = `Analyze these ${comments.length} student comments about ${serviceName}:

${comments.slice(0, 20).map((c, i) => `${i + 1}. "${c}"`).join("\n")}

Provide analysis in JSON format:
{
  "summary": "2-3 sentence summary of overall feedback",
  "topConcerns": ["concern1", "concern2", "concern3"],
  "sentiment": "positive|neutral|negative"
}`;

  try {
    const response = await callGroqAPI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      0.3
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse feedback summary");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to summarize feedback:", error);
    return {
      summary: `Analysis of ${comments.length} feedback comments for ${serviceName}.`,
      topConcerns: ["Unable to analyze comments at this time"],
      sentiment: "neutral",
    };
  }
}

/**
 * Explain why an issue occurred
 */
export async function explainIssue(
  issue: DetectedIssue,
  relatedComments: string[]
): Promise<string> {
  const systemPrompt = `You are an operations analyst explaining service quality issues to administrators.
Provide clear, actionable explanations.`;

  const userPrompt = `Explain why this issue occurred:

Issue: ${issue.title}
Service: ${issue.serviceName}
Current Satisfaction: ${issue.currentValue.toFixed(1)}/5 (was ${issue.previousValue.toFixed(1)})
Change: ${issue.changePercent.toFixed(1)}%

Related Student Comments:
${relatedComments.slice(0, 10).map((c, i) => `${i + 1}. "${c}"`).join("\n")}

Provide a 2-3 sentence explanation of the root cause and what likely happened.`;

  try {
    const response = await callGroqAPI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      0.4
    );

    return response.trim();
  } catch (error) {
    console.error("Failed to explain issue:", error);
    return `${issue.serviceName} satisfaction decreased by ${Math.abs(issue.changePercent).toFixed(1)}% based on ${relatedComments.length} student comments. Review the feedback for specific concerns.`;
  }
}

/**
 * Answer natural language query about dashboard data
 */
export async function answerQuery(
  query: string,
  dashboardContext: {
    services: string[];
    avgScores: Record<string, number>;
    topIssues: string[];
    recentTrend: string;
  }
): Promise<string> {
  const systemPrompt = `You are a helpful assistant for a campus service satisfaction dashboard.
Answer administrator questions clearly and concisely using the provided data.`;

  const userPrompt = `Answer this question using the dashboard data:

Question: ${query}

Available Services: ${dashboardContext.services.join(", ")}
Current Scores: ${Object.entries(dashboardContext.avgScores).map(([s, score]) => `${s}: ${score.toFixed(1)}/5`).join(", ")}
Top Issues: ${dashboardContext.topIssues.join(", ")}
Recent Trend: ${dashboardContext.recentTrend}

Provide a direct, helpful answer in 2-3 sentences.`;

  try {
    const response = await callGroqAPI(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      0.3
    );

    return response.trim();
  } catch (error) {
    console.error("Failed to answer query:", error);
    return "I'm unable to process your question at the moment. Please try rephrasing or consult the dashboard metrics directly.";
  }
}
