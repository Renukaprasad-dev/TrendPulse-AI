"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Sliders,
  Shield,
  Save,
  Check,
  Server,
  Terminal,
} from "lucide-react";

export default function SettingsView() {
  const [contamination, setContamination] = useState(0.05);
  const [alertThreshold, setAlertThreshold] = useState(75);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            System & Anomaly Detection Settings
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure real-time monitoring thresholds, notification channels, and model fallbacks
        </p>
      </div>

      {/* Model Parameters */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Isolation Forest Parameters</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
              <span>Expected Outlier Contamination Rate:</span>
              <span className="font-mono text-purple-400">{(contamination * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.15}
              step={0.01}
              value={contamination}
              onChange={(e) => setContamination(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <span className="text-[10px] text-slate-500">
              Default is 0.05 (5.0%). Defines the decision boundary quantile across the tree forest.
            </span>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
              <span>Critical Severity Alert Trigger:</span>
              <span className="font-mono text-rose-400">{alertThreshold} / 100</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <span className="text-[10px] text-slate-500">
              Records with anomaly severity exceeding this score will trigger urgent notifications.
            </span>
          </div>
        </div>
      </div>

      {/* Local Fallback & Deployment Info */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Server className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white">Deployment & Local Fallback</h3>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <div>
                <span className="font-semibold text-white block">Production Vercel Cloud Runtime</span>
                <span className="text-[11px] text-slate-400">Edge API Routes + React Frontend</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              Active
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-white block">Local Streamlit Fallback</span>
                <span className="text-[11px] text-slate-400">Run: python -m streamlit run app.py</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <Check size={14} /> Settings applied successfully!
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-600/20 transition"
        >
          <Save size={14} />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
}
