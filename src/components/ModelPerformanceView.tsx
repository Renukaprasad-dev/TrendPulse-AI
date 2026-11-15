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
  const anomalyRate = totalRecords ? ((anomaliesDetected / totalRecords) * 100).toFixed(2) : "0.00";

  const features = [
    {
      name: "post_count",
      type: "Integer (Count)",
      importance: "High Split Impact",
      description: "Hourly aggregation of posts per platform and hashtag. Detects coordination bursts.",
    },
    {
      name: "likes",
      type: "Integer (Count)",
      importance: "Primary Interaction",
      description: "Direct user approval signals. Outliers reflect extreme resonance or artificial boosting.",
    },
    {
      name: "shares",
      type: "Integer (Count)",
      importance: "Viral Multiplier",
      description: "Content redistribution velocity. Highest correlation with rapid trend propagation.",
    },
    {
      name: "engagement_rate",
      type: "Float (Ratio)",
      importance: "Normalized Metric",
      description: "Total engagements divided by reach. Prevents raw-volume skew on large accounts.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Machine Learning Model Architecture & Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scikit-learn Isolation Forest ensemble trained and serialized in joblib format
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <GitBranch className="w-4 h-4 text-indigo-400" />
          <span>Artifact: isolation_forest.pkl</span>
        </div>
      </div>

      {/* Grid of Hyperparameters & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Core Algorithm</p>
          <h4 className="text-base font-bold text-white mt-1">Isolation Forest</h4>
          <p className="text-[11px] text-slate-500 mt-1">iTree Recursive Binary Partitions</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Contamination Rate</p>
          <h4 className="text-base font-bold text-purple-400 mt-1">0.05 (5.0%)</h4>
          <p className="text-[11px] text-slate-500 mt-1">Calibrated decision threshold</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Number of Estimators</p>
          <h4 className="text-base font-bold text-sky-400 mt-1">100 Trees</h4>
          <p className="text-[11px] text-slate-500 mt-1">Ensemble averaging depth</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Random State Seed</p>
          <h4 className="text-base font-bold text-emerald-400 mt-1">42 (Reproducible)</h4>
          <p className="text-[11px] text-slate-500 mt-1">Deterministic split consistency</p>
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
          Consistent across batch training (`train_model.py`), CLI execution (`app.py`), and real-time dashboard scoring (`dashboard.py`).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-indigo-300 text-sm">{f.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {f.importance}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Validation Note */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-bold text-white">Unsupervised Learning Transparency Standard</p>
          <p className="text-slate-400 leading-relaxed">
            Because social media trend tracking in this project uses unsupervised outlier detection without synthetic or human-annotated ground-truth labels, supervised metrics (Precision, Recall, F1 Score) cannot be scientifically stated without fabrication. The model relies strictly on statistical path lengths through the isolation tree ensemble.
          </p>
        </div>
      </div>
    </div>
  );
}
