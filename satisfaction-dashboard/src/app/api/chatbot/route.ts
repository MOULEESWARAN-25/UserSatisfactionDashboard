import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function generateSystemPrompt(metrics: any) {
  return `You are SatisfyIQ Assistant — a helpful, concise AI assistant for the SatisfyIQ Student Satisfaction Dashboard at Bannari Amman Institute of Technology (BIT Sathy), Erode, Tamil Nadu, India.

PLATFORM OVERVIEW:
SatisfyIQ is a centralized feedback management system that helps BIT Sathy monitor and improve the quality of campus services. 

CURRENT REAL-TIME DASHBOARD STATISTICS:
- Total Feedback Collected: ${metrics.totalFeedback}
- Overall Average Satisfaction: ${metrics.avgSatisfaction.toFixed(2)} out of 5
- Active Critical Issues: ${metrics.criticalIssues}

SERVICES TRACKED (5 categories):
1. **Cafeteria**
2. **Library**
3. **Online Course Portal**
4. **Hostel**
5. **Campus Events**

USER ROLES:
- **Students** can submit feedback (1–5 star ratings + optional comments) for any service, view their past submissions, and optionally submit anonymously
- **College Admins** access the full dashboard with analytics, service health monitoring, reports, and settings

HOW TO SUBMIT FEEDBACK:
1. Log in as a Student
2. Click "Submit Feedback" in the sidebar
3. Select a service (Cafeteria, Library, etc.)
4. Rate each question from 1 to 5 stars
5. Add an overall satisfaction rating
6. Optionally write a comment
7. Click "Submit Feedback"

RESPONSE GUIDELINES:
- Be concise: 2–4 sentences max for most questions
- Be helpful and friendly in tone
- You have access to real-time statistics shown above, use them if asked about current platform status.
- For technical issues, suggest refreshing the page or contacting the admin
- Answer about BIT Sathy campus life, the feedback process, and general questions
- Do NOT reveal internal implementation details, database schemas, or API endpoints
- Respond in English by default, but you may greet in Tamil if the user writes in Tamil`;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Chatbot is not configured. Please set the GROQ_API_KEY environment variable." },
        { status: 503 }
      );
    }

    const { message, history } = (await req.json()) as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch dynamic context from MongoDB
    let dbMetrics = { totalFeedback: 0, avgSatisfaction: 0, criticalIssues: 0 };
    try {
      await connectDB();
      const Feedback = mongoose.models.Feedback ?? mongoose.model("Feedback", new mongoose.Schema({}));
      
      const [stats] = await Feedback.aggregate([
        { 
          $group: { 
            _id: null, 
            total: { $sum: 1 }, 
            avg: { $avg: "$overallSatisfaction" },
            critical: { 
              $sum: { $cond: [{ $lte: ["$overallSatisfaction", 2] }, 1, 0] } 
            }
          } 
        }
      ]);
      
      if (stats) {
        dbMetrics = {
          totalFeedback: stats.total || 0,
          avgSatisfaction: stats.avg || 0,
          criticalIssues: stats.critical || 0
        };
      }
    } catch (e) {
      console.error("Failed to fetch dynamic stats for chatbot:", e);
      // Fail gracefully and just use default zeros so the chat doesn't break
    }

    // Build conversation messages
    const messages = [
      { role: "system" as const, content: generateSystemPrompt(dbMetrics) },
      ...(history ?? []).slice(-8).map((m: ChatMessage) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.6,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm unable to respond right now.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

