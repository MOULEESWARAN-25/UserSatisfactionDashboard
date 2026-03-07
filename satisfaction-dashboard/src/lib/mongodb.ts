import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/satisfaction_dashboard";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cache to prevent multiple connections in development
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export async function testConnection(): Promise<{
  connected: boolean;
  message: string;
  details?: {
    host: string;
    database: string;
    readyState: number;
  };
}> {
  try {
    const conn = await connectDB();
    const db = conn.connection;
    
    // Perform a simple operation to verify connection
    await db.db?.admin().ping();
    
    return {
      connected: true,
      message: "MongoDB connection successful",
      details: {
        host: db.host || "unknown",
        database: db.name || "unknown",
        readyState: db.readyState,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      connected: false,
      message: `MongoDB connection failed: ${errorMessage}`,
    };
  }
}

// Connection state helpers
export function getConnectionState() {
  const states: { [key: number]: string } = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState] || "unknown";
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
