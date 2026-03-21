import { motion } from "framer-motion";

interface ZoneCardProps {
  name: string;
  subtitle: string;
  safetyScore: number;
  workers: number;
  alerts: number;
  productivity: number;
  alertType?: "critical" | "warning" | "none";
  delay?: number;
}

const borderColors = {
  critical: "border-l-destructive",
  warning: "border-l-warning",
  none: "border-l-success",
};

export default function ZoneCard({ name, subtitle, safetyScore, workers, alerts, productivity, alertType = "none", delay = 0 }: ZoneCardProps) {
  const scoreColor = safetyScore >= 90 ? "text-success" : safetyScore >= 80 ? "text-warning" : "text-destructive";
  const dotColor = alertType === "critical" ? "bg-destructive" : alertType === "warning" ? "bg-warning" : "bg-success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={`p-5 rounded-xl bg-card border border-border/50 border-l-4 ${borderColors[alertType]} hover:border-border transition-all group cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <span className={`w-3 h-3 rounded-full ${dotColor} animate-pulse`} />
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">AI Safety Score:</span>
          <span className={`font-mono font-bold ${scoreColor}`}>{safetyScore}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Active Workers:</span>
          <span className="font-mono font-bold text-foreground">{workers}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{alerts > 0 ? (alertType === "critical" ? "Critical Alerts:" : "Warnings:") : "Alerts:"}</span>
          <span className={`font-mono font-bold ${alerts > 0 ? "text-destructive" : "text-success"}`}>{alerts}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Productivity:</span>
          <span className="font-mono font-bold text-foreground">{productivity}%</span>
        </div>
      </div>

      <button className={`w-full mt-4 py-2 rounded-lg text-xs font-semibold transition-all ${
        alertType === "critical"
          ? "bg-destructive/80 hover:bg-destructive text-destructive-foreground"
          : alertType === "warning"
          ? "bg-warning/80 hover:bg-warning text-warning-foreground"
          : "bg-success/80 hover:bg-success text-success-foreground"
      }`}>
        View Zone Details
      </button>
    </motion.div>
  );
}
