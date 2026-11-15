"use client";

import React, { useState } from "react";
import {
  Database,
  AlertTriangle,
  CheckCircle2,
  Percent,
  TrendingUp,
  Flame,
  Info,
} from "lucide-react";

interface KpiCardsProps {
  totalRecords: number;
  anomaliesCount: number;
  normalCount: number;
  anomalyRatePct: number;
  avgEngagement: number;
  totalInteractions: number;
}

export default function KpiCards({
  totalRecords,
  anomaliesCount,
  normalCount,
  anomalyRatePct,
  avgEngagement,
  totalInteractions,
}: KpiCardsProps) {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  const cards = [
    {
      title: "Total Tracked Data Points",
      value: totalRecords.toLocaleString(),
      subtext: "Filtered social records in view",
      badge: "Full Dataset",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      icon: Database,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Total Anomalies Detected",
      value: anomaliesCount.toLocaleString(),
      subtext: "Verified Isolation Forest outliers (-1)",
      badge: `${anomalyRatePct.toFixed(1)}% Outlier Ratio`,
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Normal Records",
      value: normalCount.toLocaleString(),
      subtext: "Expected trend baseline (+1)",
      badge: "Inlier Baseline",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Anomaly Rate (%)",
      value: `${anomalyRatePct.toFixed(2)}%`,
      subtext: "Calibrated contamination quantile",
      badge: "5.0% Hyperparameter",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: Percent,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Average Engagement",
      value: `${(avgEngagement * 100).toFixed(1)}%`,
      subtext: "(Likes + Shares + Comments) / Impressions",
      badge: "Multi-Action Ratio",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: TrendingUp,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      hasFormula: true,
    },
    {
      title: "Total Interactions",
      value:
        totalInteractions > 1000000
          ? `${(totalInteractions / 1000000).toFixed(2)}M`
          : totalInteractions > 1000
          ? `${(totalInteractions / 1000).toFixed(1)}K`
          : totalInteractions.toString(),
      subtext: "Cumulative Likes, Shares, Comments",
      badge: "Engagement Sum",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      icon: Flame,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] hover:border-indigo-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.iconBg}`}
                  >
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-slate-400 font-medium truncate">{card.title}</p>
                  {card.hasFormula && (
                    <button
                      onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
                      className="text-amber-400/80 hover:text-amber-300 transition"
                      title="View mathematical formula validation"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                  {card.value}
                </h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <p className="text-[11px] text-slate-500 leading-tight font-mono">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Mathematical Formula Notice */}
      {showFormulaTooltip && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-3 transition">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              Mathematical Validation: Engagement Rate = (Likes + Shares + Comments) / Impressions
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              In social media analytics, individual viewers can perform multiple distinct actions (e.g. liking, commenting, and sharing) on a single post impression. Consequently, viral anomalies legitimately produce interaction ratios exceeding 1.0 (100%), with the highest observed outlier at 32.21 (3,221%). These values are mathematically authentic and are deliberately preserved without artificial capping.
            </p>
          </div>
          <button
            onClick={() => setShowFormulaTooltip(false)}
            className="text-slate-400 hover:text-white ml-auto text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
