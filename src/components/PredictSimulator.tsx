"use client";

import React, { useState } from "react";
import {
  PlayCircle,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function PredictSimulator() {
  const [postCount, setPostCount] = useState<number>(3);
  const [likes, setLikes] = useState<number>(4500);
  const [shares, setShares] = useState<number>(1800);
  const [engagementRate, setEngagementRate] = useState<number>(0.15);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_count: Number(postCount),
          likes: Number(likes),
          shares: Number(shares),
          engagement_rate: Number(engagementRate),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: "normal" | "viral" | "volume" | "extreme") => {
    switch (preset) {
      case "normal":
        setPostCount(1);
        setLikes(250);
        setShares(80);
        setEngagementRate(0.04);
        break;
      case "viral":
        setPostCount(2);
        setLikes(8500);
        setShares(3200);
        setEngagementRate(0.45);
        break;
      case "volume":
        setPostCount(4);
        setLikes(1200);
        setShares(400);
        setEngagementRate(0.08);
        break;
      case "extreme":
        setPostCount(3);
        setLikes(14000);
        setShares(4800);
        setEngagementRate(0.92);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Real-time Isolation Forest Anomaly Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test custom social media engagement vectors against the trained ensemble model in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Presets:</span>
          <button
            onClick={() => handlePreset("normal")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            Normal Baseline
          </button>
          <button
            onClick={() => handlePreset("viral")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition"
          >
            Viral Spike
          </button>
          <button
            onClick={() => handlePreset("volume")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 hover:bg-sky-500/20 transition"
          >
            Post Burst
          </button>
          <button
            onClick={() => handlePreset("extreme")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition"
          >
            Extreme Outlier
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Input Feature Parameters</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Post Count */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                <span>Post Count (`post_count`):</span>
                <span className="font-mono text-indigo-400">{postCount}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={postCount}
                onChange={(e) => setPostCount(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Historical range: 1 to 4 posts/slot</span>
            </div>

            {/* Likes */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                <span>Likes Volume (`likes`):</span>
                <span className="font-mono text-indigo-400">{likes.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={18000}
                step={100}
                value={likes}
                onChange={(e) => setLikes(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Historical range: 0 to 16,235 likes</span>
            </div>

            {/* Shares */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                <span>Shares Volume (`shares`):</span>
                <span className="font-mono text-indigo-400">{shares.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={6000}
                step={50}
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Historical range: 0 to 5,405 shares</span>
            </div>

            {/* Engagement Rate */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                <span>Engagement Rate (`engagement_rate`):</span>
                <span className="font-mono text-indigo-400">{(engagementRate * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0.001}
                max={1.5}
                step={0.01}
                value={engagementRate}
                onChange={(e) => setEngagementRate(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Historical range: 0.2% to 32.2%</span>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full h-10 mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 font-semibold text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate with Isolation Forest</span>
              </>
            )}
          </button>
        </div>

        {/* Prediction Output Card */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Inference Engine Evaluation</h3>
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Status Badge */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    result.is_anomaly
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.is_anomaly ? (
                      <AlertTriangle className="w-7 h-7 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider">
                        Classification Result
                      </p>
                      <h4 className="text-xl font-black text-white">
                        {result.anomaly_status} ({result.prediction})
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">
                      Severity Score
                    </span>
                    <span className="text-2xl font-black text-white">
                      {result.anomaly_score} / 100
                    </span>
                  </div>
                </div>

                {/* Score telemetry */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Raw Decision Score</span>
                    <p className="font-mono text-sm font-bold text-white mt-1">
                      {result.decision_score}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Negative = Outlier, Positive = Inlier
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Ensemble Consensus</span>
                    <p className="font-mono text-sm font-bold text-white mt-1">
                      100 iTrees
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Contamination = 5.0%
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <p className="font-semibold text-slate-300 mb-1">Causal Explanation:</p>
                  <p className="text-slate-400 leading-relaxed">{result.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                <Sliders className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs font-medium text-slate-400">No active evaluation</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Adjust the sliders on the left and click &quot;Evaluate with Isolation Forest&quot; or select one of the quick presets above.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Isolation Forest v1.0 • joblib binary</span>
            <span className="text-indigo-400 font-mono">POST /api/predict</span>
          </div>
        </div>
      </div>
    </div>
  );
}
