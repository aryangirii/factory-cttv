import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const weeklyData = [
  { day: "Mon", incidents: 5, resolved: 5, violations: 8 },
  { day: "Tue", incidents: 3, resolved: 3, violations: 5 },
  { day: "Wed", incidents: 7, resolved: 6, violations: 12 },
  { day: "Thu", incidents: 4, resolved: 4, violations: 6 },
  { day: "Fri", incidents: 2, resolved: 2, violations: 3 },
  { day: "Sat", incidents: 1, resolved: 1, violations: 2 },
  { day: "Sun", incidents: 0, resolved: 0, violations: 0 },
];

const incidentTypes = [
  { name: "PPE Violations", value: 42, color: "hsl(0, 84%, 60%)" },
  { name: "Unsafe Behavior", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "Machine Alerts", value: 18, color: "hsl(217, 91%, 60%)" },
  { name: "Environmental", value: 12, color: "hsl(142, 71%, 45%)" },
];

export default function AnalyticsReports() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Analytics & Reports</h2>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Generate Report</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-card border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Incident Summary</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 32%, 17%)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} stroke="hsl(217, 32%, 17%)" />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} stroke="hsl(217, 32%, 17%)" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 7%)", border: "1px solid hsl(217, 32%, 17%)", borderRadius: "8px", fontSize: "11px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="incidents" fill="hsl(0, 84%, 60%)" name="Incidents" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="hsl(142, 71%, 45%)" name="Resolved" radius={[4, 4, 0, 0]} />
                <Bar dataKey="violations" fill="hsl(38, 92%, 50%)" name="Violations" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4">Incident Type Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={incidentTypes} cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {incidentTypes.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 7%)", border: "1px solid hsl(217, 32%, 17%)", borderRadius: "8px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
