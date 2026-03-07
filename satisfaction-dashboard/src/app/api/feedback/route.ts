import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { MOCK_FEEDBACK, USE_MOCK_DATA } from "@/lib/mock-data";
import { getTenantContext, buildTenantQuery } from "@/lib/tenant-context";

// Minimal Mongoose schema with collegeId
const FeedbackSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  serviceId: String,
  collegeId: String, // Multi-tenant support
  ratings: mongoose.Schema.Types.Mixed,
  overallSatisfaction: Number,
  comment: String,
  demographics: mongoose.Schema.Types.Mixed, // Optional demographic context
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
    
    // Get tenant context
    const { collegeId } = getTenantContext(req);
    
    const body = await req.json();

    // Basic validation
    if (!body.serviceId || !body.ratings || !body.overallSatisfaction) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (body.overallSatisfaction < 1 || body.overallSatisfaction > 5) {
      return NextResponse.json({ error: "Invalid satisfaction score" }, { status: 400 });
    }

    // Add collegeId to the submission
    const feedbackData = {
      ...body,
      collegeId,
      submittedAt: new Date(),
    };

    const doc = await Feedback.create(feedbackData);
    return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
  } catch (err) {
    console.error("Feedback POST Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to submit feedback", details: errorMessage },
      { status: 500 }
    );
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
    
    // Get tenant context
    const { collegeId } = getTenantContext(req);
    
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    // Build tenant-aware query
    const baseQuery = serviceId && serviceId !== "all" ? { serviceId } : {};
    const query = buildTenantQuery(baseQuery, collegeId);
    
    const docs = await Feedback.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ feedback: docs });
  } catch (err) {
    console.error("Feedback GET Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch feedback", details: errorMessage },
      { status: 500 }
    );
  }
}
