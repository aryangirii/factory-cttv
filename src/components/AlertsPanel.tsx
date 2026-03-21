import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { fetchAlerts, formatCamId, formatTimestamp } from "@/services/api";
import type { AlertData } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";

interface Alert {
  id: string;
  severity: "critical" | "high" | "medium";
  zone: string;
  camera: string;
  message: string;
  timestamp: string;
  duration: string;
  acknowledged: boolean;
}

const severityStyles = {
  critical: "bg-destructive/5 border-destructive/20 text-destructive",
  high: "bg-warning/5 border-warning/20 text-warning",
  medium: "bg-primary/5 border-primary/20 text-primary",
};

const severityLabels = {
  critical: "AI CRITICAL",
  high: "AI HIGH",
  medium: "AI MEDIUM",
};

function mapAlertToUI(a: AlertData, index: number): Alert {
  return {
    id: `${a.cam_id}-${a.timestamp}-${index}`,
    severity: a.alert_type === "NO_OPERATOR" ? "critical" : "medium",
    zone: a.zone_name,
    camera: formatCamId(a.cam_id),
    message: `No operator detected at ${a.zone_name} for ${a.duration_sec}s`,
    timestamp: formatTimestamp(a.timestamp),
    duration: `${Math.round(a.duration_sec)}s`,
    acknowledged: false,
  };
}

export default function AlertsPanel() {
  const alertsApi = useApiData({
    fetchFn: useCallback(() => fetchAlerts(10), []),
  });

  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const rawAlerts = alertsApi.data?.alerts || [];
  const alerts: Alert[] = rawAlerts.map((a, i) => ({
    ...mapAlertToUI(a, i),
    acknowledged: acknowledged.has(`${a.cam_id}-${a.timestamp}-${i}`),
  }));

  const acknowledge = (id: string) => {
    setAcknowledged((prev) => new Set([...prev, id]));
  };

  return (
    <div className="space-y-3">
      {alertsApi.loading && !alertsApi.data && (
        <p className="text-xs text-muted-foreground animate-pulse">Loading alerts...</p>
      )}
      {alertsApi.error && (
        <p className="text-[10px] text-warning">⚠ {alertsApi.error}</p>
      )}
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className={`p-4 rounded-lg border ${severityStyles[alert.severity]} ${alert.acknowledged ? "opacity-50" : ""}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                alert.severity === "critical" ? "bg-destructive text-destructive-foreground" :
                alert.severity === "high" ? "bg-warning text-warning-foreground" : "bg-primary text-primary-foreground"
              }`}>
                {severityLabels[alert.severity]}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-warning">{alert.duration}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{alert.timestamp}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1 text-[10px] text-muted-foreground">
              <span>{alert.zone} - {alert.camera}</span>
            </div>
            <p className="text-xs text-foreground font-medium mb-3">{alert.message}</p>
            {!alert.acknowledged && (
              <div className="flex gap-2">
                <button
                  onClick={() => acknowledge(alert.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-success text-success-foreground text-[10px] font-medium hover:bg-success/80 transition-colors"
                >
                  <CheckCircle size={10} />
                  Acknowledge
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
