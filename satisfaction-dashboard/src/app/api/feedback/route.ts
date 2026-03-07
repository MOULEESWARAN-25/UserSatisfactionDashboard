import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { MOCK_FEEDBACK, USE_MOCK_DATA } from "@/lib/mock-data";

// Minimal Mongoose schema
const FeedbackSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  serviceId: String,
  ratings: mongoose.Schema.Types.Mixed,
  overallSatisfaction: Number,
  comment: String,
  submittedAt: { type: Date, default: Date.now },
});

const Feedback =
  mongoose.models.Feedback ?? mongoose.model("Feedback", FeedbackSchema);

export async function POST(req: NextRequest) {
  // Mock POST for development - just return success
  if (USE_MOCK_DATA) {
    const body = await req.json();
    if (!body.serviceId || !body.ratings || !body.overallSatisfaction) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    return NextResponse.json({ success: true, id: "mock-" + Date.now() }, { status: 201 });
  }

  try {
    await connectDB();
    const body = await req.json();

    // Basic validation
    if (!body.serviceId || !body.ratings || !body.overallSatisfaction) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (body.overallSatisfaction < 1 || body.overallSatisfaction > 5) {
      return NextResponse.json({ error: "Invalid satisfaction score" }, { status: 400 });
    }

    const doc = await Feedback.create(body);
    return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Return mock data for development
  if (USE_MOCK_DATA) {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    let filtered = MOCK_FEEDBACK;
    if (serviceId && serviceId !== "all") {
      filtered = MOCK_FEEDBACK.filter((f) => f.serviceId === serviceId);
    }
    return NextResponse.json({ feedback: filtered.slice(0, limit) });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const query = serviceId && serviceId !== "all" ? { serviceId } : {};
    const docs = await Feedback.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ feedback: docs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
