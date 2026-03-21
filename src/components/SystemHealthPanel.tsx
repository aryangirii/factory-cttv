import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HealthMetric {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export default function SystemHealthPanel() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    { label: "GPU Usage (AI Processing)", value: 78, unit: "%", color: "bg-primary" },
    { label: "Memory Usage", value: 84, unit: "%", color: "bg-warning" },
    { label: "Network Throughput", value: 2.1, unit: "Gbps", color: "bg-purple-500" },
    { label: "AI Model Load", value: 67, unit: "%", color: "bg-success" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: Math.max(10, Math.min(99, m.value + (Math.random() - 0.5) * 5)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 rounded-xl bg-card border border-border/50">
      <h3 className="text-sm font-semibold text-foreground mb-4">System Health</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-mono font-bold text-foreground">
                {typeof metric.value === "number" && metric.value % 1 !== 0
                  ? metric.value.toFixed(1)
                  : Math.round(metric.value)}
                {metric.unit === "%" ? "%" : ` ${metric.unit}`}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${metric.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.unit === "%" ? metric.value : (metric.value / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-xl font-mono font-bold text-success">99.98%</p>
          <p className="text-[10px] text-muted-foreground">AI Uptime</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-mono font-bold text-primary">12ms</p>
          <p className="text-[10px] text-muted-foreground">AI Response Time</p>
        </div>
      </div>
    </div>
  );
}
