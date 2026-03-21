import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Eye } from "lucide-react";

interface ZoneInfo {
  name: string;
  workerCount: number;
  timestamp: string;
}

interface CameraFeedProps {
  id: string;
  name: string;
  zone: string;
  initialCount: number;
  aiModels: string[];
  temperature?: string;
  timestamp?: string;
  zones?: ZoneInfo[];
  hasActiveAlert?: boolean;
}

export default function CameraFeedCard({ id, name, zone, initialCount, aiModels, temperature, timestamp, zones, hasActiveAlert }: CameraFeedProps) {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const count = initialCount;

  // Compute status from zones if available
  const allZonesEmpty = zones && zones.length > 0 && zones.every(z => z.workerCount === 0);
  const someZonesOccupied = zones && zones.length > 0 && zones.some(z => z.workerCount > 0);
  const allZonesOccupied = zones && zones.length > 0 && zones.every(z => z.workerCount > 0);

  const status: "ok" | "partial" | "alert" | "nodata" =
    !zones || zones.length === 0 ? "nodata" :
    allZonesOccupied ? "ok" :
    someZonesOccupied ? "partial" :
    "alert";

  const borderClass =
    status === "alert" ? "border-destructive" :
    status === "partial" ? "border-amber-500/50" :
    status === "ok" ? "border-border" : "border-border/50";

  const bgClass = status === "nodata" ? "bg-muted/5" : "";

  const badgeConfig = {
    ok: { bg: "bg-success/10 border-success/20 text-success", dot: "bg-success", label: "OK" },
    partial: { bg: "bg-amber-500/10 border-amber-500/20 text-amber-400", dot: "bg-amber-400", label: "PARTIAL" },
    alert: { bg: "bg-destructive/10 border-destructive/20 text-destructive animate-pulse", dot: "bg-destructive", label: "ALERT" },
    nodata: { bg: "bg-muted/20 border-muted/30 text-muted-foreground", dot: "bg-muted-foreground", label: "NO DATA" },
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group rounded-xl overflow-hidden bg-card border transition-all duration-500 ${borderClass} ${bgClass}`}
    >
      {/* Video Header Overlay */}
      <div className="absolute top-0 inset-x-0 p-3 z-10 flex justify-between items-start bg-gradient-to-b from-background/90 to-transparent">
        <div>
          <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Camera size={12} className="text-muted-foreground" />
            {name}
          </h3>
          <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">
            {id} · {zone}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider ${badgeConfig.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot} ${status !== "nodata" ? "animate-pulse" : ""}`} />
          {badgeConfig.label}
        </div>
      </div>

      {/* Simulated Video Feed */}
      <div className="aspect-video bg-background relative overflow-hidden scanline">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        {/* Center content: timestamp instead of red watermark, grey icon for empty */}
        <div className="absolute inset-0 flex items-center justify-center">
          {count > 0 ? (
            <span className="text-muted/20 font-black text-4xl tracking-tighter select-none">LIVE FEED</span>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Camera size={48} className="text-muted-foreground/20" />
              {timestamp && (
                <span className="text-[10px] text-muted-foreground/40 font-mono">{timestamp}</span>
              )}
            </div>
          )}
        </div>

        {count > 0 && showBoundingBoxes && (
          <>
            {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute border-2 border-success rounded-sm"
                style={{
                  width: `${60 + Math.random() * 20}px`,
                  height: `${100 + Math.random() * 40}px`,
                  left: `${20 + i * 30}%`,
                  top: `${15 + Math.random() * 20}%`,
                }}
              >
                <span className="absolute -top-4 left-0 bg-success text-[8px] px-1 text-success-foreground font-bold rounded-t-sm">
                  PERSON_{String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute -bottom-3 left-0 text-[7px] text-success font-mono">
                  {(85 + Math.random() * 14).toFixed(1)}%
                </span>
              </motion.div>
            ))}
          </>
        )}

        {/* Red flash only for ALERT (all zones empty) */}
        {status === "alert" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-destructive"
          />
        )}

        <div className="absolute top-3 right-3 z-5 flex items-center gap-1.5 text-[9px] text-destructive font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          REC
        </div>

        <div className="absolute bottom-0 inset-x-0 px-3 py-1.5 bg-background/80 backdrop-blur-sm text-[9px] text-muted-foreground">
          AI Models: {aiModels.join(", ")}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-3 bg-card/80 border-t border-border/50">
        {zones && zones.length > 0 && (
          <div className="mb-2 space-y-1">
            {zones.map((z) => (
              <div key={z.name} className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">{z.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono font-bold ${z.workerCount > 0 ? "text-success" : status === "alert" ? "text-destructive" : "text-muted-foreground"}`}>
                    {z.workerCount > 0 ? `${z.workerCount} worker${z.workerCount !== 1 ? "s" : ""}` : status === "alert" ? "ALERT" : "empty"}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${z.workerCount > 0 ? "bg-success" : status === "alert" ? "bg-destructive" : "bg-muted-foreground"} ${z.workerCount > 0 ? "animate-pulse" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Personnel</span>
              <span className={`text-xl font-mono font-bold ${count > 0 ? "text-foreground" : "text-muted-foreground"}`}>{count}</span>
            </div>
            {temperature && (
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Temp</span>
                <span className="text-sm font-mono text-foreground">{temperature}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {timestamp && (
              <span className="text-[9px] text-muted-foreground font-mono">{timestamp}</span>
            )}
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className="p-1.5 rounded-md bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
