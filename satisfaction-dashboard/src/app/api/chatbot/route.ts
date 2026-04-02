import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are SatisfyIQ Assistant — a helpful, concise AI assistant for the SatisfyIQ Student Satisfaction Dashboard at Bannari Amman Institute of Technology (BIT Sathy), Erode, Tamil Nadu, India.

PLATFORM OVERVIEW:
SatisfyIQ is a centralized feedback management system that helps BIT Sathy monitor and improve the quality of campus services. It collects student feedback, generates analytics, and provides actionable insights to administrators.

SERVICES TRACKED (5 categories):
1. **Cafeteria** — Food Quality, Hygiene & Cleanliness, Staff Behavior, Waiting Time, Menu Variety
2. **Library** — Book Availability, Quietness, Seating Space, Staff Support
3. **Online Course Portal** — Content Quality, Platform Usability, Instructor Support, Video Quality
4. **Hostel** — Room Cleanliness, Facilities, Security, Warden Support, WiFi Connectivity
5. **Campus Events** — Organization, Content Relevance, Venue Quality, Timing & Schedule

USER ROLES:
- **Students** can submit feedback (1–5 star ratings + optional comments) for any service, view their past submissions, and optionally submit anonymously
- **College Admins** access the full dashboard with analytics, service health monitoring, reports, and settings

DASHBOARD SECTIONS (Admin):
- **Dashboard** — KPI cards (total feedback, avg. satisfaction, weekly responses, top service), satisfaction trend line chart, feedback volume line chart, peak hours bar chart
- **Analytics** — Service comparison horizontal bar chart, rating distribution donut chart, improvement areas, sentiment analysis, detailed service scorecards
- **Services** — Individual service pages with per-question breakdowns and detected issues
- **Reports** — Monthly/weekly summary reports with print/export functionality
- **Feedback** — Browse and filter all submitted feedback with full text comments
- **Settings** — Institution profile, satisfaction alert threshold, anonymous feedback toggle, thank-you message toggle

HOW TO SUBMIT FEEDBACK:
1. Log in as a Student (e.g., STU2024001 / student123)
2. Click "Submit Feedback" in the sidebar
3. Select a service (Cafeteria, Library, etc.)
4. Rate each question from 1 to 5 stars
5. Add an overall satisfaction rating
6. Optionally write a comment
7. Click "Submit Feedback"

RESPONSE GUIDELINES:
- Be concise: 2–4 sentences max for most questions
- Be helpful and friendly in tone
- If asked about specific data or scores, explain what section to check rather than making up numbers
- For technical issues, suggest refreshing the page or contacting the admin
- You can answer about BIT Sathy campus life, the feedback process, dashboard features, and general questions
- Do NOT reveal internal implementation details, database schemas, or API endpoints
- Respond in English by default, but you may greet in Tamil if the user writes in Tamil`;



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

    // Build conversation messages
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
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
