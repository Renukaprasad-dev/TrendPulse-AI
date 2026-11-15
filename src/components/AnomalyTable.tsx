"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
} from "lucide-react";

interface RecordItem {
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
  onExport: () => void;
}

export default function AnomalyTable({ records, onExport }: AnomalyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<keyof RecordItem>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const filteredRecords = useMemo(() => {
    let result = records;
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.platform.toLowerCase().includes(q) ||
          r.hashtag.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.date.includes(q)
      );
    }
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
  }, [records, localSearch, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const pageRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof RecordItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Anomaly Detection Audit Log
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              {filteredRecords.length.toLocaleString()} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Row-level isolation forest predictions, multivariate scores, and causal explanations
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter table rows..."
            className="h-9 px-3 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
          />

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3.5 h-9 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold select-none">
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
                  <span>Posts</span>
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
                  <span>Engagement</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort("anomaly_score")}
                className="py-3 px-4 text-center cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Severity Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4">Heuristic Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {pageRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No records match your active query filters.
                </td>
              </tr>
            ) : (
              pageRecords.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    row.is_anomaly ? "bg-rose-500/[0.03]" : ""
                  }`}
                >
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold text-[11px]">
                      {row.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-indigo-300 font-semibold whitespace-nowrap">
                    {row.hashtag}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">
                    {row.post_count}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">
                    {row.likes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">
                    {row.shares.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-200 font-mono">
                    {(row.engagement_rate * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {row.is_anomaly ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
                        {row.anomaly_score.toFixed(1)} / 100
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        Normal ({row.anomaly_score.toFixed(1)})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                    <span
                      title={row.reason}
                      className={row.is_anomaly ? "text-rose-300/90" : "text-slate-400"}
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
          <span>per page</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {currentPage} of {totalPages}
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
