"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Scatter,
} from "recharts";
import {
  TrendingUp,
  Activity,
  Layers,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
} from "lucide-react";

interface TrendChartsProps {
  trendData: Array<{
    date: string;
    post_count: number;
    likes: number;
    shares: number;
    engagement_rate: number;
    is_anomaly: number;
  }>;
  platformDistribution: Array<{ name: string; total: number; anomalies: number }>;
  anomalyBreakdown: Array<{ name: string; value: number; color: string }>;
  topHashtags: Array<{ hashtag: string; count: number; anomalies: number }>;
}

export default function TrendCharts({
  trendData,
  platformDistribution,
  anomalyBreakdown,
  topHashtags,
}: TrendChartsProps) {
  const [activeChartTab, setActiveChartTab] = useState<"volume" | "engagement" | "interactions">("volume");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-semibold text-white">
                {typeof entry.value === "number" && entry.name.toLowerCase().includes("rate")
                  ? `${(entry.value * 100).toFixed(1)}%`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Primary Timeline Chart with Tab Switcher */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Timeline Trend Dynamics & Anomaly Markers
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Historical multi-platform activity tracking with Isolation Forest outlier alerts
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveChartTab("volume")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeChartTab === "volume"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Post Volume
            </button>
            <button
              onClick={() => setActiveChartTab("engagement")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeChartTab === "engagement"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Engagement Rate
            </button>
            <button
              onClick={() => setActiveChartTab("interactions")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeChartTab === "interactions"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Likes vs Shares
            </button>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === "volume" ? (
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#f43f5e"
                  tick={{ fontSize: 11 }}
                  domain={[0, "auto"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="post_count"
                  name="Post Count"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="is_anomaly"
                  name="Detected Anomalies"
                  fill="#f43f5e"
                  opacity={0.8}
                  barSize={8}
                />
              </ComposedChart>
            ) : activeChartTab === "engagement" ? (
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="engagement_rate"
                  name="Engagement Rate"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            ) : (
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="likes"
                  name="Likes Volume"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  name="Shares Volume"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Platform-wise Anomaly Comparison */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Platform Distribution</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Total vs Outliers</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Comparing anomaly volume across social networks
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="total" name="Total Records" fill="#475569" radius={[0, 4, 4, 0]} />
                <Bar dataKey="anomalies" name="Anomalies" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Normal vs Anomalous Donut */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Anomaly Ratio</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Model Output</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Proportion of inliers (+1) versus isolated anomalies (-1)
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={anomalyBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {anomalyBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-10px]">
              <span className="text-2xl font-black text-white">5.0%</span>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Outliers
              </span>
            </div>
          </div>
        </div>

        {/* 3. Top Anomalous Hashtags */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Top Outlier Topics</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">By Anomaly Count</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Hashtags experiencing the most irregular engagement & velocity
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topHashtags}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="hashtag"
                  stroke="#64748b"
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={50}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="anomalies" name="Anomaly Count" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
