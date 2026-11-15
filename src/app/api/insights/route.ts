import { NextRequest, NextResponse } from "next/server";
import dataset from "@/data/dataset.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");

  let filtered = dataset;
  if (platform && platform !== "All") {
    filtered = filtered.filter((d) => d.platform === platform);
  }

  const anomalies = filtered.filter((d) => d.is_anomaly);
  const totalAnomalies = anomalies.length;

  // Platform breakdown
  const platformCounts: { [p: string]: number } = {};
  for (const a of anomalies) {
    platformCounts[a.platform] = (platformCounts[a.platform] || 0) + 1;
  }
  const topPlatformEntry = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];

  // Post volume surges
  const volumeSpikes = anomalies.filter((a) => a.post_count > 2).length;

  // Engagement surges
  const extremeEngagement = anomalies.filter((a) => a.engagement_rate > 0.8).length;

  // Viral shares
  const viralShares = anomalies.filter((a) => a.shares > 2000).length;

  // Hashtag clusters
  const hashtagCounts: { [h: string]: number } = {};
  for (const a of anomalies) {
    hashtagCounts[a.hashtag] = (hashtagCounts[a.hashtag] || 0) + 1;
  }
  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => `${tag} (${count})`)
    .join(", ");

  const insights = [
    {
      id: "platform-concentration",
      type: "platform",
      title: topPlatformEntry
        ? `Platform Outlier Concentration: ${topPlatformEntry[0]}`
        : "Platform Outliers",
      description: topPlatformEntry
        ? `${topPlatformEntry[0]} accounts for ${topPlatformEntry[1]} anomalies (${((topPlatformEntry[1] / totalAnomalies) * 100).toFixed(1)}% of all anomalous patterns in this view).`
        : "No significant platform clustering.",
      severity: "high",
      impact: "Critical attention required for automated content monitoring on this channel.",
    },
    {
      id: "engagement-surges",
      type: "engagement",
      title: "Super-Spike Engagement Rates Detected",
      description: `${extremeEngagement} events recorded engagement rates exceeding 80.0%, diverging significantly beyond Gaussian 3-sigma expectations.`,
      severity: "warning",
      impact: "Likely driven by organic influencer reposts, controversial breaking news, or bot surges.",
    },
    {
      id: "volume-bursts",
      type: "volume",
      title: "Coordinated Post Velocity Anomaly",
      description: `${volumeSpikes} time slots registered high concurrent post counts (>2 posts/hr per entity), indicating scheduled PR blitzes or coordinated amplification.`,
      severity: "info",
      impact: "Validate against planned marketing calendars to eliminate false-positive operational noise.",
    },
    {
      id: "viral-spread",
      type: "viral",
      title: "High Redistribution Velocity",
      description: `${viralShares} anomalies exhibited shares exceeding 2,000 units, signifying runaway virality well above standard cohort baselines.`,
      severity: "warning",
      impact: "High brand exposure velocity requiring active social listening and sentiment oversight.",
    },
    {
      id: "hashtag-clustering",
      type: "content",
      title: "Top Anomalous Hashtag Clusters",
      description: `Primary anomalous tags: ${topHashtags || "N/A"}. These hashtags drive the largest variance in isolation tree splits.`,
      severity: "info",
      impact: "Track these topics in trend dashboards for early risk and opportunity identification.",
    },
  ];

  return NextResponse.json(insights);
}
