"use client";

import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const areaData = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  fake: Math.floor(40 + Math.random() * 60),
  real: Math.floor(20 + Math.random() * 40),
}));

const pieData = [
  { name: "SimSwap", value: 54, color: "#6366f1" },
  { name: "StyleGAN2", value: 28, color: "#10b981" },
  { name: "FaceSwap", value: 18, color: "#f59e0b" },
];

const barData = [
  { model: "EfficientNet-B4", accuracy: 99.8 },
  { model: "SimSwap Quality", accuracy: 94.8 },
  { model: "FF++ F1", accuracy: 95.1 },
];

const stats = [
  { label: "Total Analyzed", value: "3,847", change: "↑ 12% this week", up: true },
  { label: "Deepfakes Detected", value: "2,109", change: "54.8% detection rate", up: null },
  { label: "Model Accuracy", value: "99.8%", change: "↑ EfficientNet-B4", up: true },
  { label: "Dataset Size", value: "12.4K", change: "↑ HuggingFace live", up: true },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0f17] border border-[#1e2235] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-[#6b7280] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Analytics Dashboard" subtitle="— Model performance & detection history" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4"
            >
              <div className="text-[10px] text-[#4b5563] mb-2">{s.label}</div>
              <div className="text-2xl font-bold text-[#e2e8f0] tracking-tight">{s.value}</div>
              <div className={`text-[10px] mt-1 ${s.up === true ? "text-emerald-400" : s.up === false ? "text-red-400" : "text-[#6b7280]"}`}>
                {s.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Area chart */}
          <div className="col-span-2 card overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e2235]">
              <span className="text-[13px] font-semibold text-[#cbd5e1]">Detection Activity (30 days)</span>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fakeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#374151" }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 9, fill: "#374151" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="fake" stroke="#6366f1" fill="url(#fakeGrad)" strokeWidth={1.5} name="Fake" />
                  <Area type="monotone" dataKey="real" stroke="#10b981" fill="url(#realGrad)" strokeWidth={1.5} name="Real" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {[["#6366f1", "Fake"], ["#10b981", "Real"]].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1.5 text-[10px] text-[#6b7280]">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pie chart */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e2235]">
              <span className="text-[13px] font-semibold text-[#cbd5e1]">By Manipulation Type</span>
            </div>
            <div className="p-4 flex flex-col items-center">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, ""]}
                    contentStyle={{ background: "#0d0f17", border: "1px solid #1e2235", borderRadius: 8, fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 w-full mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-[#6b7280]">{d.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: d.color }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Model Performance */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e2235]">
            <span className="text-[13px] font-semibold text-[#cbd5e1]">Model Performance</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              { name: "EfficientNet-B4 (Detection Accuracy)", val: 99.8, color: "#6366f1" },
              { name: "SimSwap (Generation Quality Score)", val: 94.8, color: "#8b5cf6" },
              { name: "140K Dataset F1-Score", val: 99.8, color: "#10b981" },
              { name: "AUC-ROC Score", val: 99.9, color: "#f59e0b" },
            ].map((m) => (
              <div key={m.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-[#94a3b8]">{m.name}</span>
                  <span className="text-xs font-semibold" style={{ color: m.color }}>{m.val}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1e2235] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.val}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
