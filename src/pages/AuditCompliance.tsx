import DashboardLayout from "@/components/DashboardLayout";

export default function AuditCompliance() {
  const logs = [
    { time: "14:20:01", user: "System", action: "AI Alert Triggered", details: "No personnel at MCH-003 for >30s", type: "alert" },
    { time: "14:18:02", user: "John Martinez", action: "Alert Acknowledged", details: "INC-002 - Unsafe Behavior", type: "action" },
    { time: "14:15:00", user: "System", action: "Shift Change Logged", details: "Morning to Afternoon - Zone A", type: "system" },
    { time: "13:45:33", user: "Deepak Joshi", action: "Safety Inspection", details: "Zone A routine inspection completed", type: "compliance" },
    { time: "13:30:00", user: "System", action: "AI Model Retrained", details: "PPE Detection v3.2 updated", type: "system" },
    { time: "12:30:12", user: "Amit Singh", action: "Incident Resolved", details: "INC-005 - Machine Overheat", type: "action" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Audit & Compliance</h2>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Compliance Score", value: "94.2%", sub: "Target: 95%" },
            { label: "Audits Completed", value: "12/15", sub: "This month" },
            { label: "Days Since Last Incident", value: "3", sub: "Previous: 7 days" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-card border border-border/50">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-mono font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-card border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Audit Trail</h3>
          <div className="space-y-0">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-border/30 last:border-0">
                <span className="text-[10px] font-mono text-muted-foreground w-16 flex-shrink-0 pt-0.5">{log.time}</span>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  log.type === "alert" ? "bg-destructive" : log.type === "action" ? "bg-success" :
                  log.type === "compliance" ? "bg-primary" : "bg-muted-foreground"
                }`} />
                <div>
                  <p className="text-xs text-foreground font-medium">{log.action}</p>
                  <p className="text-[10px] text-muted-foreground">{log.user} · {log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
