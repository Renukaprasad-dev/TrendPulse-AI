import { NextResponse } from "next/server";
import dataset from "@/data/dataset.json";

export async function GET() {
  const total = dataset.length;
  const anomalies = dataset.filter((d) => d.is_anomaly).length;

  return NextResponse.json({
    algorithm: "Isolation Forest (Ensemble Outlier Detection)",
    framework: "scikit-learn 1.9.1",
    n_estimators: 100,
    contamination: 0.05,
    max_samples: "auto",
    random_state: 42,
    features: [
      { name: "post_count", type: "int", description: "Frequency of posts in tracking window" },
      { name: "likes", type: "int", description: "Cumulative like volume" },
      { name: "shares", type: "int", description: "Content redistribution count" },
      { name: "engagement_rate", type: "float", description: "Interactions normalized by audience size" },
    ],
    training_dataset: "processed_trend_data.csv",
    total_records: total,
    anomalies_detected: anomalies,
    anomaly_rate_pct: Number(((anomalies / total) * 100).toFixed(2)),
    normal_records: total - anomalies,
    metrics: {
      type: "Unsupervised Anomaly Detection",
      note: "Standard precision/recall metrics require verified ground-truth labels. Isolation Forest relies on statistical isolation path lengths.",
    },
  });
}
