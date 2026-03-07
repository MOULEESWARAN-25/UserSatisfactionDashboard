import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { SERVICES } from "@/lib/constants";
import { MOCK_ANALYTICS, USE_MOCK_DATA } from "@/lib/mock-data";

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
  // Return mock data for development
  if (USE_MOCK_DATA) {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    
    if (serviceId && serviceId !== "all") {
      const filteredBreakdown = MOCK_ANALYTICS.serviceBreakdown.filter(
        (s) => s.serviceId === serviceId
      );
      return NextResponse.json({
        ...MOCK_ANALYTICS,
        serviceBreakdown: filteredBreakdown,
      });
    }
    return NextResponse.json(MOCK_ANALYTICS);
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const matchStage = serviceId && serviceId !== "all" ? { serviceId } : {};

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Aggregate current metrics
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

    // This month's feedback count
    const thisMonthCount = await Feedback.countDocuments({
      ...matchStage,
      submittedAt: { $gte: oneMonthAgo },
    });

    // Last month's feedback count (for delta)
    const lastMonthCount = await Feedback.countDocuments({
      ...matchStage,
      submittedAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
    });

    // Calculate feedback delta percentage
    const totalFeedbackDelta = lastMonthCount > 0 
      ? ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 
      : thisMonthCount > 0 ? 100 : 0;

    // This week's satisfaction
    const [thisWeekSat] = await Feedback.aggregate([
      { $match: { ...matchStage, submittedAt: { $gte: oneWeekAgo } } },
      { $group: { _id: null, avg: { $avg: "$overallSatisfaction" } } },
    ]);

    // Last week's satisfaction (for delta)
    const [lastWeekSat] = await Feedback.aggregate([
      { $match: { ...matchStage, submittedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } } },
      { $group: { _id: null, avg: { $avg: "$overallSatisfaction" } } },
    ]);

    const avgSatisfactionDelta = (thisWeekSat?.avg ?? 0) - (lastWeekSat?.avg ?? 0);

    // Weekly count
    const weeklyCount = await Feedback.countDocuments({
      ...matchStage,
      submittedAt: { $gte: oneWeekAgo },
    });

    // Previous week count (for delta)
    const prevWeekCount = await Feedback.countDocuments({
      ...matchStage,
      submittedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
    });

    const weeklyResponsesDelta = prevWeekCount > 0 
      ? ((weeklyCount - prevWeekCount) / prevWeekCount) * 100 
      : weeklyCount > 0 ? 100 : 0;

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

    // Service breakdown with trend calculation
    const serviceBreakdown = await Promise.all(
      SERVICES.map(async (s) => {
        // Current average
        const [agg] = await Feedback.aggregate([
          { $match: { serviceId: s.id } },
          { $group: { _id: null, avg: { $avg: "$overallSatisfaction" }, total: { $sum: 1 } } },
        ]);

        // This week vs last week for trend
        const [thisWeek] = await Feedback.aggregate([
          { $match: { serviceId: s.id, submittedAt: { $gte: oneWeekAgo } } },
          { $group: { _id: null, avg: { $avg: "$overallSatisfaction" } } },
        ]);
        const [lastWeek] = await Feedback.aggregate([
          { $match: { serviceId: s.id, submittedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } } },
          { $group: { _id: null, avg: { $avg: "$overallSatisfaction" } } },
        ]);

        let trend: "up" | "down" | "stable" = "stable";
        if (thisWeek?.avg && lastWeek?.avg) {
          const diff = thisWeek.avg - lastWeek.avg;
          if (diff > 0.2) trend = "up";
          else if (diff < -0.2) trend = "down";
        }

        return {
          serviceId: s.id,
          serviceName: s.name,
          avgScore: agg?.avg ?? 0,
          totalFeedback: agg?.total ?? 0,
          trend,
        };
      })
    );

    return NextResponse.json({
      metrics: {
        totalFeedback: metrics?.totalFeedback ?? 0,
        avgSatisfaction: metrics?.avgSatisfaction ?? 0,
        weeklyResponses: weeklyCount,
        topServiceScore: Math.max(...serviceBreakdown.map((s) => s.avgScore), 0),
        totalFeedbackDelta: Math.round(totalFeedbackDelta * 10) / 10,
        avgSatisfactionDelta: Math.round(avgSatisfactionDelta * 100) / 100,
        weeklyResponsesDelta: Math.round(weeklyResponsesDelta * 10) / 10,
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
