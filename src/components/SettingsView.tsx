"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Sliders,
  Shield,
  Save,
  Check,
  Server,
  Terminal,
  Activity,
  RefreshCw,
  Cpu,
  User,
  Database,
  Info,
} from "lucide-react";

export default function SettingsView() {
  const [contaminationDisplay, setContaminationDisplay] = useState<number>(0.05);
  const [alertThreshold, setAlertThreshold] = useState<number>(75);
  const [engagementDisplayFormat, setEngagementDisplayFormat] = useState<string>("percentage");
  const [saved, setSaved] = useState<boolean>(false);

  // Health probe state
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [probingHealth, setProbingHealth] = useState<boolean>(false);
  const [healthLatency, setHealthLatency] = useState<number | null>(null);

  // Load persisted settings
  useEffect(() => {
    try {
      const storedThreshold = localStorage.getItem("trendpulse_alert_threshold");
      if (storedThreshold) setAlertThreshold(Number(storedThreshold));

      const storedFormat = localStorage.getItem("trendpulse_engagement_format");
      if (storedFormat) setEngagementDisplayFormat(storedFormat);
    } catch (e) {
      console.warn("Could not access localStorage:", e);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("trendpulse_alert_threshold", alertThreshold.toString());
      localStorage.setItem("trendpulse_engagement_format", engagementDisplayFormat);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("Failed saving to localStorage:", e);
    }
  };

  const handleProbeHealth = async () => {
    setProbingHealth(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/health");
      const duration = Math.round(performance.now() - start);
      const data = await res.json();
      setHealthLatency(duration);
      setHealthStatus(data);
    } catch (err: any) {
      setHealthStatus({ status: "error", message: err.message });
      setHealthLatency(null);
    } finally {
      setProbingHealth(false);
    }
  };

  const handleResetCache = () => {
    localStorage.removeItem("trendpulse_alert_threshold");
    localStorage.removeItem("trendpulse_engagement_format");
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            System &amp; Anomaly Detection Configuration
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure real-time monitoring thresholds, notification channels, health probes, and model fallbacks
        </p>
      </div>

      {/* Model & Alert Parameters */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Detection Sensitivity &amp; Display Controls</h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Critical Severity Alert Threshold */}
          <div>
            <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
              <span>Critical Severity Alert Trigger:</span>
              <span className="font-mono text-rose-400 font-bold">{alertThreshold} / 100</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <span className="text-[10px] text-slate-500">
              Persisted in localStorage. Outliers with severity score &ge; {alertThreshold} are flagged with critical alerts and priority badges across the platform.
            </span>
          </div>

          {/* Model Contamination Note */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Model Contamination Rate:</span>
              </span>
              <span className="font-mono text-purple-400 font-bold">5.0% (0.05)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Technical Note:</strong> The 0.05 contamination quantile is pre-compiled into the serialized model binary (<code className="text-indigo-300">isolation_forest.pkl</code>). To re-calibrate the tree ensemble itself, execute <code className="text-indigo-300">python train_model.py</code> with updated parameters. Modifying client threshold controls adjusts view-filtering sensitivity, not server-side model retraining.
            </p>
          </div>

          {/* Engagement Rate Display Format */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Engagement Rate Display Preference:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEngagementDisplayFormat("percentage")}
                className={`p-3 rounded-xl border text-left transition ${
                  engagementDisplayFormat === "percentage"
                    ? "bg-indigo-600/20 border-indigo-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className="font-bold block text-xs">Percentage Format</span>
                <span className="text-[10px] text-slate-400">e.g., 24.5% (Multiplied by 100)</span>
              </button>
              <button
                type="button"
                onClick={() => setEngagementDisplayFormat("ratio")}
                className={`p-3 rounded-xl border text-left transition ${
                  engagementDisplayFormat === "ratio"
                    ? "bg-indigo-600/20 border-indigo-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className="font-bold block text-xs">Raw Ratio Format</span>
                <span className="text-[10px] text-slate-400">e.g., 0.245 (Pure Interaction Ratio)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Deployment & API Health */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Deployment Infrastructure &amp; API Health</h3>
          </div>
          <button
            onClick={handleProbeHealth}
            disabled={probingHealth}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow transition disabled:opacity-50"
          >
            <Activity className={`w-3.5 h-3.5 ${probingHealth ? "animate-spin" : ""}`} />
            <span>{probingHealth ? "Probing..." : "Probe API Health"}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <span className="font-semibold text-white block">Production Vercel Cloud Runtime</span>
                <span className="text-[11px] text-slate-400">Next.js Edge API Routes + Static Hydration</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              Operational
            </span>
          </div>

          {healthStatus && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Live Probe Response:
                </span>
                {healthLatency !== null && (
                  <span className="font-mono text-emerald-400 font-bold">
                    Latency: {healthLatency} ms
                  </span>
                )}
              </div>
              <pre className="p-2.5 rounded bg-slate-900 text-indigo-300 font-mono text-[10px] overflow-x-auto border border-slate-800">
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-white block">Local Streamlit Fallback</span>
                <span className="text-[11px] text-slate-400">Command: python -m streamlit run app.py</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
              Available (Port 8501)
            </span>
          </div>
        </div>
      </div>

      {/* Model Specifications */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Model Artifact Information</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Artifact File</span>
            <span className="font-mono text-slate-200 mt-1 block">isolation_forest.pkl</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Trained Samples</span>
            <span className="font-mono text-slate-200 mt-1 block">10,698 Records</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Feature Dimensions</span>
            <span className="font-mono text-slate-200 mt-1 block">4 Features</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Anomaly Outliers</span>
            <span className="font-mono text-rose-400 mt-1 block font-bold">535 Records (5.0%)</span>
          </div>
        </div>
      </div>

      {/* Data Refresh & Reset Controls */}
      <div className="p-6 rounded-2xl bg-[#0f172a]/70 border border-[#1e293b] shadow-xl flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Data Refresh &amp; Local Storage</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset local filters, clear client-side cache and reload baseline settings.
          </p>
        </div>
        <button
          onClick={handleResetCache}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Local State</span>
        </button>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fade-in">
            <Check size={14} /> Settings saved to local configuration!
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
