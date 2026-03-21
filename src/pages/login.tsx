import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Video, ScanFace, Bell, BarChart3, Camera, ArrowRight } from "lucide-react";
import zeexLogo from "@/assets/zeex-logo.png";

const ADMIN_CREDENTIALS = [
  { username: "admin", password: "Zeex@2026" },
  { username: "zeex", password: "Zeex@2026" },
];

const FEATURES = [
  { icon: Video,     text: "Real-time CCTV Monitoring" },
  { icon: ScanFace,  text: "AI-powered Worker Detection" },
  { icon: Bell,      text: "Instant Safety Alerts" },
  { icon: BarChart3, text: "Zone Analytics & Reports" },
  { icon: Camera,    text: "Multi-Camera Zone Surveillance" },
];


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

  // Mount animation
  useEffect(() => {
    setMounted(true);
    // Stagger feature items
    FEATURES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleFeatures((prev) => [...prev, i]);
      }, 600 + i * 150);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const valid = ADMIN_CREDENTIALS.find(
      (c) => c.username === username && c.password === password
    );
    if (valid) {
      localStorage.setItem("zeex_auth", "true");
      localStorage.setItem("zeex_user", username);
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">

      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--primary)/0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--primary)/0.05)_0%,_transparent_60%)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.4,
          }}
        />
        {/* Floating blobs */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{
            background: "hsl(var(--primary))",
            top: "10%",
            left: "5%",
            animation: "float1 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{
            background: "hsl(var(--primary))",
            bottom: "10%",
            right: "5%",
            animation: "float2 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(15px) translateX(-15px); }
          66% { transform: translateY(-10px) translateX(10px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .anim-slide-up  { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-fade-in   { animation: fadeIn 0.5s ease both; }
        .anim-scale-in  { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .feature-item   { opacity: 0; transform: translateX(-12px); transition: opacity 0.4s ease, transform 0.4s ease; }
        .feature-item.visible { opacity: 1; transform: translateX(0); }
        @keyframes featureGlow {
          from { box-shadow: 0 0 0px 0px rgba(16,185,129,0.0); border-color: rgba(16,185,129,0.15); }
          to   { box-shadow: 0 0 8px 2px rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.40); }
        }
      `}</style>

      {/* Main card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{ animation: mounted ? "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none" }}
      >
        <div className="bg-card border border-border/60 rounded-3xl p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">

          {/* Logo */}
          <div
            className="flex justify-center mb-5"
            style={{ animation: "slideUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <img
              src={zeexLogo}
              alt="ZEEX AI"
              className="h-24 w-auto object-contain drop-shadow-lg"
            />
          </div>

          {/* Tagline */}
          <div
            className="text-center mb-6"
            style={{ animation: "slideUp 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <p className="text-xs text-muted-foreground">Industrial AI Safety Platform</p>
          </div>

          {/* Divider */}
          <div
            className="border-t border-border/50 mb-6"
            style={{ animation: "fadeIn 0.4s 0.3s ease both" }}
          />

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-4"
            style={{ animation: "slideUp 0.5s 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* Username */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter username"
                required
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border-2 border-emerald-500/40 text-foreground text-sm focus:outline-none focus:border-emerald-500 placeholder:text-muted-foreground transition-all duration-300"
                style={{ boxShadow: '0 0 0 0 rgba(16,185,129,0)' }}
                onFocus={e => (e.currentTarget.style.boxShadow = '0 0 14px 3px rgba(16,185,129,0.30)')}
                onBlur={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(16,185,129,0)')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter password"
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl bg-secondary border-2 border-emerald-500/40 text-foreground text-sm focus:outline-none focus:border-emerald-500 placeholder:text-muted-foreground transition-all duration-300"
                  style={{ boxShadow: '0 0 0 0 rgba(16,185,129,0)' }}
                  onFocus={e => (e.currentTarget.style.boxShadow = '0 0 14px 3px rgba(16,185,129,0.30)')}
                  onBlur={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(16,185,129,0)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2"
                style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/25 mt-1"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Authenticating...</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            className="border-t border-border/50 my-5"
            style={{ animation: "fadeIn 0.4s 0.5s ease both" }}
          />

          {/* Features — 2 column grid */}
          <div
            className="grid grid-cols-2 gap-2.5"
            style={{ animation: "fadeIn 0.4s 0.5s ease both" }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`feature-item flex items-center gap-2.5 px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 ${visibleFeatures.includes(i) ? "visible" : ""}`}
                style={{ animation: visibleFeatures.includes(i) ? `featureGlow ${2 + i * 0.4}s ease-in-out infinite alternate` : "none" }}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <f.icon size={13} className="text-emerald-400" />
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between"
            style={{ animation: "fadeIn 0.4s 0.8s ease both" }}
          >
            <span className="text-[10px] text-muted-foreground">Default: admin / Zeex@2026</span>
            <span className="text-[10px] text-muted-foreground font-mono">v2.0</span>
          </div>
        </div>

        {/* Bottom tag */}
        <p
          className="text-center text-[10px] text-muted-foreground mt-4"
          style={{ animation: "fadeIn 0.4s 0.9s ease both" }}
        >
          ZEEX AI © 2026 · Powered by YOLOv8 + AWS
        </p>
      </div>
    </div>
  );
}