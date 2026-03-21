import { motion } from "framer-motion";

interface AIMetric {
  label: string;
  value: string;
  sub: string;
  color: "primary" | "success" | "warning";
  dotColor: string;
}

const metrics: AIMetric[] = [
  { label: "Critical AI Alerts", value: "2", sub: "Immediate attention required", color: "warning", dotColor: "bg-destructive" },
  { label: "High Priority", value: "5", sub: "Safety concerns detected", color: "warning", dotColor: "bg-warning" },
  { label: "AI Processing Rate", value: "247/sec", sub: "Real-time analysis", color: "primary", dotColor: "bg-primary" },
  { label: "AI Accuracy", value: "94.2%", sub: "Model performance", color: "success", dotColor: "bg-success" },
];

export default function AIPerformancePanel() {
  return (
    <div className="space-y-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-xl bg-card border border-border/50 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${m.dotColor} animate-pulse`} />
            <div>
              <p className="text-xs font-semibold text-foreground">{m.label}</p>
              <p className="text-[10px] text-muted-foreground">{m.sub}</p>
            </div>
          </div>
          <span className={`text-lg font-mono font-bold ${
            m.color === "success" ? "text-success" : m.color === "warning" ? "text-warning" : "text-primary"
          }`}>
            {m.value}
          </span>
        </motion.div>
      ))}
      <button className="w-full text-center text-xs text-primary hover:text-primary/80 transition-colors py-2">
        View Full <span className="font-semibold bg-primary/10 px-2 py-0.5 rounded">AI Analytics</span> →
      </button>
    </div>
  );
}
