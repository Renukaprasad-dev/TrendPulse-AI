"use client";

import React from "react";
import {
  Lightbulb,
  AlertTriangle,
  Info,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Layers,
  Database,
  Calculator,
  Activity,
  CheckCircle,
} from "lucide-react";

export interface InsightItem {
  id: string;
  finding: string;
  affectedPlatform: string;
  affectedRecords: number;
  relevantMetric: string;
  evidence: string;
  recommendedAction: string;
  priority: "high" | "warning" | "info";
  category: string;
}

interface InsightsViewProps {
  insights: InsightItem[];
}

export default function InsightsView({ insights }: InsightsViewProps) {
  const getPriorityStyle = (priority: "high" | "warning" | "info") => {
    switch (priority) {
      case "high":
        return {
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          icon: AlertTriangle,
          border: "border-l-4 border-l-rose-500",
        };
      case "warning":
        return {
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: TrendingUp,
          border: "border-l-4 border-l-amber-500",
        };
      default:
        return {
          badge: "bg-sky-500/10 text-sky-400 border-sky-500/30",
          icon: Info,
          border: "border-l-4 border-l-sky-500",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900/50 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Actionable Intelligence & Strategic Recommendations
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Every insight below is derived from empirical Isolation Forest partition statistics, feature density variations, and verified temporal anomaly records across the 10,698 row dataset.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Empirically Backed Data Evidence</span>
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((item) => {
          const style = getPriorityStyle(item.priority);
          const Icon = style.icon;

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] ${style.border} shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${style.badge}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.priority} Priority
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono capitalize">
                    {item.category}
                  </span>
                </div>

                {/* 1. Finding */}
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {item.finding}
                </h3>
              </div>

              {/* Empirical Evidence Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-xs py-2 border-y border-slate-800/80">
                {/* 2. Affected Platform */}
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    Platform
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                    {item.affectedPlatform}
                  </span>
                </div>

                {/* 3. Number of Affected Records */}
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    Affected Records
                  </span>
                  <span className="font-mono font-bold text-rose-400 mt-0.5 block">
                    {item.affectedRecords.toLocaleString()} rows
                  </span>
                </div>

                {/* 4. Relevant Metric */}
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    Primary Metric
                  </span>
                  <span className="font-mono text-indigo-300 mt-0.5 block truncate">
                    {item.relevantMetric}
                  </span>
                </div>
              </div>

              {/* 5. Evidence or Calculation */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Calculator className="w-3 h-3 text-indigo-400" />
                  Evidence &amp; Calculation:
                </span>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                  {item.evidence}
                </p>
              </div>

              {/* 6. Recommended Action */}
              <div className="pt-2">
                <div className="flex items-start gap-2 text-xs">
                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-400 block mb-0.5">
                      Recommended Action:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {item.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
