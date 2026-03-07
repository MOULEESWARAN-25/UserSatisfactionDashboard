import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { DEFAULT_USERS, USE_MOCK_DATA } from "@/lib/mock-data";

// User schema for MongoDB
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

// Login session schema
const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  role: { type: String, required: true },
  loginAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const Session = mongoose.models.Session ?? mongoose.model("Session", SessionSchema);

// Initialize default users in MongoDB
async function ensureDefaultUsers() {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ id: DEFAULT_USERS.admin.id });
    if (!adminExists) {
      await User.create(DEFAULT_USERS.admin);
      console.log("Default admin user created");
    }

    // Check if default student exists
    const studentExists = await User.findOne({ id: DEFAULT_USERS.student.id });
    if (!studentExists) {
      await User.create(DEFAULT_USERS.student);
      console.log("Default student user created");
    }
  } catch (error) {
    console.error("Error creating default users:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, userId, name, password, role, action } = body;
    
    // Support both 'id' and 'userId' field names
    const userIdentifier = id || userId;

    // For mock mode or simple login without password
    if (action === "simple-login") {
      // Simple login (no password required) - for development
      if (!userIdentifier || !name || !role) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Try to store in MongoDB if available
      if (!USE_MOCK_DATA) {
        try {
          await connectDB();
          await ensureDefaultUsers();
          
          // Log the session
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          await Session.create({
            userId: userIdentifier,
            userName: name,
            role,
            expiresAt,
          });
        } catch (dbError) {
          console.warn("MongoDB session logging failed, continuing with local auth:", dbError);
        }
      }

      return NextResponse.json({
        success: true,
        user: { userId: userIdentifier, name, role },
      });
    }

    // Authenticated login with password
    if (action === "login") {
      if (!userIdentifier || !password) {
        return NextResponse.json(
          { error: "ID and password are required" },
          { status: 400 }
        );
      }

      // Check default users first (works in mock mode too)
      const defaultAdmin = DEFAULT_USERS.admin;
      const defaultStudent = DEFAULT_USERS.student;

      if (userIdentifier === defaultAdmin.id && password === defaultAdmin.password) {
        return NextResponse.json({
          success: true,
          user: { userId: defaultAdmin.id, name: defaultAdmin.name, role: defaultAdmin.role },
        });
      }

      if (userIdentifier === defaultStudent.id && password === defaultStudent.password) {
        return NextResponse.json({
          success: true,
          user: { userId: defaultStudent.id, name: defaultStudent.name, role: defaultStudent.role },
        });
      }

      // Try MongoDB if not mock mode
      if (!USE_MOCK_DATA) {
        try {
          await connectDB();
          await ensureDefaultUsers();

          const user = await User.findOne({ id: userIdentifier });
          if (user && user.password === password) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Create session
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await Session.create({
              userId: user.id,
              userName: user.name,
              role: user.role,
              expiresAt,
            });

            return NextResponse.json({
              success: true,
              user: { userId: user.id, name: user.name, role: user.role },
            });
          }
        } catch (dbError) {
          console.error("MongoDB auth error:", dbError);
        }
      }

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Register new user
    if (action === "register") {
      if (!userIdentifier || !name || !password || !role) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      if (!USE_MOCK_DATA) {
        try {
          await connectDB();

          // Check if user exists
          const existingUser = await User.findOne({ id: userIdentifier });
          if (existingUser) {
            return NextResponse.json(
              { error: "User ID already exists" },
              { status: 409 }
            );
          }

          // Create new user
          const newUser = await User.create({ id: userIdentifier, name, password, role });
          
          return NextResponse.json({
            success: true,
            user: { userId: newUser.id, name: newUser.name, role: newUser.role },
          });
        } catch (dbError) {
          console.error("MongoDB register error:", dbError);
          return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
          );
        }
      }

      // Mock mode - just return success
      return NextResponse.json({
        success: true,
        user: { userId: userIdentifier, name, role },
        message: "User registered (mock mode)",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Authentication failed", details: errorMessage },
      { status: 500 }
    );
  }
}

// GET - Check auth status / get default credentials
export async function GET() {
  return NextResponse.json({
    defaultCredentials: {
      admin: {
        id: DEFAULT_USERS.admin.id,
        password: DEFAULT_USERS.admin.password,
      },
      student: {
        id: DEFAULT_USERS.student.id,
        password: DEFAULT_USERS.student.password,
      },
    },
    mockMode: USE_MOCK_DATA,
  });
}
