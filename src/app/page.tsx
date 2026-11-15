"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import KpiCards from "@/components/KpiCards";
import TrendCharts from "@/components/TrendCharts";
import AnomalyTable from "@/components/AnomalyTable";
import InsightsView from "@/components/InsightsView";
import ModelPerformanceView from "@/components/ModelPerformanceView";
import PredictSimulator from "@/components/PredictSimulator";
import DataExplorer from "@/components/DataExplorer";
import SettingsView from "@/components/SettingsView";
import LoginModal from "@/components/LoginModal";
import dataset from "@/data/dataset.json";
import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedHashtag, setSelectedHashtag] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string>("admin");

  useEffect(() => {
    const savedUser = localStorage.getItem("trendpulse_auth_user");
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("trendpulse_auth_user");
    setIsAuthenticated(false);
  };

  // Available Filter Options
  const platforms = useMemo(() => {
    return Array.from(new Set(dataset.map((d) => d.platform))).sort();
  }, []);

  const hashtags = useMemo(() => {
    let pool = dataset;
    if (selectedPlatform !== "All") {
      pool = pool.filter((d) => d.platform === selectedPlatform);
    }
    return Array.from(new Set(pool.map((d) => d.hashtag))).sort();
  }, [selectedPlatform]);

  // Main Filtered Dataset
  const filteredData = useMemo(() => {
    return dataset.filter((d) => {
      if (selectedPlatform !== "All" && d.platform !== selectedPlatform) return false;
      if (selectedHashtag !== "All" && d.hashtag !== selectedHashtag) return false;
      if (statusFilter === "anomalies" && !d.is_anomaly) return false;
      if (statusFilter === "normal" && d.is_anomaly) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          d.platform.toLowerCase().includes(q) ||
          d.hashtag.toLowerCase().includes(q) ||
          d.reason.toLowerCase().includes(q) ||
          d.date.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedPlatform, selectedHashtag, statusFilter, searchQuery]);

  // KPI Calculations
  const kpiMetrics = useMemo(() => {
    const total = filteredData.length;
    const anomalies = filteredData.filter((d) => d.is_anomaly).length;
    const normal = total - anomalies;
    const rate = total ? (anomalies / total) * 100 : 0;
    const avgEng = total
      ? filteredData.reduce((acc, d) => acc + d.engagement_rate, 0) / total
      : 0;
    const totalLikes = filteredData.reduce((acc, d) => acc + d.likes, 0);
    const totalShares = filteredData.reduce((acc, d) => acc + d.shares, 0);
    const totalComments = filteredData.reduce((acc, d) => acc + d.comments, 0);

    return {
      totalRecords: total,
      anomaliesCount: anomalies,
      normalCount: normal,
      anomalyRatePct: rate,
      avgEngagement: avgEng,
      totalInteractions: totalLikes + totalShares + totalComments,
    };
  }, [filteredData]);

  // Timeline Trends (Aggregated Daily)
  const trendSeries = useMemo(() => {
    const dateMap: {
      [date: string]: {
        date: string;
        post_count: number;
        likes: number;
        shares: number;
        engagement_sum: number;
        count: number;
        anomalies: number;
      };
    } = {};

    for (const d of filteredData) {
      if (!dateMap[d.date]) {
        dateMap[d.date] = {
          date: d.date,
          post_count: 0,
          likes: 0,
          shares: 0,
          engagement_sum: 0,
          count: 0,
          anomalies: 0,
        };
      }
      dateMap[d.date].post_count += d.post_count;
      dateMap[d.date].likes += d.likes;
      dateMap[d.date].shares += d.shares;
      dateMap[d.date].engagement_sum += d.engagement_rate;
      dateMap[d.date].count += 1;
      if (d.is_anomaly) dateMap[d.date].anomalies += 1;
    }

    return Object.values(dateMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-60)
      .map((item) => ({
        date: item.date,
        post_count: item.post_count,
        likes: item.likes,
        shares: item.shares,
        engagement_rate: Number((item.engagement_sum / item.count).toFixed(4)),
        is_anomaly: item.anomalies,
      }));
  }, [filteredData]);

  // Platform Distribution
  const platformDistribution = useMemo(() => {
    const pMap: { [p: string]: { total: number; anomalies: number } } = {};
    for (const d of filteredData) {
      if (!pMap[d.platform]) pMap[d.platform] = { total: 0, anomalies: 0 };
      pMap[d.platform].total += 1;
      if (d.is_anomaly) pMap[d.platform].anomalies += 1;
    }
    return Object.entries(pMap).map(([name, stat]) => ({
      name,
      total: stat.total,
      anomalies: stat.anomalies,
    }));
  }, [filteredData]);

  // Anomaly Pie Breakdown
  const anomalyBreakdown = useMemo(() => {
    return [
      { name: "Normal Activity", value: kpiMetrics.normalCount, color: "#6366f1" },
      { name: "Anomalies", value: kpiMetrics.anomaliesCount, color: "#f43f5e" },
    ];
  }, [kpiMetrics]);

  // Top Anomalous Hashtags
  const topHashtags = useMemo(() => {
    const tagMap: { [tag: string]: { count: number; anomalies: number } } = {};
    for (const d of filteredData) {
      if (!tagMap[d.hashtag]) tagMap[d.hashtag] = { count: 0, anomalies: 0 };
      tagMap[d.hashtag].count += 1;
      if (d.is_anomaly) tagMap[d.hashtag].anomalies += 1;
    }
    return Object.entries(tagMap)
      .map(([hashtag, stat]) => ({
        hashtag,
        count: stat.count,
        anomalies: stat.anomalies,
      }))
      .sort((a, b) => b.anomalies - a.anomalies)
      .slice(0, 6);
  }, [filteredData]);

  // Actionable Insights
  const insightsList = useMemo(() => {
    const anomalies = filteredData.filter((d) => d.is_anomaly);
    const totalAnomalies = anomalies.length;

    const platformCounts: { [p: string]: number } = {};
    for (const a of anomalies) platformCounts[a.platform] = (platformCounts[a.platform] || 0) + 1;
    const topP = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];

    const volumeSpikes = anomalies.filter((a) => a.post_count > 2).length;
    const extremeEngagement = anomalies.filter((a) => a.engagement_rate > 0.8).length;
    const viralShares = anomalies.filter((a) => a.shares > 2000).length;

    return [
      {
        id: "platform-concentration",
        type: "platform",
        title: topP ? `Highest Outlier Activity on ${topP[0]}` : "Platform Outliers",
        description: topP
          ? `${topP[0]} accounts for ${topP[1]} anomalies (${((topP[1] / Math.max(1, totalAnomalies)) * 100).toFixed(1)}% of all anomalies in this view).`
          : "No anomalies detected in the current filter.",
        severity: "high",
        impact: "Focus automated moderation and social listening queues on this network.",
      },
      {
        id: "engagement-surges",
        type: "engagement",
        title: "Extreme Engagement Rate Deviations",
        description: `${extremeEngagement} events exhibited engagement rates above 80%, exceeding Gaussian normal bounds by over 3 standard deviations.`,
        severity: "warning",
        impact: "Investigate whether engagement was organic influencer sharing or paid bot amplification.",
      },
      {
        id: "volume-bursts",
        type: "volume",
        title: "Coordinated Post Volume Spikes",
        description: `${volumeSpikes} time slots registered high concurrent post volume (>2 posts/entity), indicative of coordinated PR blitzes.`,
        severity: "info",
        impact: "Cross-reference with planned marketing campaigns to reduce false alarm fatigue.",
      },
      {
        id: "viral-spread",
        type: "viral",
        title: "High Redistribution Velocity",
        description: `${viralShares} anomalies exhibited shares exceeding 2,000 units, indicating viral propagation beyond typical baseline thresholds.`,
        severity: "warning",
        impact: "Monitor sentiment and PR exposure to capitalize on high-velocity reach.",
      },
    ];
  }, [filteredData]);

  // CSV Export
  const handleExportCSV = () => {
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
      "Reason",
    ];

    const rows = filteredData.map((d) => [
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
      `"${d.reason}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `anomalies_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auth gate
  if (!isAuthenticated) {
    return (
      <LoginModal
        onLoginSuccess={(uname) => {
          setUser(uname);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNav
          title={
            activeTab === "overview"
              ? "Executive Overview"
              : activeTab === "anomalies"
              ? "Anomaly Detection Log"
              : activeTab === "trends"
              ? "Trend & Time-Series Dynamics"
              : activeTab === "insights"
              ? "Actionable Intelligence"
              : activeTab === "explorer"
              ? "Data Explorer"
              : activeTab === "model"
              ? "Model Architecture & Specs"
              : activeTab === "simulator"
              ? "Real-time ML Simulator"
              : "System Settings"
          }
          subtitle={`Auditing 10,698 social media records across ${platforms.length} major networks`}
          platforms={platforms}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          hashtags={hashtags}
          selectedHashtag={selectedHashtag}
          setSelectedHashtag={setSelectedHashtag}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={() => {}}
          onExport={handleExportCSV}
          collapsed={sidebarCollapsed}
        />

        {/* Dynamic Content Views */}
        <main
          className={`p-6 transition-all duration-300 space-y-6 flex-1 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          {/* Always display KPI cards */}
          <KpiCards
            totalRecords={kpiMetrics.totalRecords}
            anomaliesCount={kpiMetrics.anomaliesCount}
            normalCount={kpiMetrics.normalCount}
            anomalyRatePct={kpiMetrics.anomalyRatePct}
            avgEngagement={kpiMetrics.avgEngagement}
            totalInteractions={kpiMetrics.totalInteractions}
          />

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Alert Notification */}
              {kpiMetrics.anomaliesCount > 0 ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {kpiMetrics.anomaliesCount.toLocaleString()} Anomalous Signals Flagged
                      </h4>
                      <p className="text-xs text-rose-200/80">
                        Isolation Forest model detected significant divergence from historical baseline engagement.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("anomalies")}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition shrink-0"
                  >
                    View Anomaly Log
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>All metrics in current filtered view are tracking within normal baseline limits.</span>
                </div>
              )}

              {/* Trend Charts */}
              <TrendCharts
                trendData={trendSeries}
                platformDistribution={platformDistribution}
                anomalyBreakdown={anomalyBreakdown}
                topHashtags={topHashtags}
              />

              {/* Quick Anomaly Preview Table */}
              <AnomalyTable
                records={filteredData.filter((d) => d.is_anomaly)}
                onExport={handleExportCSV}
              />
            </div>
          )}

          {/* Tab 2: Anomaly Detection */}
          {activeTab === "anomalies" && (
            <AnomalyTable
              records={filteredData.filter((d) => (statusFilter === "all" ? true : d.is_anomaly))}
              onExport={handleExportCSV}
            />
          )}

          {/* Tab 3: Trend Analysis */}
          {activeTab === "trends" && (
            <TrendCharts
              trendData={trendSeries}
              platformDistribution={platformDistribution}
              anomalyBreakdown={anomalyBreakdown}
              topHashtags={topHashtags}
            />
          )}

          {/* Tab 4: Insights */}
          {activeTab === "insights" && <InsightsView insights={insightsList} />}

          {/* Tab 5: Data Explorer */}
          {activeTab === "explorer" && (
            <DataExplorer records={filteredData} onExport={handleExportCSV} />
          )}

          {/* Tab 6: Model Performance */}
          {activeTab === "model" && (
            <ModelPerformanceView
              totalRecords={kpiMetrics.totalRecords}
              anomaliesDetected={kpiMetrics.anomaliesCount}
            />
          )}

          {/* Tab 7: Simulator */}
          {activeTab === "simulator" && <PredictSimulator />}

          {/* Tab 8: Settings */}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
