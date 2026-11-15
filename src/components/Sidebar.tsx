"use client";

import React from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  LineChart,
  Lightbulb,
  Database,
  Cpu,
  PlayCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Radio,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  user: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onLogout,
  user,
}: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "anomalies", label: "Anomaly Detection", icon: ShieldAlert, badge: "535" },
    { id: "trends", label: "Trend Analysis", icon: LineChart },
    { id: "insights", label: "Insights & Intel", icon: Lightbulb },
    { id: "explorer", label: "Data Explorer", icon: Database },
    { id: "model", label: "Model Performance", icon: Cpu },
    { id: "simulator", label: "ML Simulator", icon: PlayCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-[#1a2336] bg-[#0a0f1d]/95 backdrop-blur-xl flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1a2336]">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  TrendPulse
                </span>
                <span className="text-[10px] font-semibold text-indigo-400 block tracking-widest uppercase">
                  Enterprise AI
                </span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 mx-auto">
              <Radio className="w-5 h-5 text-white" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/90 to-indigo-700/80 text-white shadow-md shadow-indigo-600/20 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition-transform ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-rose-500/90 text-white"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile / Logout */}
      <div className="p-3 border-t border-[#1a2336] bg-[#080d19]/80">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
              {user.slice(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-slate-200 truncate capitalize">
                  {user}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Verified Admin
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
