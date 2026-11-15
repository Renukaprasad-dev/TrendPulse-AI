import { NextRequest, NextResponse } from "next/server";
import dataset from "@/data/dataset.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const hashtag = searchParams.get("hashtag");
  const limit = Number(searchParams.get("limit") || "60");

  let filtered = dataset;
  if (platform && platform !== "All") {
    filtered = filtered.filter((d) => d.platform === platform);
  }
  if (hashtag && hashtag !== "All") {
    filtered = filtered.filter((d) => d.hashtag === hashtag);
  }

  // Aggregate by date
  const dateMap: {
    [date: string]: {
      date: string;
      post_count: number;
      likes: number;
      shares: number;
      engagement_sum: number;
      count: number;
      anomalies: number;
    };
  } = {};

  for (const d of filtered) {
    if (!dateMap[d.date]) {
      dateMap[d.date] = {
        date: d.date,
        post_count: 0,
        likes: 0,
        shares: 0,
        engagement_sum: 0,
        count: 0,
        anomalies: 0,
      };
    }
    dateMap[d.date].post_count += d.post_count;
    dateMap[d.date].likes += d.likes;
    dateMap[d.date].shares += d.shares;
    dateMap[d.date].engagement_sum += d.engagement_rate;
    dateMap[d.date].count += 1;
    if (d.is_anomaly) dateMap[d.date].anomalies += 1;
  }

  const trends = Object.values(dateMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit)
    .map((item) => ({
      date: item.date,
      post_count: item.post_count,
      likes: item.likes,
      shares: item.shares,
      engagement_rate: Number((item.engagement_sum / item.count).toFixed(4)),
      is_anomaly: item.anomalies,
    }));

  return NextResponse.json(trends);
}
