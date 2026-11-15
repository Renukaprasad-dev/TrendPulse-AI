"use client";

import React from "react";
import {
  Lightbulb,
  AlertTriangle,
  Info,
  TrendingUp,
  Share2,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface InsightItem {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  impact: string;
}

interface InsightsViewProps {
  insights: InsightItem[];
}

export default function InsightsView({ insights }: InsightsViewProps) {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "high":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          icon: AlertTriangle,
          border: "border-l-4 border-l-rose-500",
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: TrendingUp,
          border: "border-l-4 border-l-amber-500",
        };
      default:
        return {
          bg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
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
            Derived directly from mathematical isolation forest split statistics, feature density
            variations, and temporal social media anomalies.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Real Data-Backed Analytics</span>
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const config = getSeverityBadge(item.severity);
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] ${config.border} shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${config.bg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.severity} Priority
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono capitalize">
                    {item.type}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <p className="text-[11px] text-slate-400 flex items-start gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Operational Recommendation:</strong>{" "}
                    {item.impact}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
