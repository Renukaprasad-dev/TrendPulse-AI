import { NextRequest, NextResponse } from "next/server";
import dataset from "@/data/dataset.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const hashtag = searchParams.get("hashtag");

  let filtered = dataset;
  if (platform && platform !== "All") {
    filtered = filtered.filter((d) => d.platform === platform);
  }
  if (hashtag && hashtag !== "All") {
    filtered = filtered.filter((d) => d.hashtag === hashtag);
  }

  const total = filtered.length;
  const anomalies = filtered.filter((d) => d.is_anomaly).length;
  const normal = total - anomalies;
  const rate = total ? Number(((anomalies / total) * 100).toFixed(2)) : 0;
  
  const avgEng = total
    ? Number((filtered.reduce((acc, d) => acc + d.engagement_rate, 0) / total).toFixed(3))
    : 0;
  const totalPosts = filtered.reduce((acc, d) => acc + d.post_count, 0);
  const totalLikes = filtered.reduce((acc, d) => acc + d.likes, 0);
  const totalShares = filtered.reduce((acc, d) => acc + d.shares, 0);
  const totalComments = filtered.reduce((acc, d) => acc + d.comments, 0);

  const platformsAvailable = Array.from(new Set(dataset.map((d) => d.platform))).sort();
  const hashtagsAvailable = Array.from(new Set(filtered.map((d) => d.hashtag))).sort();

  return NextResponse.json({
    total_records: total,
    anomalies_count: anomalies,
    normal_count: normal,
    anomaly_rate_pct: rate,
    avg_engagement_rate: avgEng,
    total_posts: totalPosts,
    total_likes: totalLikes,
    total_shares: totalShares,
    total_interactions: totalLikes + totalShares + totalComments,
    platforms_available: platformsAvailable,
    hashtags_available: hashtagsAvailable,
  });
}
