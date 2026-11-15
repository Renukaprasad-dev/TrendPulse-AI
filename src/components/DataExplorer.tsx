"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Layers,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export interface RecordItem {
  id: number;
  date: string;
  platform: string;
  hashtag: string;
  post_count: number;
  likes: number;
  shares: number;
  comments: number;
  engagement_rate: number;
  z_score: number;
  is_anomaly: boolean;
  anomaly_score: number;
  reason: string;
}

interface DataExplorerProps {
  records: RecordItem[];
  onExport: () => void;
}

export default function DataExplorer({ records, onExport }: DataExplorerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortField, setSortField] = useState<keyof RecordItem>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const platforms = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.platform))).sort();
  }, [records]);

  const filtered = useMemo(() => {
    let res = records.filter((r) => {
      if (platformFilter !== "All" && r.platform !== platformFilter) return false;
      if (classFilter === "anomalies" && !r.is_anomaly) return false;
      if (classFilter === "normal" && r.is_anomaly) return false;
      if (fromDate && r.date < fromDate) return false;
      if (toDate && r.date > toDate) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          r.platform.toLowerCase().includes(q) ||
          r.hashtag.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.date.includes(q);
        if (!matches) return false;
      }
      return true;
    });

    return res.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [records, search, platformFilter, classFilter, fromDate, toDate, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof RecordItem) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Dedicated filtered export
  const handleExportFiltered = () => {
    const headers = [
      "ID",
      "Date",
      "Platform",
      "Hashtag",
      "Post_Count",
      "Likes",
      "Shares",
      "Comments",
      "Engagement_Rate",
      "Z_Score",
      "Is_Anomaly",
      "Severity_Score",
      "Classification_Reason",
    ];

    const rows = filtered.map((d) => [
      d.id,
      d.date,
      `"${d.platform}"`,
      `"${d.hashtag}"`,
      d.post_count,
      d.likes,
      d.shares,
      d.comments,
      d.engagement_rate,
      d.z_score,
      d.is_anomaly ? 1 : 0,
      d.anomaly_score,
      `"${d.reason.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `trendpulse_explorer_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Raw Data Explorer &amp; Feature Telemetry
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              {filtered.length.toLocaleString()} of {records.length.toLocaleString()} Rows
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete dataset records from <code className="text-indigo-300">processed_trend_data.csv</code> with real-time sorting, search, and isolation classifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search across all fields..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleExportFiltered}
            className="flex items-center gap-1.5 px-3.5 h-9 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition shrink-0"
            title="Download CSV of current filtered view"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View ({filtered.length.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Explorer In-Table Filter Controls */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3 text-indigo-400" /> Platform
          </label>
          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3 text-indigo-400" /> Classification
          </label>
          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Classifications</option>
            <option value="anomalies">Anomalies Only (-1)</option>
            <option value="normal">Normal Baseline Only (+1)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-indigo-400" /> From Date
          </label>
          <input
            type="date"
            value={fromDate}
            min="2024-05-01"
            max="2025-04-30"
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-indigo-400" /> To Date
          </label>
          <input
            type="date"
            value={toDate}
            min="2024-05-01"
            max="2025-04-30"
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold select-none">
              <th onClick={() => handleSort("date")} className="py-3 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("platform")} className="py-3 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">Platform <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("hashtag")} className="py-3 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1">Hashtag <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("post_count")} className="py-3 px-3 text-right cursor-pointer hover:text-white">
                <div className="flex items-center justify-end gap-1">Posts <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("likes")} className="py-3 px-3 text-right cursor-pointer hover:text-white">
                <div className="flex items-center justify-end gap-1">Likes <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("shares")} className="py-3 px-3 text-right cursor-pointer hover:text-white">
                <div className="flex items-center justify-end gap-1">Shares <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("comments")} className="py-3 px-3 text-right cursor-pointer hover:text-white">
                <div className="flex items-center justify-end gap-1">Comments <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("engagement_rate")} className="py-3 px-3 text-right cursor-pointer hover:text-white">
                <div className="flex items-center justify-end gap-1">Eng. Rate <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("z_score")} className="py-3 px-3 text-right cursor-pointer hover:text-white">
                <div className="flex items-center justify-end gap-1">Z-Score <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort("is_anomaly")} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                <div className="flex items-center justify-center gap-1">Class <ArrowUpDown className="w-3 h-3" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500">
                  No records match your active query filters.
                </td>
              </tr>
            ) : (
              pageRows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap font-mono">{r.date}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 text-[11px]">
                      {r.platform}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-indigo-300 whitespace-nowrap font-semibold">{r.hashtag}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.post_count}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.likes.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.shares.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.comments.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200 font-mono">
                    <span
                      className={r.engagement_rate > 1.0 ? "text-purple-300 font-bold" : ""}
                      title="Formula: (Likes + Shares + Comments) / Impressions"
                    >
                      {(r.engagement_rate * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-mono">{r.z_score.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {r.is_anomaly ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        Anomaly ({r.anomaly_score.toFixed(0)})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>rows per page</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {currentPage} of {totalPages} ({filtered.length.toLocaleString()} total rows)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
