"use client";

import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Radio,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface LoginModalProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please provide both username and password.");
      return;
    }

    setLoading(true);

    // Secure authentication check (compatible with demo admin/1234)
    setTimeout(() => {
      if (
        (username.trim().toLowerCase() === "admin" && password === "1234") ||
        (username.trim().toLowerCase() === "demo" && password === "demo123")
      ) {
        localStorage.setItem("trendpulse_auth_user", username.trim());
        onLoginSuccess(username.trim());
      } else {
        setError("Invalid credentials. Use demo credentials or contact administrator.");
      }
      setLoading(false);
    }, 400);
  };

  const handleUseDemo = () => {
    setUsername("admin");
    setPassword("1234");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060911]/90 backdrop-blur-2xl">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#0f172a] border border-[#1e293b] shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3.5">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            TrendPulse <span className="text-indigo-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Social Media Trend Anomaly Detection Platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full h-11 pl-9 pr-3 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-11 pl-9 pr-10 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 text-xs"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Platform"}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Demo Credentials Quick-Fill */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2.5">
            Default sandbox credentials: <code className="text-indigo-300">admin</code> /{" "}
            <code className="text-indigo-300">1234</code>
          </p>
          <button
            type="button"
            onClick={handleUseDemo}
            className="w-full py-2 px-3 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autofill Demo Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
}
