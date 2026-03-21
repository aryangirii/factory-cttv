import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "destructive";
}

const colorMap = {
  primary: "text-primary bg-primary/10 border-primary/20",
  success: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  destructive: "text-destructive bg-destructive/10 border-destructive/20",
};

export default function StatCard({ label, value, change, icon: Icon, color = "primary" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{label}</p>
        <div className={`p-1.5 rounded-lg border ${colorMap[color]}`}>
          <Icon size={14} />
        </div>
      </div>
      <p className="text-2xl font-mono font-bold text-foreground">{value}</p>
      {change && <p className="text-xs text-success mt-1 font-medium">{change}</p>}
    </motion.div>
  );
}
