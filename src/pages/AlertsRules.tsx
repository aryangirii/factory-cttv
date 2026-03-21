import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";

const rules = [
  { id: 1, name: "No Personnel Detection", description: "Alert when no person detected at machinery for >30 seconds", zone: "All Zones", severity: "critical", enabled: true, cooldown: "30s" },
  { id: 2, name: "PPE Non-Compliance", description: "Detect workers without required safety gear", zone: "All Zones", severity: "high", enabled: true, cooldown: "60s" },
  { id: 3, name: "Unsafe Behavior Pattern", description: "AI-detected unsafe worker behavior near machinery", zone: "Zone A, B", severity: "high", enabled: true, cooldown: "120s" },
  { id: 4, name: "Fire/Smoke Detection", description: "Immediate alert on fire or smoke detection", zone: "All Zones", severity: "critical", enabled: true, cooldown: "0s" },
  { id: 5, name: "Air Quality Threshold", description: "Alert when air quality drops below safe levels", zone: "Zone C", severity: "medium", enabled: true, cooldown: "300s" },
  { id: 6, name: "Machine Overheat", description: "Temperature exceeding safe operating range", zone: "Zone A, B", severity: "high", enabled: false, cooldown: "60s" },
  { id: 7, name: "Overcrowding Detection", description: "Zone capacity exceeded warning", zone: "All Zones", severity: "medium", enabled: true, cooldown: "180s" },
];

export default function AlertsRules() {
  const [ruleState, setRuleState] = useState(rules);

  const toggleRule = (id: number) => {
    setRuleState((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Alerts & Rules</h2>
            <p className="text-xs text-muted-foreground">Configure AI-powered alert rules and notification preferences</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
            <Plus size={14} /> Create Rule
          </button>
        </div>

        <div className="space-y-3">
          {ruleState.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl bg-card border border-border/50 flex items-center justify-between ${!rule.enabled ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <Bell size={16} className={`${
                  rule.severity === "critical" ? "text-destructive" : rule.severity === "high" ? "text-warning" : "text-primary"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-semibold text-foreground">{rule.name}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      rule.severity === "critical" ? "bg-destructive/10 text-destructive" :
                      rule.severity === "high" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                    }`}>{rule.severity}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{rule.description}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[9px] text-muted-foreground">Zone: {rule.zone}</span>
                    <span className="text-[9px] text-muted-foreground">Cooldown: {rule.cooldown}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded text-[10px] bg-secondary border border-border text-foreground hover:bg-muted transition-colors">Edit</button>
                <button onClick={() => toggleRule(rule.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {rule.enabled ? <ToggleRight size={24} className="text-success" /> : <ToggleLeft size={24} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
