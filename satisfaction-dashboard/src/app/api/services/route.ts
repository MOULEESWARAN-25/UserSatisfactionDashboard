import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { SERVICES } from "@/lib/constants";
import { getTenantContext } from "@/lib/tenant-context";

const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: "school" },
  questions: [{ id: String, label: String }],
  collegeId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound unique index: one service id per college
ServiceSchema.index({ id: 1, collegeId: 1 }, { unique: true });

const Service =
  mongoose.models.Service ?? mongoose.model("Service", ServiceSchema);

/** GET /api/services — returns services for this college (seeding defaults if empty) */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { collegeId } = getTenantContext(req);

    let services = await Service.find({ collegeId, isActive: true })
      .sort({ createdAt: 1 })
      .lean();

    // Auto-seed default services on first access
    if (services.length === 0) {
      const defaults = SERVICES.map((s) => ({
        id: s.id,
        name: s.name,
        icon: s.icon,
        questions: s.questions,
        collegeId,
        isActive: true,
      }));
      await Service.insertMany(defaults, { ordered: false }).catch(() => {});
      services = await Service.find({ collegeId, isActive: true })
        .sort({ createdAt: 1 })
        .lean();
    }

    const response = NextResponse.json({ services });
    response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=10");
    return response;
  } catch (err) {
    console.error("Services GET error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

/** POST /api/services — create a new service */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { collegeId } = getTenantContext(req);
    const body = await req.json();

    if (!body.name?.trim() || !body.id?.trim()) {
      return NextResponse.json({ error: "Service id and name are required" }, { status: 400 });
    }

    const service = await Service.create({
      id: body.id,
      name: body.name,
      icon: body.icon ?? "school",
      questions: body.questions ?? [],
      collegeId,
      isActive: true,
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "A service with this ID already exists" }, { status: 409 });
    }
    console.error("Services POST error:", err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

/** PUT /api/services — update an existing service */
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { collegeId } = getTenantContext(req);
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "Service id is required" }, { status: 400 });
    }

    const updated = await Service.findOneAndUpdate(
      { id: body.id, collegeId },
      {
        name: body.name,
        icon: body.icon,
        questions: body.questions,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service: updated });
  } catch (err) {
    console.error("Services PUT error:", err);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

/** DELETE /api/services?id=xxx — soft-delete a service */
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { collegeId } = getTenantContext(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service id is required" }, { status: 400 });
    }

    await Service.findOneAndUpdate(
      { id, collegeId },
      { isActive: false, updatedAt: new Date() }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Services DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
