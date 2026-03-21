import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function generateData() {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString("en-US", { hour12: false, minute: "2-digit", second: "2-digit" }),
      ppeViolations: Math.floor(Math.random() * 3) + 1,
      unsafeBehavior: Math.floor(Math.random() * 4) + 1,
      machineAlerts: Math.floor(Math.random() * 2),
    });
  }
  return data;
}

export default function RealTimeChart() {
  const [data, setData] = useState(generateData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const now = new Date();
        const newPoint = {
          time: now.toLocaleTimeString("en-US", { hour12: false, minute: "2-digit", second: "2-digit" }),
          ppeViolations: Math.floor(Math.random() * 3) + 1,
          unsafeBehavior: Math.floor(Math.random() * 4) + 1,
          machineAlerts: Math.floor(Math.random() * 2),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 rounded-xl bg-card border border-border/50">
      <h3 className="text-sm font-semibold text-foreground mb-4">Real-time AI Analytics</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 32%, 17%)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} stroke="hsl(217, 32%, 17%)" interval={5} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} stroke="hsl(217, 32%, 17%)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 7%)",
              border: "1px solid hsl(217, 32%, 17%)",
              borderRadius: "8px",
              fontSize: "11px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
          <Line type="monotone" dataKey="ppeViolations" stroke="hsl(0, 84%, 60%)" name="PPE Violations" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="unsafeBehavior" stroke="hsl(38, 92%, 50%)" name="Unsafe Behavior" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="machineAlerts" stroke="hsl(217, 91%, 60%)" name="Machine Alerts" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
