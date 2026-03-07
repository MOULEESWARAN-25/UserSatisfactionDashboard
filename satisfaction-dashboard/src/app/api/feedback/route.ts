import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

// Minimal Mongoose schema
const FeedbackSchema = new mongoose.Schema({
  studentId: String,
  serviceId: String,
  ratings: mongoose.Schema.Types.Mixed,
  overallSatisfaction: Number,
  comment: String,
  submittedAt: { type: Date, default: Date.now },
});

const Feedback =
  mongoose.models.Feedback ?? mongoose.model("Feedback", FeedbackSchema);

export async function POST(req: NextRequest) {
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
