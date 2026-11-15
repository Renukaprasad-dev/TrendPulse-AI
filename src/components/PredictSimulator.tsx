"use client";

import React, { useState, useEffect } from "react";
import {
  PlayCircle,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Sparkles,
  RefreshCw,
  Info,
  Scale,
} from "lucide-react";

export default function PredictSimulator() {
  const [postCount, setPostCount] = useState<number>(1);
  const [likes, setLikes] = useState<number>(2400);
  const [shares, setShares] = useState<number>(950);
  const [engagementRate, setEngagementRate] = useState<number>(0.14);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const evaluateModel = async (
    pCount: number,
    pLikes: number,
    pShares: number,
    pEng: number
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_count: pCount,
          likes: pLikes,
          shares: pShares,
          engagement_rate: pEng,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Predict error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-populate evaluation immediately on mount so the card is never empty
  useEffect(() => {
    evaluateModel(1, 2400, 950, 0.14);
  }, []);

  const handlePredict = () => {
    evaluateModel(
      Number(postCount),
      Number(likes),
      Number(shares),
      Number(engagementRate)
    );
  };

  const handlePreset = (preset: "normal" | "viral" | "volume" | "extreme") => {
    let pC = 1;
    let lk = 2400;
    let sh = 950;
    let eg = 0.14;

    switch (preset) {
      case "normal":
        pC = 1;
        lk = 2400;
        sh = 950;
        eg = 0.14;
        break;
      case "viral":
        pC = 2;
        lk = 9500;
        sh = 3400;
        eg = 0.45;
        break;
      case "volume":
        pC = 4;
        lk = 2100;
        sh = 800;
        eg = 0.09;
        break;
      case "extreme":
        pC = 3;
        lk = 14500;
        sh = 5100;
        eg = 1.85;
        break;
    }

    setPostCount(pC);
    setLikes(lk);
    setShares(sh);
    setEngagementRate(eg);
    evaluateModel(pC, lk, sh, eg);
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Presets:</span>
          <button
            onClick={() => handlePreset("normal")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
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
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Input Feature Parameters</h3>
            </div>
            <span className="text-[11px] text-slate-400">Sliders & Direct Inputs</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Post Count */}
            <div>
              <div className="flex justify-between items-center text-slate-300 font-semibold mb-1.5">
                <span>Post Count (`post_count`):</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={postCount}
                  onChange={(e) => setPostCount(Number(e.target.value))}
                  className="w-20 px-2 py-0.5 text-right font-mono bg-slate-900 border border-slate-700 rounded text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
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
              <span className="text-[10px] text-slate-500">Historical range: 1 to 4 | 95th %ile: 2 posts/hr</span>
            </div>

            {/* Likes */}
            <div>
              <div className="flex justify-between items-center text-slate-300 font-semibold mb-1.5">
                <span>Likes Volume (`likes`):</span>
                <input
                  type="number"
                  min={0}
                  max={18000}
                  step={100}
                  value={likes}
                  onChange={(e) => setLikes(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 text-right font-mono bg-slate-900 border border-slate-700 rounded text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
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
              <span className="text-[10px] text-slate-500">Historical range: 0 to 16,235 | 95th %ile: 5,452 likes</span>
            </div>

            {/* Shares */}
            <div>
              <div className="flex justify-between items-center text-slate-300 font-semibold mb-1.5">
                <span>Shares Volume (`shares`):</span>
                <input
                  type="number"
                  min={0}
                  max={6000}
                  step={50}
                  value={shares}
                  onChange={(e) => setShares(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 text-right font-mono bg-slate-900 border border-slate-700 rounded text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
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
              <span className="text-[10px] text-slate-500">Historical range: 0 to 5,405 | 95th %ile: 2,222 shares</span>
            </div>

            {/* Engagement Rate */}
            <div>
              <div className="flex justify-between items-center text-slate-300 font-semibold mb-1.5">
                <span>Engagement Rate (`engagement_rate`):</span>
                <input
                  type="number"
                  min={0.001}
                  max={5.0}
                  step={0.01}
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(Number(e.target.value))}
                  className="w-20 px-2 py-0.5 text-right font-mono bg-slate-900 border border-slate-700 rounded text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <input
                type="range"
                min={0.001}
                max={3.0}
                step={0.01}
                value={engagementRate}
                onChange={(e) => setEngagementRate(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Ratio: {(engagementRate * 100).toFixed(1)}%</span>
                <span>95th %ile: 82.0% (0.82)</span>
              </div>
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
                        Prediction Classification
                      </p>
                      <h4 className="text-xl font-black text-white">
                        {result.prediction_class || (result.is_anomaly ? "Outlier Class (-1)" : "Inlier Class (+1)")}
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
                    <p className={`font-mono text-sm font-bold mt-1 ${result.is_anomaly ? "text-rose-400" : "text-emerald-400"}`}>
                      {result.decision_score > 0 ? `+${result.decision_score}` : result.decision_score}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Boundary: 0.0000 (&lt;0 = Anomaly, &ge;0 = Normal)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Ensemble Depth</span>
                    <p className="font-mono text-sm font-bold text-white mt-1">
                      100 iTrees
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Contamination = 5.0%
                    </span>
                  </div>
                </div>

                {/* Severity Calculation Documentation */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Scale className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Severity Formula:</span>
                  </div>
                  <p className="font-mono text-[11px] text-purple-300">
                    Severity = clamp(0, 100, Math.round(((0.20 - decision_score) / 0.38) * 100))
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Maps normal modal inliers (+0.20) to 0 and extreme outliers (-0.18) to 100.
                  </p>
                </div>

                {/* Empirical Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <p className="font-semibold text-slate-300 mb-1">Empirical Explanation:</p>
                  <p className="text-slate-400 leading-relaxed">{result.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                <RefreshCw className="w-8 h-8 text-slate-600 mb-2 animate-spin" />
                <p className="text-xs font-medium text-slate-400">Evaluating baseline...</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Isolation Forest v1.0 • 4 Features</span>
            <span className="text-indigo-400 font-mono">POST /api/predict</span>
          </div>
        </div>
      </div>
    </div>
  );
}
