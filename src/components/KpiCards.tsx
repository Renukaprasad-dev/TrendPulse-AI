"use client";

import React from "react";
import {
  Database,
  AlertTriangle,
  CheckCircle2,
  Percent,
  TrendingUp,
  Flame,
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
  const cards = [
    {
      title: "Total Tracked Data Points",
      value: totalRecords.toLocaleString(),
      subtext: "Filtered social media records in view",
      badge: "Real-time Dataset",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      icon: Database,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Total Anomalies Detected",
      value: anomaliesCount.toLocaleString(),
      subtext: "Isolation Forest outlier classification (-1)",
      badge: `${anomalyRatePct.toFixed(1)}% Outlier Ratio`,
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Normal Records",
      value: normalCount.toLocaleString(),
      subtext: "Expected trend distribution baseline (+1)",
      badge: "Inlier Baseline",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Anomaly Rate (%)",
      value: `${anomalyRatePct.toFixed(2)}%`,
      subtext: "Contamination hyperparameter calibrated to 5.0%",
      badge: "Configured Rate",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: Percent,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Average Engagement",
      value: `${(avgEngagement * 100).toFixed(1)}%`,
      subtext: "Mean interaction rate normalized across views",
      badge: "Engagement Ratio",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: TrendingUp,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Total Interactions",
      value: totalInteractions > 1000000 
        ? `${(totalInteractions / 1000000).toFixed(2)}M` 
        : totalInteractions > 1000 
        ? `${(totalInteractions / 1000).toFixed(1)}K` 
        : totalInteractions.toString(),
      subtext: "Aggregated Likes, Shares and Comments",
      badge: "High Volume",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      icon: Flame,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] hover:border-indigo-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between"
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

              <p className="text-xs text-slate-400 font-medium truncate">{card.title}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                {card.value}
              </h3>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-800/60 leading-relaxed">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
