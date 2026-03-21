import DashboardLayout from "@/components/DashboardLayout";
import { User, Shield, Bell, Database, Palette } from "lucide-react";
import { useState } from "react";

const tabs = ["General", "Users & Roles", "Notifications", "AI Configuration", "System"];

export default function SettingsAdmin() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Settings & Admin</h2>

        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "General" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-card border border-border/50 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Platform Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Organization Name</label>
                  <input className="w-full mt-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs" value="Madhusudhan Group" readOnly />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Factory Location</label>
                  <input className="w-full mt-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs" value="Industrial Area, Phase II" readOnly />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Vacancy Alert Threshold</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input className="w-20 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs font-mono" value="30" readOnly />
                    <span className="text-xs text-muted-foreground">seconds</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border/50 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">System Information</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Platform Version</span>
                  <span className="font-mono text-foreground">v2.4.1</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground">AI Engine</span>
                  <span className="font-mono text-foreground">Zeex Core v3.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Active Cameras</span>
                  <span className="font-mono text-foreground">12</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground">AI Models Deployed</span>
                  <span className="font-mono text-foreground">6</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Last System Update</span>
                  <span className="font-mono text-foreground">2026-03-12</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "General" && (
          <div className="p-12 rounded-xl bg-card border border-border/50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{activeTab} settings panel</p>
              <p className="text-[10px] text-muted-foreground mt-1">Configure {activeTab.toLowerCase()} options here</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
