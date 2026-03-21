const API_BASE = import.meta.env.VITE_URL || "https://kennedy-subparietal-nongrievously.ngrok-free.dev";
const defaultHeaders: Record<string, string> = {
  "ngrok-skip-browser-warning": "true",
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: defaultHeaders });
  if (!res.ok) throw new Error(`API ${path} returned ${res.status}`);
  return res.json();
}

export interface CameraData {
  cam_id: string;
  worker_count: number;
  timestamp: string;
}

export interface ZoneStatus {
  cam_id: string;
  zone_name: string;
  worker_count: number;
  timestamp: string;
}

export interface AlertData {
  cam_id: string;
  zone_name: string;
  alert_type: string;
  duration_sec: number;
  timestamp: string;
}

export interface SafetyScore {
  cam_id: string;
  alert_count: number;
  detection_count: number;
  safety_score: number;
}

export interface ZoneAnalyticsData {
  cam_id: string;
  zone_name: string;
  visits: number;
  total_hrs: number;
  avg_min: number;
}

export interface TrendData {
  date: string;
  cam_id: string;
  visits: number;
  presence_hrs: number;
}

export interface VideoItem {
  key: string;
  name: string;
  size: number;
}

export async function fetchCameras(): Promise<CameraData[]> {
  const data = await apiFetch<{ cameras: CameraData[] }>("/cameras");
  return data.cameras;
}

export async function fetchStatus(): Promise<ZoneStatus[]> {
  const data = await apiFetch<{ status: ZoneStatus[] }>("/status");
  return data.status;
}

export async function fetchAlerts(limit = 10): Promise<{ alerts: AlertData[]; count: number }> {
  return apiFetch<{ alerts: AlertData[]; count: number }>(`/alerts?limit=${limit}`);
}

export async function fetchSafetyScores(): Promise<SafetyScore[]> {
  const data = await apiFetch<{ scores: SafetyScore[] }>("/analytics/safety-score");
  return data.scores;
}

export async function fetchZoneAnalytics(): Promise<ZoneAnalyticsData[]> {
  const data = await apiFetch<{ zones: ZoneAnalyticsData[] }>("/analytics/zones");
  return data.zones;
}

export async function fetchTrend(days = 7): Promise<TrendData[]> {
  const data = await apiFetch<{ trend: TrendData[] }>(`/analytics/trend?days=${days}`);
  return data.trend;
}

export async function fetchVideoList(camId: string): Promise<VideoItem[]> {
  const data = await apiFetch<{ videos: VideoItem[] }>(`/video-list/${camId}`);
  return data.videos;
}

export function getStreamUrl(camId: string, filename: string): string {
  return `${API_BASE}/stream/${camId}/${filename}`;
}

export function extractTimeFromFilename(filename: string): string {
  const match = filename.match(/_(\d{2})(\d{2})(\d{2})_small/);
  if (match) return `${match[1]}:${match[2]}:${match[3]}`;
  return filename;
}

export function formatFileSize(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function formatCamId(camId: string): string {
  const num = camId.replace(/^cam/, "");
  return `CAM-${num}`;
}

export function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-US", { hour12: false });
  } catch {
    return ts;
  }
}
