"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Activity,
  Layers,
  Hash,
  Calendar,
  Calculator,
  Info,
} from "lucide-react";

interface TopNavProps {
  title: string;
  subtitle: string;
  platforms: string[];
  selectedPlatform: string;
  setSelectedPlatform: (p: string) => void;
  hashtags: string[];
  selectedHashtag: string;
  setSelectedHashtag: (h: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  startDate?: string;
  setStartDate?: (d: string) => void;
  endDate?: string;
  setEndDate?: (d: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  collapsed: boolean;
}

export default function TopNav({
  title,
  subtitle,
  platforms,
  selectedPlatform,
  setSelectedPlatform,
  hashtags,
  selectedHashtag,
  setSelectedHashtag,
  statusFilter,
  setStatusFilter,
  startDate = "",
  setStartDate,
  endDate = "",
  setEndDate,
  searchQuery,
  setSearchQuery,
  onRefresh,
  onExport,
  collapsed,
}: TopNavProps) {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  return (
    <header
      className={`sticky top-0 z-30 h-auto min-h-16 border-b border-[#1a2336] bg-[#090d18]/90 backdrop-blur-xl transition-all duration-300 px-6 py-3 flex flex-wrap items-center justify-between gap-4 ${
        collapsed ? "ml-20" : "ml-64"
      }`}
    >
      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags, platforms..."
            className="w-40 sm:w-52 h-9 pl-9 pr-3 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 h-9">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            <option value="All" className="bg-slate-900 text-white">All Platforms (10,698)</option>
            {platforms.map((p) => (
              <option key={p} value={p} className="bg-slate-900 text-white">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Hashtag Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 h-9">
          <Hash className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={selectedHashtag}
            onChange={(e) => setSelectedHashtag(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer max-w-[130px] truncate"
          >
            <option value="All" className="bg-slate-900 text-white">All Hashtags</option>
            {hashtags.map((h) => (
              <option key={h} value={h} className="bg-slate-900 text-white truncate">
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        {setStartDate && setEndDate && (
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 h-9 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="date"
              value={startDate}
              min="2024-05-01"
              max="2025-04-30"
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none w-28 [color-scheme:dark]"
              title="Start Date"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={endDate}
              min="2024-05-01"
              max="2025-04-30"
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none w-28 [color-scheme:dark]"
              title="End Date"
            />
          </div>
        )}

        {/* Engagement Formula Badge */}
        <button
          onClick={() => setShowFormulaModal(!showFormulaModal)}
          className="flex items-center gap-1 px-2.5 h-9 text-[11px] font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition"
          title="Engagement Formula: (Likes + Shares + Comments) / Impressions"
        >
          <Calculator className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline font-mono">Eng. Formula</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
            title="Refresh Analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 h-9 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-xl shadow-md shadow-indigo-600/20 transition"
            title="Export Records CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Formula Modal / Popover */}
      {showFormulaModal && (
        <div className="w-full mt-2 p-3.5 rounded-xl bg-slate-900/95 border border-amber-500/30 text-xs text-slate-300 flex items-start justify-between gap-3 shadow-2xl">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">
                Engagement Rate Formula Verification:
              </span>
              <p className="font-mono text-amber-300 text-[11px]">
                Engagement Rate = (Likes + Shares + Comments) / Impressions
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                438 records exceed 1.0 (100%) because single viewers generate multiple discrete actions (e.g. liking AND sharing AND commenting). This interaction-to-impression ratio is preserved accurately across all dashboard views without artificial clipping.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFormulaModal(false)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 text-[11px]"
          >
            Close
          </button>
        </div>
      )}
    </header>
  );
}
