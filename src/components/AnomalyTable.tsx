"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowUpDown,
  Filter,
  Calendar,
  Layers,
  Hash,
  SlidersHorizontal,
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

interface AnomalyTableProps {
  records: RecordItem[];
  onExport?: () => void;
}

export default function AnomalyTable({ records, onExport }: AnomalyTableProps) {
  // Ensure we operate exclusively on anomalies
  const anomalyRecords = useMemo(() => {
    return records.filter((r) => r.is_anomaly);
  }, [records]);

  // Local table filters
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [sortField, setSortField] = useState<keyof RecordItem>("anomaly_score");
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default descending (highest severity first)
  const [localSearch, setLocalSearch] = useState<string>("");
  const [tablePlatform, setTablePlatform] = useState<string>("All");
  const [tableHashtag, setTableHashtag] = useState<string>("All");
  const [tableStartDate, setTableStartDate] = useState<string>("");
  const [tableEndDate, setTableEndDate] = useState<string>("");
  const [minSeverity, setMinSeverity] = useState<number>(50);

  // Available platforms and hashtags from the anomaly subset
  const platforms = useMemo(() => {
    return Array.from(new Set(anomalyRecords.map((r) => r.platform))).sort();
  }, [anomalyRecords]);

  const hashtags = useMemo(() => {
    let pool = anomalyRecords;
    if (tablePlatform !== "All") {
      pool = pool.filter((r) => r.platform === tablePlatform);
    }
    return Array.from(new Set(pool.map((r) => r.hashtag))).sort();
  }, [anomalyRecords, tablePlatform]);

  // Filtered & Sorted Anomaly Records
  const filteredRecords = useMemo(() => {
    let result = anomalyRecords.filter((r) => {
      if (tablePlatform !== "All" && r.platform !== tablePlatform) return false;
      if (tableHashtag !== "All" && r.hashtag !== tableHashtag) return false;
      if (tableStartDate && r.date < tableStartDate) return false;
      if (tableEndDate && r.date > tableEndDate) return false;
      if (r.anomaly_score < minSeverity) return false;
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matches =
          r.platform.toLowerCase().includes(q) ||
          r.hashtag.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.date.includes(q);
        if (!matches) return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [
    anomalyRecords,
    tablePlatform,
    tableHashtag,
    tableStartDate,
    tableEndDate,
    minSeverity,
    localSearch,
    sortField,
    sortAsc,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pageRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof RecordItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default new column to descending
    }
  };

  // Dedicated CSV export of filtered anomaly records only
  const handleExportAnomaliesCSV = () => {
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

    const rows = filteredRecords.map((d) => [
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
      1,
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
      `trendpulse_anomalies_only_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Isolation Forest Anomaly Audit Log
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
              {filteredRecords.length.toLocaleString()} Anomalies Flagged
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Displaying verified outlier records strictly classified as anomalies (-1) by the trained ensemble model.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search within anomalies..."
            className="h-9 px-3 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
          />

          <button
            onClick={handleExportAnomaliesCSV}
            className="flex items-center gap-1.5 px-3.5 h-9 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/20 transition shrink-0"
            title="Download CSV containing only filtered anomaly records"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Anomalies ({filteredRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Advanced In-Table Filter Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
        {/* Platform Filter */}
        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3 text-indigo-400" /> Platform
          </label>
          <select
            value={tablePlatform}
            onChange={(e) => {
              setTablePlatform(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Platforms ({anomalyRecords.length})</option>
            {platforms.map((p) => {
              const pCount = anomalyRecords.filter((r) => r.platform === p).length;
              return (
                <option key={p} value={p}>
                  {p} ({pCount})
                </option>
              );
            })}
          </select>
        </div>

        {/* Hashtag Filter */}
        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Hash className="w-3 h-3 text-indigo-400" /> Hashtag
          </label>
          <select
            value={tableHashtag}
            onChange={(e) => {
              setTableHashtag(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 truncate"
          >
            <option value="All">All Hashtags</option>
            {hashtags.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-indigo-400" /> From Date
          </label>
          <input
            type="date"
            value={tableStartDate}
            min="2024-05-01"
            max="2025-04-30"
            onChange={(e) => {
              setTableStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-indigo-400" /> To Date
          </label>
          <input
            type="date"
            value={tableEndDate}
            min="2024-05-01"
            max="2025-04-30"
            onChange={(e) => {
              setTableEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
          />
        </div>

        {/* Severity Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400" /> Min Severity:
            </span>
            <span className="font-mono text-rose-400 font-bold">{minSeverity}</span>
          </div>
          <input
            type="range"
            min={50}
            max={95}
            step={5}
            value={minSeverity}
            onChange={(e) => {
              setMinSeverity(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full accent-rose-500 h-5"
          />
        </div>
      </div>

      {/* Interactive Anomaly Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold select-none">
              <th
                onClick={() => handleSort("anomaly_score")}
                className="py-3 px-4 text-center cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-center gap-1 text-rose-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Severity Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort("date")}
                className="py-3 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("platform")}
                className="py-3 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1">
                  <span>Platform</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("hashtag")}
                className="py-3 px-4 cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1">
                  <span>Hashtag</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("post_count")}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Post Count</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("likes")}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Likes</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("shares")}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Shares</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("engagement_rate")}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Engagement Rate</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4">Empirical Deviation Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {pageRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  No anomaly records match the active criteria. Try broadening your platform or date filters.
                </td>
              </tr>
            ) : (
              pageRecords.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-800/40 transition-colors bg-rose-500/[0.04]"
                >
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        row.anomaly_score >= 80
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : row.anomaly_score >= 65
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                      }`}
                    >
                      <Flame className="w-3 h-3 shrink-0" />
                      {row.anomaly_score.toFixed(1)} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-mono">{row.date}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold text-[11px]">
                      {row.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-indigo-300 font-semibold whitespace-nowrap">
                    {row.hashtag}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">
                    <span className={row.post_count > 2 ? "text-amber-400 font-bold" : ""}>
                      {row.post_count}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">
                    <span className={row.likes > 5452 ? "text-rose-400 font-bold" : ""}>
                      {row.likes.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">
                    <span className={row.shares > 2222 ? "text-rose-400 font-bold" : ""}>
                      {row.shares.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-200 font-mono">
                    <span
                      className={
                        row.engagement_rate > 1.0
                          ? "text-purple-300 font-bold"
                          : row.engagement_rate > 0.8
                          ? "text-amber-300"
                          : ""
                      }
                      title={`Interaction ratio: ${(row.engagement_rate * 100).toFixed(1)}%`}
                    >
                      {(row.engagement_rate * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px] max-w-sm">
                    <span
                      title={row.reason}
                      className="text-rose-200/90 leading-snug line-clamp-2 block"
                    >
                      {row.reason}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
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
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>anomalies per page</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {currentPage} of {totalPages} ({filteredRecords.length.toLocaleString()} total anomalies)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
