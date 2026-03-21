import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Users, Shield, Clock, AlertTriangle } from "lucide-react";

const employees = [
  { id: "EMP-001", name: "Rajesh Kumar", role: "Machine Operator", zone: "Zone A", status: "Active", shift: "Morning", ppeCompliant: true, hoursToday: "6h 42m" },
  { id: "EMP-002", name: "Sanjay Patel", role: "Welder", zone: "Zone B", status: "Active", shift: "Morning", ppeCompliant: true, hoursToday: "6h 38m" },
  { id: "EMP-003", name: "Amit Singh", role: "Supervisor", zone: "Zone A", status: "Active", shift: "Morning", ppeCompliant: true, hoursToday: "7h 15m" },
  { id: "EMP-004", name: "Priya Sharma", role: "Quality Inspector", zone: "Zone D", status: "Break", shift: "Morning", ppeCompliant: true, hoursToday: "5h 20m" },
  { id: "EMP-005", name: "Mohammed Ali", role: "Packaging Lead", zone: "Zone C", status: "Active", shift: "Morning", ppeCompliant: false, hoursToday: "6h 55m" },
  { id: "EMP-006", name: "Vikram Reddy", role: "Maintenance Tech", zone: "Zone B", status: "Active", shift: "Morning", ppeCompliant: true, hoursToday: "6h 10m" },
  { id: "EMP-007", name: "Suresh Verma", role: "Machine Operator", zone: "Zone A", status: "Active", shift: "Afternoon", ppeCompliant: true, hoursToday: "2h 30m" },
  { id: "EMP-008", name: "Deepak Joshi", role: "Safety Officer", zone: "All Zones", status: "Active", shift: "Morning", ppeCompliant: true, hoursToday: "7h 45m" },
];

export default function EmployeeMonitor() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Employee Monitor</h2>
            <p className="text-xs text-muted-foreground">Real-time worker presence and safety compliance tracking</p>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs">
              <option>All Zones</option>
              <option>Zone A</option>
              <option>Zone B</option>
              <option>Zone C</option>
              <option>Zone D</option>
            </select>
            <select className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs">
              <option>All Shifts</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Night</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Total On-Site", value: "41", color: "text-primary" },
            { icon: Shield, label: "PPE Compliant", value: "95%", color: "text-success" },
            { icon: Clock, label: "Avg Hours Today", value: "6.2h", color: "text-foreground" },
            { icon: AlertTriangle, label: "PPE Violations", value: "2", color: "text-warning" },
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

        {/* Employee Table */}
        <div className="p-5 rounded-xl bg-card border border-border/50">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Employee</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Role</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Zone</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Shift</th>
                <th className="text-center py-2 text-muted-foreground font-medium">PPE</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Hours</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border/30 hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {emp.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{emp.name}</p>
                        <p className="text-[9px] text-muted-foreground font-mono">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-foreground">{emp.role}</td>
                  <td className="py-3 text-muted-foreground">{emp.zone}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                      emp.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                    }`}>{emp.status}</span>
                  </td>
                  <td className="py-3 text-muted-foreground">{emp.shift}</td>
                  <td className="py-3 text-center">
                    {emp.ppeCompliant ? (
                      <span className="text-success">✓</span>
                    ) : (
                      <span className="text-destructive font-bold">✗</span>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono text-foreground">{emp.hoursToday}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
