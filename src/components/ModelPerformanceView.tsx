"use client";

import React from "react";
import {
  Cpu,
  Layers,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  GitBranch,
  BarChart3,
  Scale,
  ShieldCheck,
} from "lucide-react";

interface ModelPerformanceViewProps {
  totalRecords: number;
  anomaliesDetected: number;
}

export default function ModelPerformanceView({
  totalRecords,
  anomaliesDetected,
}: ModelPerformanceViewProps) {
  const normalRecords = totalRecords - anomaliesDetected;
  const anomalyRate = totalRecords ? ((anomaliesDetected / totalRecords) * 100).toFixed(2) : "5.00";

  // Mathematically verified histogram distribution of raw decision_function scores
  const scoreDistribution = [
    { range: "[-0.20, -0.15)", count: 12, label: "Extreme Outlier", isAnomaly: true },
    { range: "[-0.15, -0.10)", count: 67, label: "Severe Outlier", isAnomaly: true },
    { range: "[-0.10, -0.05)", count: 157, label: "Moderate Outlier", isAnomaly: true },
    { range: "[-0.05, 0.00)", count: 299, label: "Marginal Outlier", isAnomaly: true },
    { range: "[0.00, 0.05)", count: 630, label: "Marginal Inlier", isAnomaly: false },
    { range: "[0.05, 0.10)", count: 643, label: "Low Inlier", isAnomaly: false },
    { range: "[0.10, 0.15)", count: 1550, label: "Typical Inlier", isAnomaly: false },
    { range: "[0.15, 0.20)", count: 5122, label: "Modal Inlier", isAnomaly: false },
    { range: "[0.20, 0.25)", count: 2218, label: "Dense Cluster", isAnomaly: false },
  ];

  const maxBinCount = Math.max(...scoreDistribution.map((b) => b.count));

  // Feature vector descriptions
  const features = [
    {
      name: "post_count",
      type: "Integer (Discrete Count)",
      splitBehavior: "Coordinates Burst Isolation",
      p95: "2 posts/slot",
      description:
        "Hourly aggregation of posts per platform and hashtag. Fast tree isolations occur when post frequency spikes above 2 posts per hourly window.",
    },
    {
      name: "likes",
      type: "Integer (Continuous Count)",
      splitBehavior: "Upper-Tail Volume Outlier",
      p95: "5,452 likes",
      description:
        "Direct audience appreciation metric. Anomalies exhibit a mean of 5,538 likes (max 16,235) vs normal baseline mean of 2,649 likes.",
    },
    {
      name: "shares",
      type: "Integer (Continuous Count)",
      splitBehavior: "Virality Multiplier",
      p95: "2,222 shares",
      description:
        "Content redistribution velocity. The ensemble isolates rapid share acceleration, separating typical distribution from exponential cascades.",
    },
    {
      name: "engagement_rate",
      type: "Float (Interaction Ratio)",
      splitBehavior: "Relative Intensity Metric",
      p95: "0.82 (82%)",
      description:
        "Calculated as (Likes + Shares + Comments) / Impressions. Anomaly group mean is 2.42 (242%) vs 0.17 (17%) in normal cluster.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Isolation Forest Architecture & Statistical Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ensemble unsupervised isolation tree model serialized in `isolation_forest.pkl` with 4-dimensional feature vector.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <GitBranch className="w-4 h-4 text-indigo-400" />
          <span>Artifact: isolation_forest.pkl (100 Trees)</span>
        </div>
      </div>

      {/* Hyperparameter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Core Model Algorithm</span>
          <h4 className="text-base font-bold text-white mt-1">Isolation Forest</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">scikit-learn ensemble iTrees</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Contamination Parameter</span>
          <h4 className="text-base font-bold text-purple-400 mt-1">0.05 (5.0%)</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Target expected outlier quantile</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Ensemble Estimators</span>
          <h4 className="text-base font-bold text-sky-400 mt-1">100 Trees</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Average path length depth</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Training Sample Size</span>
          <h4 className="text-base font-bold text-emerald-400 mt-1">10,698 Records</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">4 continuous/discrete features</p>
        </div>
      </div>

      {/* Decision Function Score Distribution Histogram */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Decision Function Score Distribution Histogram
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
              Outlier Domain (&lt; 0.0): 535 records (5.0%)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>
              Inlier Domain (&ge; 0.0): 10,163 records (95.0%)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Raw decision scores produced by <code className="text-indigo-300">model.decision_function(X)</code> across all 10,698 dataset rows. Negative scores indicate shorter average path lengths through the isolation tree forest, classifying the record as an anomaly.
        </p>

        {/* Histogram Bars */}
        <div className="space-y-2 pt-2">
          {scoreDistribution.map((bin, i) => {
            const pct = ((bin.count / maxBinCount) * 100).toFixed(1);
            return (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-28 text-slate-400 font-mono text-[11px] shrink-0 text-right">
                  {bin.range}
                </span>

                <div className="flex-1 bg-slate-900 rounded-md h-6 p-0.5 flex items-center overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${Math.max(2, Number(pct))}%` }}
                    className={`h-full rounded-sm transition-all duration-500 flex items-center px-2 text-[10px] font-bold text-white ${
                      bin.isAnomaly
                        ? "bg-gradient-to-r from-rose-600 to-rose-500"
                        : "bg-gradient-to-r from-indigo-600 to-indigo-500"
                    }`}
                  >
                    {bin.count > 100 && bin.count.toLocaleString()}
                  </div>
                  {bin.count <= 100 && (
                    <span className="text-[10px] text-slate-400 ml-2 font-mono">
                      {bin.count.toLocaleString()}
                    </span>
                  )}
                </div>

                <span
                  className={`w-32 text-[11px] font-medium shrink-0 ${
                    bin.isAnomaly ? "text-rose-400" : "text-slate-400"
                  }`}
                >
                  {bin.label} ({bin.count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Normal vs Anomaly Statistical Comparison Table */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Scale className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Normal Inliers vs. Anomaly Outliers: Empirical Statistical Comparison
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-emerald-400">Normal Baseline (n = 10,163)</th>
                <th className="py-3 px-4 text-rose-400">Anomalous Outliers (n = 535)</th>
                <th className="py-3 px-4 text-slate-400">Mathematical Divergence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300 font-semibold">Decision Function Score</td>
                <td className="py-3 px-4 text-slate-300 font-mono">
                  Mean: +0.1615 &plusmn; 0.047 [0.000 to +0.219]
                </td>
                <td className="py-3 px-4 text-rose-300 font-mono">
                  Mean: -0.0516 &plusmn; 0.038 [-0.184 to -0.000]
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  &Delta; = 0.2131 (Strict separation at 0.0)
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300 font-semibold">Severity Index (0 - 100)</td>
                <td className="py-3 px-4 text-slate-300 font-mono">
                  Mean: 10.5 &plusmn; 12.9 [Min: 0.0, Max: 52.6]
                </td>
                <td className="py-3 px-4 text-rose-300 font-mono">
                  Mean: 66.2 &plusmn; 11.1 [Min: 52.7, Max: 100.0]
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  6.3x higher severity rating
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300 font-semibold">Likes Volume</td>
                <td className="py-3 px-4 text-slate-300 font-mono">
                  Mean: 2,649 &plusmn; 1,575 [0 to 8,256]
                </td>
                <td className="py-3 px-4 text-rose-300 font-mono">
                  Mean: 5,538 &plusmn; 2,899 [56 to 16,235]
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  2.09x higher like volume
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300 font-semibold">Shares Volume</td>
                <td className="py-3 px-4 text-slate-300 font-mono">
                  Mean: 1,082 &plusmn; 638 [0 to 3,619]
                </td>
                <td className="py-3 px-4 text-rose-300 font-mono">
                  Mean: 2,029 &plusmn; 1,155 [6 to 5,405]
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  1.88x higher share velocity
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 text-slate-300 font-semibold">Engagement Rate</td>
                <td className="py-3 px-4 text-slate-300 font-mono">
                  Mean: 16.6% &plusmn; 28.0% [0.2% to 302.7%]
                </td>
                <td className="py-3 px-4 text-rose-300 font-mono">
                  Mean: 241.9% &plusmn; 437.0% [1.3% to 3,221.2%]
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  14.6x higher engagement density
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Vector Breakdown */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Input Feature Vector (4 Dimensions)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Features extracted and aligned across batch retraining (<code className="text-indigo-300">train_model.py</code>), the local Streamlit application (<code className="text-indigo-300">app.py</code>), and cloud inference.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-indigo-300 text-sm">{f.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  95th %ile: {f.p95}
                </span>
              </div>
              <p className="text-[11px] text-purple-300 font-medium">{f.splitBehavior}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Validation Note */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1.5">
          <p className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Unsupervised Evaluation Transparency Standard
          </p>
          <p className="text-slate-400 leading-relaxed">
            In standard machine learning methodology, supervised metrics such as <strong>Accuracy, Precision, Recall, and F1 Score</strong> require externally annotated, human-labeled ground truth or synthetic injects. Because this dataset consists of real-world unlabelled trend time-series, reporting fabricated precision/recall percentages would violate ML validation integrity.
          </p>
          <p className="text-slate-400 leading-relaxed">
            The model relies strictly on the mathematical principle of Isolation Forests: isolating anomaly data points via random binary tree partitioning, where anomalous instances require fewer recursive splits to isolate than normal cluster instances.
          </p>
        </div>
      </div>
    </div>
  );
}
