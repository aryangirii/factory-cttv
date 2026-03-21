import { useState, useCallback, useMemo, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Loader2, AlertOctagon, X, Filter, RotateCcw, Play, Video } from "lucide-react";
import { fetchCameras, fetchStatus, fetchAlerts, fetchSafetyScores, extractTimeFromFilename, formatFileSize, formatCamId, formatTimestamp } from "@/services/api";
import type { CameraData, ZoneStatus, AlertData, VideoItem } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";

const ALL_CAM_IDS = Array.from({ length: 17 }, (_, i) => `cam${i + 1}`);


const API = import.meta.env.VITE_URL || 'https://13.126.220.97:8443';
const STREAM_API = import.meta.env.VITE_URL || 'https://13.126.220.97:8443';
const H = { 'ngrok-skip-browser-warning': 'true' };
export default function CCTVMonitor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("2026-03-16");
  const [filterTimeFrom, setFilterTimeFrom] = useState("");
  const [filterTimeTo, setFilterTimeTo] = useState("");
  const [activeFilter, setActiveFilter] = useState<{ date: string; from: string; to: string } | null>(null);
  const [filterMessage, setFilterMessage] = useState("");

  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyTimestamp, setEmergencyTimestamp] = useState("");

  const [selectedCamId, setSelectedCamId] = useState("cam1");
  const [videosLoading, setVideosLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [videoList, setVideoList] = useState<VideoItem[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const camerasApi = useApiData<CameraData[]>({ fetchFn: fetchCameras });
  const statusApi = useApiData<ZoneStatus[]>({ fetchFn: fetchStatus });
  const alertsApi = useApiData<{ alerts: AlertData[]; count: number }>({
    fetchFn: useCallback(() => fetchAlerts(50), []),
  });
  const scoresApi = useApiData({ fetchFn: fetchSafetyScores });

  const cameras = camerasApi.data || [];
  const statuses = statusApi.data || [];
  const totalDetections = scoresApi.data?.reduce((sum, s) => sum + s.detection_count, 0) || 0;

  const cameraAlertStatus = useMemo(() => {
    const map = new Map<string, "ok" | "partial" | "alert" | "nodata">();
    const camZones = new Map<string, ZoneStatus[]>();
    statuses.forEach((s) => {
      const arr = camZones.get(s.cam_id) || [];
      arr.push(s);
      camZones.set(s.cam_id, arr);
    });
    cameras.forEach((cam) => {
      const zones = camZones.get(cam.cam_id);
      if (!zones || zones.length === 0) { map.set(cam.cam_id, "nodata"); return; }
      const allEmpty = zones.every((z) => z.worker_count === 0);
      const allOccupied = zones.every((z) => z.worker_count > 0);
      if (allEmpty) map.set(cam.cam_id, "alert");
      else if (allOccupied) map.set(cam.cam_id, "ok");
      else map.set(cam.cam_id, "partial");
    });
    return map;
  }, [cameras, statuses]);

  const filteredStatuses = useMemo(() => {
    if (!activeFilter) return statuses;
    return statuses.filter((s) => {
      try {
        const d = new Date(s.timestamp);
        const dateStr = d.toISOString().split("T")[0];
        if (dateStr !== activeFilter.date) return false;
        const timeStr = d.toTimeString().slice(0, 5);
        if (activeFilter.from && timeStr < activeFilter.from) return false;
        if (activeFilter.to && timeStr > activeFilter.to) return false;
        return true;
      } catch { return false; }
    });
  }, [statuses, activeFilter]);

  const activeStatuses = activeFilter ? filteredStatuses : statuses;

  const filteredCameras = useMemo(() => {
    let cams = cameras;
    if (searchQuery.trim()) {
      cams = cams.filter((c) =>
        c.cam_id.toLowerCase().includes(searchQuery.toLowerCase().replace(/[-\s]/g, ""))
      );
    }
    if (activeFilter) {
      const camIdsInWindow = new Set(activeStatuses.map((s) => s.cam_id));
      cams = cams.filter((c) => camIdsInWindow.has(c.cam_id));
    }
    return cams;
  }, [cameras, searchQuery, activeFilter, activeStatuses]);

  const isRefreshing = camerasApi.refreshing || statusApi.refreshing;
  const lastUpdated = camerasApi.lastUpdated;
  const hasError = camerasApi.error || statusApi.error;

  const handleApplyFilter = () => {
    if (!filterDate) return;
    setActiveFilter({ date: filterDate, from: filterTimeFrom, to: filterTimeTo });
    const parts = filterDate.split("-");
    const dateLabel = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const timeLabel = filterTimeFrom || filterTimeTo ? ` between ${filterTimeFrom || "00:00"} - ${filterTimeTo || "23:59"}` : "";
    setFilterMessage(`Showing data for ${dateLabel}${timeLabel}`);
  };

  const handleResetFilter = () => {
    setActiveFilter(null);
    setFilterMessage("");
    setFilterTimeFrom("");
    setFilterTimeTo("");
    setFilterDate("2026-03-16");
  };

  const handleEmergencyStop = () => {
    setShowEmergencyConfirm(false);
    setEmergencyActive(true);
    setEmergencyTimestamp(new Date().toLocaleString("en-US", { hour12: false }));
  };

  // ✅ FIXED: loadVideo uses STREAM_API for video streaming
  const loadVideo = async () => {
    const camIdLower = selectedCamId.toLowerCase().replace('cam-', 'cam');
    setVideosLoading(true);
    try {
      const res = await fetch(`${API}/video-list/${camIdLower}`, { headers: H });
      const data = await res.json();
      const small = data.videos.filter((v: VideoItem) => v.name.includes('small'));
      if (small.length > 0) {
        setVideoList(small);
        setCurrentVideo(small[0].name);
        const streamUrl = `${STREAM_API}/stream/${camIdLower}/${small[0].name}`;
        if (videoRef.current) {
          videoRef.current.src = streamUrl;
          videoRef.current.load();
          videoRef.current.play().catch(e => console.log('Play error:', e));
        }
      }
    } catch (e) {
      console.log('Load video error:', e);
    } finally {
      setVideosLoading(false);
    }
  };

  // ✅ FIXED: playVideo uses STREAM_API for video streaming
  const playVideo = (filename: string) => {
    const camIdLower = selectedCamId.toLowerCase().replace('cam-', 'cam');
    const streamUrl = `${STREAM_API}/stream/${camIdLower}/${filename}`;
    setCurrentVideo(filename);
    if (videoRef.current) {
      videoRef.current.src = streamUrl;
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log('Play error:', e));
    }
  };

  const getZonesForCamera = (camId: string) => activeStatuses.filter((s) => s.cam_id === camId);

  const statusBadge = (camId: string) => {
    const s = cameraAlertStatus.get(camId) || "nodata";
    switch (s) {
      case "alert": return { bg: "bg-destructive/10 border-destructive/20 text-destructive", label: "ALERT", dot: "bg-destructive" };
      case "partial": return { bg: "bg-amber-500/10 border-amber-500/20 text-amber-400", label: "PARTIAL", dot: "bg-amber-400" };
      case "ok": return { bg: "bg-success/10 border-success/20 text-success", label: "OK", dot: "bg-success" };
      default: return { bg: "bg-muted/20 border-muted/30 text-muted-foreground", label: "NO DATA", dot: "bg-muted-foreground" };
    }
  };

  return (
    <DashboardLayout>
      {/* Emergency Stop Full-Screen Overlay */}
      <AnimatePresence>
        {emergencyActive && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-destructive flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center"
            >
              <AlertOctagon size={96} className="mx-auto mb-6 text-white" />
              <h1 className="text-5xl font-black text-white tracking-tight mb-4">EMERGENCY STOP ACTIVATED</h1>
              <p className="text-xl font-mono text-white/80">{emergencyTimestamp}</p>
            </motion.div>
            <button onClick={() => setEmergencyActive(false)} className="mt-12 px-8 py-3 bg-white text-destructive font-bold rounded-lg text-lg hover:bg-white/90 transition-colors flex items-center gap-2">
              <X size={20} /> Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Confirm Modal */}
      <AnimatePresence>
        {showEmergencyConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowEmergencyConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-destructive/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <AlertOctagon size={48} className="mx-auto mb-4 text-destructive" />
                <h2 className="text-xl font-bold text-foreground mb-2">Emergency Stop</h2>
                <p className="text-sm text-muted-foreground mb-6">Are you sure you want to activate the emergency stop?</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowEmergencyConfirm(false)} className="flex-1 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleEmergencyStop} className="flex-1 py-2.5 rounded-lg bg-destructive text-white text-sm font-bold hover:bg-destructive/90 transition-colors">Confirm Stop</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Live CCTV Monitoring</h2>
            <p className="text-xs text-muted-foreground">
              {cameras.length} cameras active · {totalDetections.toLocaleString()} total detections
              {isRefreshing && <span className="inline-flex items-center gap-1 ml-2 text-primary"><Loader2 size={10} className="animate-spin" /> Refreshing...</span>}
            </p>
            {lastUpdated && <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Last updated: {lastUpdated.toLocaleTimeString("en-US", { hour12: false })}</p>}
            {hasError && <p className="text-[10px] text-amber-400 mt-0.5">⚠ API error — showing last known data</p>}
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => setShowEmergencyConfirm(true)} className="px-4 py-1.5 rounded-lg bg-destructive text-white text-xs font-bold hover:bg-destructive/90 transition-colors flex items-center gap-1.5">
              <AlertOctagon size={14} /> Emergency Stop
            </button>
            <button onClick={() => { camerasApi.refresh(); statusApi.refresh(); alertsApi.refresh(); }} className="p-1.5 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-4 p-4 rounded-xl bg-card border border-border/50">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Camera</label>
              <select
                value={selectedCamId}
                onChange={(e) => setSelectedCamId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {ALL_CAM_IDS.map((id) => (
                  <option key={id} value={id}>{formatCamId(id)}</option>
                ))}
              </select>
            </div>
            <button
              onClick={loadVideo}
              disabled={videosLoading}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/80 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {videosLoading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} Load Video
            </button>

            <div className="w-px h-6 bg-border/50 mx-1" />

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="e.g. CAM-1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs w-32 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Date</label>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">From</label>
              <input type="time" value={filterTimeFrom} onChange={(e) => setFilterTimeFrom(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">To</label>
              <input type="time" value={filterTimeTo} onChange={(e) => setFilterTimeTo(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button onClick={handleApplyFilter} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/80 transition-colors flex items-center gap-1.5"><Filter size={12} /> Apply</button>
            <button onClick={handleResetFilter} className="px-4 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground text-xs font-medium hover:text-foreground transition-colors flex items-center gap-1.5"><RotateCcw size={12} /> Reset</button>
          </div>
          {filterMessage && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-primary font-medium">{filterMessage}</span>
              <span className="text-muted-foreground">{filteredCameras.length} camera{filteredCameras.length !== 1 ? "s" : ""} found</span>
            </div>
          )}
        </div>

        {/* Video Player Section */}
        <div className="grid grid-cols-10 gap-4 mb-6">
          {/* Left: Video Player 70% */}
          <div className="col-span-7 rounded-xl bg-card border border-border/50 overflow-hidden">
            <div className="p-3 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Video size={14} className="text-primary" /> {formatCamId(selectedCamId)}
                </h3>
                {currentVideo && <p className="text-[10px] text-muted-foreground font-mono">{currentVideo}</p>}
              </div>
              {currentVideo && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium bg-destructive/10 border-destructive/20 text-destructive">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /> STREAMING
                </span>
              )}
            </div>
            <div className="aspect-video bg-background flex items-center justify-center">
              {!currentVideo ? (
                <div className="text-center text-muted-foreground">
                  <Video size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Select a camera and click "Load Video"</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  controls
                  muted
                  crossOrigin="anonymous"
                  preload="auto"
                  style={{ width: '100%', height: '100%' }}
                  onCanPlay={() => videoRef.current?.play()}
                  onError={() => console.log('Video load error')}
                />
              )}
            </div>
          </div>

          {/* Right: Video List 30% */}
          <div className="col-span-3 rounded-xl bg-card border border-border/50 flex flex-col max-h-[500px]">
            <div className="p-3 border-b border-border/50">
              <h3 className="text-xs font-semibold text-foreground">Video List — {formatCamId(selectedCamId)}</h3>
              <p className="text-[10px] text-muted-foreground">{videoList.length} recordings</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {videosLoading ? (
                <div className="flex items-center justify-center py-10"><Loader2 size={20} className="animate-spin text-primary" /></div>
              ) : videoList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-xs text-muted-foreground gap-2">
                  <Video size={20} className="opacity-30" />
                  <span>No videos loaded</span>
                </div>
              ) : (
                videoList.map((v) => {
                  const isActive = currentVideo === v.name;
                  return (
                    <button
                      key={v.name}
                      onClick={() => playVideo(v.name)}
                      className={`w-full text-left px-3 py-2.5 border-b border-border/30 transition-colors hover:bg-secondary/50 ${isActive ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isActive && <Play size={10} className="text-primary" />}
                          <span className="text-xs font-mono text-foreground">{extractTimeFromFilename(v.name)}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{formatFileSize(v.size)}</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground font-mono mt-0.5 truncate">{v.name}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Camera Status Grid */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Camera Zone Status</h3>
        <div className="grid grid-cols-4 gap-3">
          {filteredCameras.map((cam) => {
            const zones = getZonesForCamera(cam.cam_id);
            const badge = statusBadge(cam.cam_id);
            const camStatus = cameraAlertStatus.get(cam.cam_id) || "nodata";

            return (
              <motion.div
                key={cam.cam_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-card border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono text-foreground">{formatCamId(cam.cam_id)}</span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-medium uppercase ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} /> {badge.label}
                  </span>
                </div>
                <div className="space-y-1">
                  {zones.map((z) => {
                    const zoneWorkers = z.worker_count;
                    let dotColor = "bg-muted-foreground";
                    let label = "empty";
                    if (zoneWorkers > 0) {
                      dotColor = "bg-success";
                      label = `${zoneWorkers} worker${zoneWorkers !== 1 ? "s" : ""}`;
                    } else if (camStatus === "alert") {
                      dotColor = "bg-destructive";
                      label = "ALERT";
                    }
                    return (
                      <div key={z.zone_name} className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">{z.zone_name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono ${zoneWorkers > 0 ? "text-success" : camStatus === "alert" ? "text-destructive" : "text-muted-foreground"}`}>{label}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        </div>
                      </div>
                    );
                  })}
                  {zones.length === 0 && <p className="text-[10px] text-muted-foreground">No zone data</p>}
                </div>
                <p className="text-[9px] text-muted-foreground font-mono mt-2">{formatTimestamp(cam.timestamp)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
