import { useCallback } from "react";
import { ShieldCheck, Activity, Brain, Map as MapIcon, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import CameraFeedCard from "@/components/CameraFeedCard";
import ZoneCard from "@/components/ZoneCard";
import AlertsPanel from "@/components/AlertsPanel";
import AIPerformancePanel from "@/components/AIPerformancePanel";
import RealTimeChart from "@/components/RealTimeChart";
import SystemHealthPanel from "@/components/SystemHealthPanel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { fetchCameras, fetchStatus, fetchSafetyScores, fetchAlerts, formatCamId, formatTimestamp } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";

const zonePerformanceData = [
  { time: "00:00", zoneA: 68, zoneB: 78, zoneC: 92, zoneD: 88 },
  { time: "04:00", zoneA: 72, zoneB: 82, zoneC: 94, zoneD: 90 },
  { time: "08:00", zoneA: 65, zoneB: 85, zoneC: 96, zoneD: 91 },
  { time: "12:00", zoneA: 70, zoneB: 80, zoneC: 95, zoneD: 89 },
  { time: "16:00", zoneA: 74, zoneB: 84, zoneC: 97, zoneD: 92 },
  { time: "20:00", zoneA: 71, zoneB: 83, zoneC: 95, zoneD: 91 },
  { time: "24:00", zoneA: 73, zoneB: 86, zoneC: 96, zoneD: 93 },
];

export default function OverviewDashboard() {
  const camerasApi = useApiData({ fetchFn: fetchCameras });
  const statusApi = useApiData({ fetchFn: fetchStatus });
  const scoresApi = useApiData({ fetchFn: fetchSafetyScores });
  const alertsApi = useApiData({ fetchFn: useCallback(() => fetchAlerts(10), []) });

  const cameras = camerasApi.data || [];
  const statuses = statusApi.data || [];
  const scores = scoresApi.data || [];
  const alerts = alertsApi.data;

  const avgSafetyScore = scores.length > 0
    ? (scores.reduce((s, x) => s + x.safety_score, 0) / scores.length).toFixed(1)
    : "—";
  const totalAlerts = scores.reduce((s, x) => s + x.alert_count, 0);
  const totalDetections = scores.reduce((s, x) => s + x.detection_count, 0);
  const activeAlertCount = alerts?.count || 0;

  // Pick first 2 cameras for the overview CCTV section
  const overviewCameras = cameras.slice(0, 2);

  // Group statuses by zone_name for zone cards
  const zoneMap: Map<string, { workers: number; cameras: number; alerts: number }> = new Map();
  statuses.forEach((s) => {
    const existing = zoneMap.get(s.zone_name) || { workers: 0, cameras: 0, alerts: 0 };
    existing.workers += s.worker_count;
    existing.cameras += 1;
    if (s.worker_count === 0) existing.alerts += 1;
    zoneMap.set(s.zone_name, existing);
  });
  const zoneEntries = Array.from(zoneMap.entries()).slice(0, 4);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="AI Safety Score" value={`${avgSafetyScore}%`} change={`${cameras.length} cams`} icon={ShieldCheck} color="success" />
          <StatCard label="Total Detections" value={totalDetections.toLocaleString()} change={`${totalAlerts} alerts`} icon={Activity} color="primary" />
          <StatCard label="Active Alerts" value={String(activeAlertCount)} icon={Brain} color={activeAlertCount > 0 ? "destructive" : "success"} />
          <StatCard label="Camera Coverage" value={`${cameras.length}`} change="active" icon={MapIcon} color="primary" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9 space-y-6">
            {/* CCTV Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Live AI-Powered CCTV Monitoring</h2>
                <div className="flex gap-2">
                  <a href="/cctv" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/80 transition-colors">
                    <CameraIcon size={12} /> View All Cameras
                  </a>
                </div>
              </div>
              {camerasApi.loading && !camerasApi.data ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {overviewCameras.map((cam) => {
                    const zones = statuses.filter((s) => s.cam_id === cam.cam_id);
                    return (
                      <CameraFeedCard
                        key={cam.cam_id}
                        id={formatCamId(cam.cam_id)}
                        name={formatCamId(cam.cam_id)}
                        zone={zones.length > 0 ? zones[0].zone_name : "Unknown"}
                        initialCount={cam.worker_count}
                        aiModels={["Worker Detection"]}
                        timestamp={formatTimestamp(cam.timestamp)}
                        hasActiveAlert={!!(alerts?.alerts?.find(a => a.cam_id === cam.cam_id))}
                        zones={zones.map((z) => ({
                          name: z.zone_name,
                          workerCount: z.worker_count,
                          timestamp: formatTimestamp(z.timestamp),
                        }))}
                      />
                    );
                  })}
                </div>
              )}
              <div className="mt-2 text-right text-[10px] text-muted-foreground font-mono">
                AI Processing: <span className="text-success font-bold">{totalDetections.toLocaleString()} detections</span> · Cameras: <span className="text-primary font-bold">{cameras.length}</span>
              </div>
            </div>

            {/* Zone Analytics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Zone Analytics & Performance</h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {zoneEntries.map(([zoneName, data], i) => (
                  <ZoneCard
                    key={zoneName}
                    name={zoneName}
                    subtitle={`${data.cameras} camera${data.cameras !== 1 ? "s" : ""}`}
                    safetyScore={data.alerts === 0 ? 96 : Math.max(60, 96 - data.alerts * 10)}
                    workers={data.workers}
                    alerts={data.alerts}
                    productivity={data.workers > 0 ? 92 : 40}
                    alertType={data.alerts > 1 ? "critical" : data.alerts === 1 ? "warning" : "none"}
                    delay={i}
                  />
                ))}
              </div>
            </div>

            {/* Zone Performance Trends */}
            <div className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Zone Performance Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={zonePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 32%, 17%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} stroke="hsl(217, 32%, 17%)" />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} stroke="hsl(217, 32%, 17%)" domain={[60, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 7%)", border: "1px solid hsl(217, 32%, 17%)", borderRadius: "8px", fontSize: "11px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="zoneA" stroke="hsl(0, 84%, 60%)" name="Zone A" dot={{ r: 3 }} strokeWidth={2} />
                  <Line type="monotone" dataKey="zoneB" stroke="hsl(38, 92%, 50%)" name="Zone B" dot={{ r: 3 }} strokeWidth={2} />
                  <Line type="monotone" dataKey="zoneC" stroke="hsl(142, 71%, 45%)" name="Zone C" dot={{ r: 3 }} strokeWidth={2} />
                  <Line type="monotone" dataKey="zoneD" stroke="hsl(217, 91%, 60%)" name="Zone D" dot={{ r: 3 }} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <RealTimeChart />
              <SystemHealthPanel />
            </div>

            <AIModelsSection />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            <AIPerformancePanel />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <span className="text-warning">⚠</span> Recent Safety Incidents
              </h2>
              <AlertsPanel />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function CameraIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

function AIModelsSection() {
  const models = [
    { name: "PPE Detection v3.2", status: "Active", accuracy: "96.8%", confidence: "94.2%", processed: "3,247", rate: "12/hour" },
    { name: "Fall Detection v2.8", status: "Active", accuracy: "93.5%", confidence: "91.8%", processed: "1,856", rate: "2/day" },
    { name: "Behavior Analysis v1.5", status: "Training", accuracy: "87.2%", confidence: "84.6%", processed: "73%", rate: "ETA: 2h 15m" },
    { name: "Fire Detection v4.1", status: "Active", accuracy: "98.9%", confidence: "97.3%", processed: "2,194", rate: "0/day" },
    { name: "Machine Health v2.3", status: "Active", accuracy: "89.7%", confidence: "86.4%", processed: "847", rate: "3 alerts" },
    { name: "Air Quality v1.9", status: "Active", accuracy: "92.1%", confidence: "88.9%", processed: "1,440", rate: "1 alert" },
  ];

  return (
    <div className="p-5 rounded-xl bg-card border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">AI Models Hub & Performance</h3>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] text-success font-medium">All Models Active</span>
          <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/80 transition-colors">
            + Deploy New Model
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {models.map((model, i) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 rounded-lg bg-secondary/30 border border-border/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-foreground">{model.name}</h4>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                model.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>
                {model.status}
              </span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="font-mono text-foreground">{model.accuracy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-mono text-foreground">{model.confidence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{model.status === "Training" ? "Progress:" : "Processed:"}</span>
                <span className="font-mono text-foreground">{model.processed}</span>
              </div>
            </div>
            <div className="flex gap-1.5 mt-3">
              <button className="flex-1 py-1 rounded text-[9px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                View Details
              </button>
              <button className="flex-1 py-1 rounded text-[9px] font-medium bg-secondary border border-border text-foreground hover:bg-muted transition-colors">
                {model.status === "Training" ? "Monitor" : "Configure"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
