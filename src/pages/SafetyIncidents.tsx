import DashboardLayout from "@/components/DashboardLayout";
import AlertsPanel from "@/components/AlertsPanel";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const stats = [
  { label: "Total Incidents (24h)", value: "7", color: "text-foreground" },
  { label: "Critical", value: "2", color: "text-destructive" },
  { label: "High", value: "3", color: "text-warning" },
  { label: "Resolved", value: "5", color: "text-success" },
];

const incidentLog = [
  { id: "INC-001", time: "14:18:02", zone: "Zone B", type: "No Personnel Detected", severity: "critical", status: "Active" },
  { id: "INC-002", time: "14:15:44", zone: "Zone B", type: "Unsafe Behavior Pattern", severity: "high", status: "Active" },
  { id: "INC-003", time: "14:12:18", zone: "Zone C", type: "Air Quality Threshold", severity: "medium", status: "Acknowledged" },
  { id: "INC-004", time: "13:45:33", zone: "Zone A", type: "PPE Violation", severity: "high", status: "Resolved" },
  { id: "INC-005", time: "12:30:12", zone: "Zone D", type: "Machine Overheat", severity: "high", status: "Resolved" },
  { id: "INC-006", time: "11:15:45", zone: "Zone A", type: "Fall Detected", severity: "critical", status: "Resolved" },
  { id: "INC-007", time: "10:02:18", zone: "Zone B", type: "PPE Violation", severity: "medium", status: "Resolved" },
];

export default function SafetyIncidents() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Safety Incidents</h2>

        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-card border border-border/50">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Incident Log</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Time</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Zone</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Severity</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentLog.map((inc) => (
                    <motion.tr
                      key={inc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-3 font-mono text-muted-foreground">{inc.id}</td>
                      <td className="py-3 font-mono">{inc.time}</td>
                      <td className="py-3">{inc.zone}</td>
                      <td className="py-3 text-foreground font-medium">{inc.type}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          inc.severity === "critical" ? "bg-destructive/10 text-destructive" :
                          inc.severity === "high" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                        }`}>{inc.severity}</span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-medium ${
                          inc.status === "Active" ? "text-destructive" : inc.status === "Acknowledged" ? "text-warning" : "text-success"
                        }`}>{inc.status}</span>
                      </td>
                      <td className="py-3 text-right">
                        <button className="px-2 py-1 rounded text-[9px] bg-secondary border border-border text-foreground hover:bg-muted transition-colors">
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-span-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Live Alerts</h3>
            <AlertsPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
