import { NextRequest, NextResponse } from "next/server";
import dataset from "@/data/dataset.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const hashtag = searchParams.get("hashtag");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();
  const limit = Number(searchParams.get("limit") || "100");
  const page = Number(searchParams.get("page") || "1");

  let filtered = dataset;
  if (status === "anomalies_only") {
    filtered = filtered.filter((d) => d.is_anomaly);
  } else if (status === "normal_only") {
    filtered = filtered.filter((d) => !d.is_anomaly);
  } else {
    // default to anomalies first
    filtered = filtered.filter((d) => d.is_anomaly);
  }

  if (platform && platform !== "All") {
    filtered = filtered.filter((d) => d.platform === platform);
  }
  if (hashtag && hashtag !== "All") {
    filtered = filtered.filter((d) => d.hashtag === hashtag);
  }
  if (search) {
    filtered = filtered.filter(
      (d) =>
        d.platform.toLowerCase().includes(search) ||
        d.hashtag.toLowerCase().includes(search) ||
        d.reason.toLowerCase().includes(search) ||
        d.date.includes(search)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    records: paginated,
  });
}
