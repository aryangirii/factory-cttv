import { useState, useEffect, useCallback } from "react";
import { Bell, Download, AlertTriangle, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAlerts } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";

const pageTitles: Record<string, string> = {
  "/": "Industrial AI Safety Dashboard",
  "/cctv": "Live CCTV Monitor",
  "/zones": "Zone Analytics",
  "/ai-models": "AI Models Hub",
  "/incidents": "Safety Incidents",
  "/machines": "Machines & Assets",
  "/employees": "Employee Monitor",
  "/analytics": "Analytics & Reports",
  "/alerts": "Alerts & Rules",
  "/audit": "Audit & Compliance",
  "/maintenance": "Maintenance Hub",
  "/settings": "Settings & Admin",
};

export default function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const alertsApi = useApiData({
    fetchFn: useCallback(() => fetchAlerts(10), []),
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const title = pageTitles[location.pathname] || "Zeex AI";
  const alertCount = alertsApi.data?.count || 0;
  const username = localStorage.getItem("zeex_user") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("zeex_auth");
    localStorage.removeItem("zeex_user");
    navigate("/login");
  };

  return (
    <>
      <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs text-muted-foreground">Real-time AI-powered safety monitoring and analytics</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Alerts */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs font-medium hover:bg-warning/20 transition-colors">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            {alertCount} Active Alerts
          </button>

          {/* Export Report */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors">
            <Download size={14} />
            Export Report
          </button>

          {/* Emergency Stop */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors">
            <AlertTriangle size={14} />
            Emergency Stop
          </button>

          {/* Bell */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background text-[6px] flex items-center justify-center text-destructive-foreground font-bold">
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          </button>

          {/* Time */}
          <span className="text-xs text-muted-foreground font-mono">
            {time.toLocaleTimeString("en-US", { hour12: false })} UTC
          </span>

          {/* Divider */}
          <div className="h-4 w-px bg-border" />

          {/* User + Logout */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-secondary border border-border">
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-primary uppercase">
                  {username.charAt(0)}
                </span>
              </div>
              <span className="text-xs text-foreground font-medium capitalize">{username}</span>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-all"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-card border border-border/50 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <LogOut size={18} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Sign Out</h3>
                <p className="text-xs text-muted-foreground">You will be redirected to login</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              Are you sure you want to sign out of ZEEX AI dashboard?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-xl bg-destructive text-white text-xs font-bold hover:bg-destructive/90 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}