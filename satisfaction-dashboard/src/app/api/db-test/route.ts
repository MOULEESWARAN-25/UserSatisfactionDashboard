import { NextResponse } from "next/server";
import { testConnection, getConnectionState } from "@/lib/mongodb";
import { USE_MOCK_DATA } from "@/lib/mock-data";

export async function GET() {
  // If using mock data, return a simulated response
  if (USE_MOCK_DATA) {
    return NextResponse.json({
      connected: true,
      message: "Using mock data - MongoDB connection not required",
      mockMode: true,
      details: {
        host: "mock",
        database: "satisfaction_dashboard",
        readyState: 1,
      },
    });
  }

  try {
    const result = await testConnection();
    return NextResponse.json({
      ...result,
      mockMode: false,
      connectionState: getConnectionState(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        connected: false,
        message: `Connection test failed: ${errorMessage}`,
        mockMode: false,
      },
      { status: 500 }
    );
  }
}
