import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import CCTVMonitor from "./pages/CCTVMonitor";
import ZoneAnalytics from "./pages/ZoneAnalytics";
import AIModelsHub from "./pages/AIModelsHub";
import SafetyIncidents from "./pages/SafetyIncidents";
import MachinesAssets from "./pages/MachinesAssets";
import EmployeeMonitor from "./pages/EmployeeMonitor";
import AnalyticsReports from "./pages/AnalyticsReports";
import AlertsRules from "./pages/AlertsRules";
import AuditCompliance from "./pages/AuditCompliance";
import MaintenanceHub from "./pages/MaintenanceHub";
import SettingsAdmin from "./pages/SettingsAdmin";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem("zeex_auth") === "true";
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/cctv" element={<ProtectedRoute><CCTVMonitor /></ProtectedRoute>} />
          <Route path="/zones" element={<ProtectedRoute><ZoneAnalytics /></ProtectedRoute>} />
          <Route path="/ai-models" element={<ProtectedRoute><AIModelsHub /></ProtectedRoute>} />
          <Route path="/incidents" element={<ProtectedRoute><SafetyIncidents /></ProtectedRoute>} />
          <Route path="/machines" element={<ProtectedRoute><MachinesAssets /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeeMonitor /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsReports /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertsRules /></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute><AuditCompliance /></ProtectedRoute>} />
          <Route path="/maintenance" element={<ProtectedRoute><MaintenanceHub /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsAdmin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;