import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";

const models = [
  { name: "PPE Detection v3.2", status: "Active", accuracy: "96.8%", confidence: "94.2%", processed: "3,247", rate: "12/hour", actions: ["View Details", "Retrain"] },
  { name: "Fall Detection v2.8", status: "Active", accuracy: "93.5%", confidence: "91.8%", processed: "1,856", rate: "2/day", actions: ["View Details", "Retrain"] },
  { name: "Behavior Analysis v1.5", status: "Training", accuracy: "87.2%", confidence: "84.6%", processed: "73%", rate: "ETA: 2h 15m", actions: ["Monitor Training", "Stop Training"] },
  { name: "Fire Detection v4.1", status: "Active", accuracy: "98.9%", confidence: "97.3%", processed: "2,194", rate: "0/day", actions: ["View Details", "Configure"] },
  { name: "Machine Health v2.3", status: "Active", accuracy: "89.7%", confidence: "86.4%", processed: "847", rate: "3 alerts", actions: ["View Predictions", "Optimize"] },
  { name: "Air Quality v1.9", status: "Active", accuracy: "92.1%", confidence: "88.9%", processed: "1,440", rate: "1 alert", actions: ["View Data", "Calibrate"] },
];

export default function AIModelsHub() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Models Hub & Performance</h2>
            <p className="text-xs text-muted-foreground">Manage and monitor all deployed AI models</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-success font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              All Models Active
            </span>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/80 transition-colors">
              + Deploy New Model
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl bg-card border border-border/50 hover:border-border transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">{model.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                  model.status === "Active"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }`}>
                  {model.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-mono font-bold text-foreground">{model.accuracy}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-mono text-foreground">{model.confidence}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{model.status === "Training" ? "Training Progress:" : "Processed Today:"}</span>
                  <span className="font-mono text-foreground">{model.processed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{model.status === "Training" ? "ETA:" : "Detection Rate:"}</span>
                  <span className="font-mono text-foreground">{model.rate}</span>
                </div>

                {model.status === "Training" && (
                  <div className="mt-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div className="h-full bg-warning rounded-full" initial={{ width: 0 }} animate={{ width: "73%" }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {model.actions.map((action) => (
                  <button
                    key={action}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-medium bg-secondary border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
