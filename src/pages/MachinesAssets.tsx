import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";

const machines = [
  { id: "MCH-001", name: "Hydraulic Press 01", zone: "Zone A", status: "Running", health: 92, uptime: "99.2%", lastMaintenance: "2 days ago", operator: "R. Kumar" },
  { id: "MCH-002", name: "CNC Router - South", zone: "Zone B", status: "Running", health: 87, uptime: "97.8%", lastMaintenance: "5 days ago", operator: "S. Patel" },
  { id: "MCH-003", name: "Welding Robot Arm", zone: "Zone B", status: "Idle", health: 95, uptime: "99.5%", lastMaintenance: "1 day ago", operator: "—" },
  { id: "MCH-004", name: "Packaging Unit A", zone: "Zone C", status: "Running", health: 78, uptime: "95.1%", lastMaintenance: "8 days ago", operator: "M. Singh" },
  { id: "MCH-005", name: "Dyeing Machine 01", zone: "Zone C", status: "Maintenance", health: 45, uptime: "88.3%", lastMaintenance: "Now", operator: "—" },
  { id: "MCH-006", name: "Thread Spinner 03", zone: "Zone A", status: "Running", health: 91, uptime: "99.0%", lastMaintenance: "3 days ago", operator: "A. Sharma" },
];

export default function MachinesAssets() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Machines & Assets</h2>
            <p className="text-xs text-muted-foreground">{machines.length} machines registered · 4 running · 1 idle · 1 in maintenance</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">+ Register Machine</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {machines.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card border border-border/50 hover:border-border transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">{m.id} · {m.zone}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                  m.status === "Running" ? "bg-success/10 text-success border-success/20" :
                  m.status === "Idle" ? "bg-warning/10 text-warning border-warning/20" :
                  "bg-destructive/10 text-destructive border-destructive/20"
                }`}>{m.status}</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Health Score</span>
                  <span className={`font-mono font-bold ${m.health >= 80 ? "text-success" : m.health >= 60 ? "text-warning" : "text-destructive"}`}>{m.health}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${m.health >= 80 ? "bg-success" : m.health >= 60 ? "bg-warning" : "bg-destructive"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.health}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Uptime:</span><span className="font-mono text-foreground">{m.uptime}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Last Maintenance:</span><span className="text-foreground">{m.lastMaintenance}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Operator:</span><span className="text-foreground">{m.operator}</span></div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View Details</button>
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-medium bg-secondary border border-border text-foreground hover:bg-muted transition-colors">Schedule Maintenance</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
