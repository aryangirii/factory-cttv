import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Wrench, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const tasks = [
  { id: "MNT-001", machine: "Dyeing Machine 01", type: "Corrective", priority: "High", status: "In Progress", assignee: "V. Reddy", due: "Today", description: "Motor bearing replacement" },
  { id: "MNT-002", machine: "Hydraulic Press 01", type: "Preventive", priority: "Medium", status: "Scheduled", assignee: "R. Kumar", due: "Tomorrow", description: "Quarterly lubrication service" },
  { id: "MNT-003", machine: "Packaging Unit A", type: "Predictive", priority: "High", status: "Pending", assignee: "Unassigned", due: "2 days", description: "AI predicted belt wear - 78% health score" },
  { id: "MNT-004", machine: "CNC Router", type: "Preventive", priority: "Low", status: "Completed", assignee: "S. Patel", due: "Completed", description: "Coolant system flush" },
];

export default function MaintenanceHub() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Maintenance Hub</h2>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">+ Create Work Order</button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Wrench, label: "Active Tasks", value: "3", color: "text-primary" },
            { icon: Clock, label: "Scheduled", value: "5", color: "text-warning" },
            { icon: AlertTriangle, label: "Overdue", value: "1", color: "text-destructive" },
            { icon: CheckCircle, label: "Completed (Month)", value: "18", color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-card border border-border/50 flex items-center gap-3">
              <s.icon size={20} className={s.color} />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{s.label}</p>
                <p className={`text-xl font-mono font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-card border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Work Orders</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Machine</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Priority</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Assignee</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <motion.tr key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/30 hover:bg-secondary/20 transition-colors cursor-pointer">
                  <td className="py-3 font-mono text-muted-foreground">{task.id}</td>
                  <td className="py-3 text-foreground font-medium">{task.machine}</td>
                  <td className="py-3 text-muted-foreground">{task.description}</td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-medium ${
                    task.type === "Corrective" ? "bg-destructive/10 text-destructive" :
                    task.type === "Predictive" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                  }`}>{task.type}</span></td>
                  <td className="py-3"><span className={`text-[10px] font-bold ${
                    task.priority === "High" ? "text-destructive" : task.priority === "Medium" ? "text-warning" : "text-muted-foreground"
                  }`}>{task.priority}</span></td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                    task.status === "In Progress" ? "bg-primary/10 text-primary border-primary/20" :
                    task.status === "Completed" ? "bg-success/10 text-success border-success/20" :
                    task.status === "Pending" ? "bg-warning/10 text-warning border-warning/20" :
                    "bg-secondary text-foreground border-border"
                  }`}>{task.status}</span></td>
                  <td className="py-3 text-foreground">{task.assignee}</td>
                  <td className="py-3 text-right text-muted-foreground">{task.due}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
