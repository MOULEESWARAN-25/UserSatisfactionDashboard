import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import type { College } from "@/types/analytics";

// College schema for MongoDB
const CollegeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  logo: { type: String },
  primaryColor: { type: String },
  address: { type: String },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  settings: {
    enableAIInsights: { type: Boolean, default: true },
    enableNotifications: { type: Boolean, default: true },
    submissionLimit: { type: Number, default: 5 }, // submissions per student per week
    requireDemographics: { type: Boolean, default: false },
    customServices: [String],
    customQuestions: [String],
    notificationThresholds: {
      criticalIssueScore: { type: Number, default: 2.0 },
      lowParticipation: { type: Number, default: 30 },
    },
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    default: "free",
  },
  status: {
    type: String,
    enum: ["active", "suspended", "trial"],
    default: "trial",
  },
  createdAt: { type: Date, default: Date.now },
});

const College =
  mongoose.models.College ?? mongoose.model("College", CollegeSchema);

// User schema for college admin
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "college_admin" },
  collegeId: { type: String, required: true },
  collegeName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

// Service schema for college-specific services
const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  collegeId: { type: String, required: true },
  departmentId: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Service =
  mongoose.models.Service ?? mongoose.model("Service", ServiceSchema);

/**
 * POST /api/colleges/onboard
 * Create a new college and admin user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      domain,
      address,
      phone,
      contactEmail,
      adminName,
      adminEmail,
      adminPassword,
      servicesEnabled = [],
    } = body;

    // Validation
    if (!name || !domain || !contactEmail || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate domain format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format. Use only lowercase letters, numbers, and hyphens." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail) || !emailRegex.test(adminEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (adminPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if domain already exists
    const existingCollege = await College.findOne({ domain });
    if (existingCollege) {
      return NextResponse.json(
        { error: "Domain already taken. Please choose a different subdomain." },
        { status: 409 }
      );
    }

    // Check if admin email already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Email already registered. Please use a different email." },
        { status: 409 }
      );
    }

    // Generate college ID
    const collegeId = `college-${domain}`;

    // Create college
    const newCollege = await College.create({
      id: collegeId,
      name,
      domain,
      address,
      contactEmail,
      contactPhone: phone,
      logo: null,
      primaryColor: "#2563eb", // Default blue
      settings: {
        enableAIInsights: true,
        enableNotifications: true,
        submissionLimit: 5,
        requireDemographics: false,
        customServices: servicesEnabled,
        customQuestions: [],
        notificationThresholds: {
          criticalIssueScore: 2.0,
          lowParticipation: 30,
        },
      },
      subscription: "free",
      status: "trial",
    });

    // Create admin user
    const adminUserId = `admin-${domain}-${Date.now()}`;
    const newAdmin = await User.create({
      id: adminUserId,
      name: adminName,
      email: adminEmail,
      password: adminPassword, // In production, hash this!
      role: "college_admin",
      collegeId,
      collegeName: name,
    });

    // Create enabled services
    if (servicesEnabled.length > 0) {
      const servicePromises = servicesEnabled.map((serviceId: string) => {
        // Map service IDs to names
        const serviceNames: Record<string, string> = {
          library: "Library",
          cafeteria: "Cafeteria",
          hostel: "Hostel",
          "online-course": "Online Portal",
          "campus-event": "Campus Events",
          transport: "Transport",
          sports: "Sports Facilities",
          health: "Health Center",
        };

        return Service.create({
          id: serviceId,
          name: serviceNames[serviceId] || serviceId,
          collegeId,
          isActive: true,
        });
      });

      await Promise.all(servicePromises);
    }

    return NextResponse.json(
      {
        success: true,
        college: {
          id: newCollege.id,
          name: newCollege.name,
          domain: newCollege.domain,
        },
        admin: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          collegeId: newAdmin.collegeId,
        },
        servicesCreated: servicesEnabled.length,
        message: "College onboarded successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("College onboarding error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to onboard college", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/colleges/onboard
 * Check if a domain is available
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Domain parameter required" },
        { status: 400 }
      );
    }

    // Validate domain format
    if (!/^[a-z0-9-]+$/.test(domain)) {
      return NextResponse.json(
        { available: false, reason: "Invalid format" }
      );
    }

    await connectDB();

    const existingCollege = await College.findOne({ domain });

    return NextResponse.json({
      available: !existingCollege,
      domain,
    });
  } catch (err) {
    console.error("Domain check error:", err);
    return NextResponse.json(
      { error: "Failed to check domain availability" },
      { status: 500 }
    );
  }
}
