"use client";

import React from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Activity,
  Layers,
  Hash,
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
  searchQuery,
  setSearchQuery,
  onRefresh,
  onExport,
  collapsed,
}: TopNavProps) {
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
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags, platforms, reasons..."
            className="w-48 sm:w-60 h-9 pl-9 pr-3 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
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
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer max-w-[140px] truncate"
          >
            <option value="All" className="bg-slate-900 text-white">All Hashtags</option>
            {hashtags.map((h) => (
              <option key={h} value={h} className="bg-slate-900 text-white truncate">
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 h-9">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Records</option>
            <option value="anomalies" className="bg-slate-900 text-white">Anomalies Only</option>
            <option value="normal" className="bg-slate-900 text-white">Normal Only</option>
          </select>
        </div>

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
            title="Export Anomalies CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
}
