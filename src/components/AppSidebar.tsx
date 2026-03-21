import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Camera,
  BarChart3,
  Brain,
  AlertTriangle,
  Settings,
  Users,
  FileText,
  Bell,
  Shield,
  Wrench,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Cpu,
} from "lucide-react";
import zeexLogo from "@/assets/zeex-logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Overview Dashboard", path: "/" },
  { icon: Camera, label: "Live CCTV Monitor", path: "/cctv" },
  { icon: BarChart3, label: "Zone Analytics", path: "/zones" },
  { icon: Brain, label: "AI Models Hub", path: "/ai-models" },
  { icon: AlertTriangle, label: "Safety Incidents", path: "/incidents", badge: 3 },
  { icon: Cpu, label: "Machines & Assets", path: "/machines" },
  { icon: Users, label: "Employee Monitor", path: "/employees" },
  { icon: FileText, label: "Analytics & Reports", path: "/analytics" },
  { icon: Bell, label: "Alerts & Rules", path: "/alerts" },
  { icon: Shield, label: "Audit & Compliance", path: "/audit" },
  { icon: Wrench, label: "Maintenance Hub", path: "/maintenance" },
  { icon: Settings, label: "Settings & Admin", path: "/settings" },
];

export default function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-[72px]" : "w-[260px]"
      } flex-shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 overflow-hidden`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border flex-shrink-0">
        <img src={zeexLogo} alt="Zeex AI" className="w-9 h-9 rounded-lg object-cover" />
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <span className="font-bold text-foreground tracking-tight text-base">Zeex AI</span>
            <span className="text-[10px] text-muted-foreground">Industrial AI Platform</span>
          </motion.div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground text-xs">
            <Search size={14} />
            <span>Search zones, devices...</span>
            <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group ${
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-secondary/50 border border-transparent"
              }`}
            >
              <item.icon size={18} className={active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {item.badge && !collapsed && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {item.badge && collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Health */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">System Health</p>
            <div className="flex items-center gap-2 text-xs text-success">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              AI Core: Optimized
            </div>
          </div>
        </div>
      )}

      {/* User */}
      <div className="border-t border-sidebar-border px-3 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/50 to-primary border border-primary/30 flex items-center justify-center text-xs font-bold text-primary-foreground">
          JM
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Martinez</p>
              <p className="text-[10px] text-muted-foreground">Safety Manager</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3 w-6 h-6 bg-secondary border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
