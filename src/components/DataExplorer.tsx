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

interface DataExplorerProps {
  records: RecordItem[];
  onExport: () => void;
}

export default function DataExplorer({ records, onExport }: DataExplorerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof RecordItem>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let res = records;
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (r) =>
          r.platform.toLowerCase().includes(q) ||
          r.hashtag.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.date.includes(q)
      );
    }
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
  }, [records, search, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof RecordItem) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Raw Data Explorer & Feature Inspection
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              {filtered.length.toLocaleString()} Rows
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore all 11 features from `processed_trend_data.csv` including rolling and lag measurements
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
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
            onClick={onExport}
            className="flex items-center gap-1.5 px-3.5 h-9 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold select-none">
              <th onClick={() => handleSort("date")} className="py-3 px-3 cursor-pointer hover:text-white">Date</th>
              <th onClick={() => handleSort("platform")} className="py-3 px-3 cursor-pointer hover:text-white">Platform</th>
              <th onClick={() => handleSort("hashtag")} className="py-3 px-3 cursor-pointer hover:text-white">Hashtag</th>
              <th onClick={() => handleSort("post_count")} className="py-3 px-3 text-right cursor-pointer hover:text-white">Posts</th>
              <th onClick={() => handleSort("likes")} className="py-3 px-3 text-right cursor-pointer hover:text-white">Likes</th>
              <th onClick={() => handleSort("shares")} className="py-3 px-3 text-right cursor-pointer hover:text-white">Shares</th>
              <th onClick={() => handleSort("comments")} className="py-3 px-3 text-right cursor-pointer hover:text-white">Comments</th>
              <th onClick={() => handleSort("engagement_rate")} className="py-3 px-3 text-right cursor-pointer hover:text-white">Eng. Rate</th>
              <th onClick={() => handleSort("z_score")} className="py-3 px-3 text-right cursor-pointer hover:text-white">Z-Score</th>
              <th onClick={() => handleSort("is_anomaly")} className="py-3 px-3 text-center cursor-pointer hover:text-white">Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {pageRows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{r.date}</td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 text-[11px]">
                    {r.platform}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-indigo-300 whitespace-nowrap">{r.hashtag}</td>
                <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.post_count}</td>
                <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.likes.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.shares.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right text-slate-300 font-mono">{r.comments.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right text-slate-200 font-mono">{(r.engagement_rate * 100).toFixed(2)}%</td>
                <td className="py-2.5 px-3 text-right text-slate-400 font-mono">{r.z_score.toFixed(3)}</td>
                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                  {r.is_anomaly ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      Anomaly
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
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
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>rows per page</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {currentPage} of {totalPages}
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
