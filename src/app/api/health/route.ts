import { NextResponse } from "next/server";
import dataset from "@/data/dataset.json";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "TrendPulse AI Analytics API",
    model_loaded: true,
    records_loaded: dataset.length,
    features: ["post_count", "likes", "shares", "engagement_rate"],
    algorithm: "IsolationForest",
    timestamp: new Date().toISOString(),
  });
}
