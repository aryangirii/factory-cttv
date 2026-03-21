import { useCallback, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Loader2, RefreshCw, Activity, AlertTriangle, Shield, Camera } from "lucide-react";
import StatCard from "@/components/StatCard";
import { fetchSafetyScores, fetchZoneAnalytics, fetchTrend, fetchAlerts, formatCamId } from "@/services/api";
import type { SafetyScore, ZoneAnalyticsData, TrendData, AlertData } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";

function formatDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatAlertTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const time = d.toLocaleTimeString("en-US", { hour12: false });
    return `${day}-${month}-${year} ${time}`;
  } catch {
    return ts;
  }
}

export default function ZoneAnalytics() {
  const scoresApi = useApiData({ fetchFn: fetchSafetyScores, refreshInterval: 60000 });
  const zonesApi = useApiData({ fetchFn: fetchZoneAnalytics, refreshInterval: 60000 });
  const trendApi = useApiData({ fetchFn: useCallback(() => fetchTrend(7), []), refreshInterval: 60000 });
  const alertsApi = useApiData({ fetchFn: useCallback(() => fetchAlerts(20), []), refreshInterval: 60000 });

  const scores = scoresApi.data || [];
  const zones = zonesApi.data || [];
  const trend = trendApi.data || [];
  const alertsData = alertsApi.data;
  const alerts = alertsData?.alerts || [];

  const lastUpdated = scoresApi.lastUpdated;
  const isLoading = scoresApi.loading && !scoresApi.data;

  // Summary stats
  const totalDetections = useMemo(() => scores.reduce((s, x) => s + x.detection_count, 0), [scores]);
  const totalAlerts = useMemo(() => scores.reduce((s, x) => s + x.alert_count, 0), [scores]);
  const avgSafety = useMemo(() => scores.length ? +(scores.reduce((s, x) => s + x.safety_score, 0) / scores.length).toFixed(1) : 0, [scores]);
  const mostActiveCam = useMemo(() => {
    if (!scores.length) return "—";
    const top = scores.reduce((a, b) => a.detection_count > b.detection_count ? a : b);
    return formatCamId(top.cam_id);
  }, [scores]);

  // Safety score bar chart
  const safetyChartData = useMemo(() =>
    scores.map((s) => ({
      cam: `${formatCamId(s.cam_id)} (${s.alert_count} alerts)`,
      score: s.safety_score,
    })).sort((a, b) => a.cam.localeCompare(b.cam, undefined, { numeric: true })),
    [scores]
  );

  // Zone table sorted by total_hrs desc
  const sortedZones = useMemo(() => [...zones].sort((a, b) => b.total_hrs - a.total_hrs), [zones]);

  // Trend: multi-line per camera
  const trendChartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, unknown>>();
    const camSet = new Set<string>();
    trend.forEach((t) => {
      camSet.add(t.cam_id);
      const row = dateMap.get(t.date) || { date: t.date };
      row[t.cam_id] = ((row[t.cam_id] as number) || 0) + t.presence_hrs;
      dateMap.set(t.date, row);
    });
    return {
      data: Array.from(dateMap.values()).sort((a, b) => String(a.date).localeCompare(String(b.date))),
      cameras: Array.from(camSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    };
  }, [trend]);

  const getBarColor = (score: number) => {
    if (score >= 95) return "hsl(142, 71%, 45%)";
    if (score >= 85) return "hsl(38, 92%, 50%)";
    return "hsl(0, 84%, 60%)";
  };

  const getHrsColor = (hrs: number) => {
    if (hrs > 2) return "text-success";
    if (hrs >= 1) return "text-amber-400";
    return "text-destructive";
  };

  const LINE_COLORS = [
    "hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)",
    "hsl(280, 65%, 60%)", "hsl(180, 70%, 50%)", "hsl(330, 80%, 60%)", "hsl(60, 80%, 50%)",
  ];

  const refreshAll = () => {
    scoresApi.refresh(); zonesApi.refresh(); trendApi.refresh(); alertsApi.refresh();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Zone Analytics & Performance</h2>
            {lastUpdated && <p className="text-[10px] text-muted-foreground font-mono">Last updated: {lastUpdated.toLocaleTimeString("en-US", { hour12: false })}</p>}
          </div>
          <button onClick={refreshAll} className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs hover:bg-muted transition-colors flex items-center gap-1.5">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : (
          <>
            {/* Section 5: Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Detections" value={totalDetections.toLocaleString()} icon={Activity} color="primary" />
              <StatCard label="Total Alerts" value={totalAlerts.toLocaleString()} icon={AlertTriangle} color="destructive" />
              <StatCard label="Avg Safety Score" value={`${avgSafety}%`} icon={Shield} color={avgSafety >= 95 ? "success" : avgSafety >= 85 ? "warning" : "destructive"} />
              <StatCard label="Most Active Camera" value={mostActiveCam} icon={Camera} color="primary" />
            </div>

            {/* Section 1: Safety Score Bar Chart */}
            <div className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Safety Score per Camera</h3>
              <ResponsiveContainer width="100%" height={Math.max(300, safetyChartData.length * 35)}>
                <BarChart data={safetyChartData} layout="vertical" margin={{ left: 120, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                  <YAxis dataKey="cam" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px", color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="score" name="Safety Score %">
                    {safetyChartData.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.score)} />
                    ))}
                    <LabelList dataKey="score" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Section 2: Zone Presence Table */}
            <div className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Zone Presence Analytics</h3>
              {sortedZones.length > 0 ? (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Camera</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Zone</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Total Visits</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Total Hours</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Avg Min/Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedZones.map((z, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                        <td className="py-2.5 text-foreground font-mono font-medium">{formatCamId(z.cam_id)}</td>
                        <td className="py-2.5 text-muted-foreground">{z.zone_name}</td>
                        <td className="py-2.5 text-right font-mono text-foreground">{z.visits}</td>
                        <td className={`py-2.5 text-right font-mono font-medium ${getHrsColor(z.total_hrs)}`}>{z.total_hrs.toFixed(1)}</td>
                        <td className="py-2.5 text-right font-mono text-foreground">{z.avg_min.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center">No zone analytics data available</p>
              )}
            </div>

            {/* Section 3: 7-day Trend Chart */}
            <div className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">7-Day Presence Trend</h3>
              {trendChartData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendChartData.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px", color: "hsl(var(--foreground))" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    {trendChartData.cameras.map((camId, i) => (
                      <Line key={camId} type="monotone" dataKey={camId} stroke={LINE_COLORS[i % LINE_COLORS.length]} name={formatCamId(camId)} dot={{ r: 2 }} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center">No trend data available</p>
              )}
            </div>

            {/* Section 4: Recent Alerts Table */}
            <div className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Alerts ({alerts.length})</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Camera</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Zone</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Duration</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-colors border-l-2 border-l-destructive">
                      <td className="py-2.5 pl-3 text-foreground font-mono font-medium">{formatCamId(a.cam_id)}</td>
                      <td className="py-2.5 text-muted-foreground">{a.zone_name}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] border bg-destructive/10 text-destructive border-destructive/20 font-medium">
                          {a.alert_type}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono text-foreground">{formatDuration(a.duration_sec)}</td>
                      <td className="py-2.5 text-right font-mono text-muted-foreground">{formatAlertTimestamp(a.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
