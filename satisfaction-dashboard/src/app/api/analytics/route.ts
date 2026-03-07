import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { SERVICES } from "@/lib/constants";

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

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const matchStage = serviceId && serviceId !== "all" ? { serviceId } : {};

    // Aggregate metrics
    const [metrics] = await Feedback.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgSatisfaction: { $avg: "$overallSatisfaction" },
        },
      },
    ]);

    // Weekly count
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyCount = await Feedback.countDocuments({
      ...matchStage,
      submittedAt: { $gte: oneWeekAgo },
    });

    // Trend (last 14 days)
    const trends = await Feedback.aggregate([
      {
        $match: {
          ...matchStage,
          submittedAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%m/%d", date: "$submittedAt" } },
          score: { $avg: "$overallSatisfaction" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", score: 1, count: 1 } },
    ]);

    // Rating distribution
    const ratingDist = await Feedback.aggregate([
      { $match: matchStage },
      { $group: { _id: "$overallSatisfaction", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, rating: "$_id", count: 1 } },
    ]);
    const fullDist = [1, 2, 3, 4, 5].map((r) => ({
      rating: r,
      count: ratingDist.find((d: any) => d.rating === r)?.count ?? 0,
    }));

    // Service breakdown
    const serviceBreakdown = await Promise.all(
      SERVICES.map(async (s) => {
        const [agg] = await Feedback.aggregate([
          { $match: { serviceId: s.id } },
          { $group: { _id: null, avg: { $avg: "$overallSatisfaction" }, total: { $sum: 1 } } },
        ]);
        return {
          serviceId: s.id,
          serviceName: s.name,
          avgScore: agg?.avg ?? 0,
          totalFeedback: agg?.total ?? 0,
          trend: "stable" as const,
        };
      })
    );

    return NextResponse.json({
      metrics: {
        totalFeedback: metrics?.totalFeedback ?? 0,
        avgSatisfaction: metrics?.avgSatisfaction ?? 0,
        weeklyResponses: weeklyCount,
        topServiceScore: Math.max(...serviceBreakdown.map((s) => s.avgScore), 0),
        totalFeedbackDelta: 5.2,
        avgSatisfactionDelta: 0.3,
        weeklyResponsesDelta: 12.1,
      },
      trends,
      ratingDistribution: fullDist,
      serviceBreakdown,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
