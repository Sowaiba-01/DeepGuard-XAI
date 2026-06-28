"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";
import clsx from "clsx";

const mockDataset = Array.from({ length: 20 }, (_, i) => ({
  id: `#${String(142 + i).padStart(5, "0")}`,
  label: i % 3 === 0 ? "REAL" : "FAKE",
  method: ["SimSwap", "StyleGAN2", "FaceSwap", "Original"][i % 4],
  source: ["FF++", "CelebDF", "DFDC"][i % 3],
  confidence: 75 + Math.floor(Math.random() * 24),
  resolution: ["512×512", "256×256", "640×480"][i % 3],
  created: new Date(Date.now() - i * 86400000).toLocaleDateString(),
}));

export default function DatasetPage() {
  const [filter, setFilter] = useState<"ALL" | "FAKE" | "REAL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = mockDataset.filter((d) => {
    if (filter !== "ALL" && d.label !== filter) return false;
    if (search && !d.id.toLowerCase().includes(search.toLowerCase()) && !d.method.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Dataset Explorer" subtitle="— 12,412 samples · Live on HuggingFace 🤗" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Header controls */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by ID, method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input max-w-xs"
          />
          <div className="flex gap-1">
            {(["ALL", "FAKE", "REAL"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  filter === f
                    ? f === "FAKE"
                      ? "bg-red-900/40 text-red-400 border-red-500/30"
                      : f === "REAL"
                      ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/30"
                      : "bg-indigo-900/40 text-indigo-400 border-indigo-500/30"
                    : "bg-[#13162a] text-[#6b7280] border-[#1e2235] hover:border-[#2d3252]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <span className="badge badge-purple px-3 py-1.5">12,412 samples</span>
            <a
              href="https://huggingface.co/datasets"
              target="_blank"
              rel="noopener noreferrer"
              className="badge bg-amber-900/30 text-amber-400 border border-amber-500/20 px-3 py-1.5 hover:bg-amber-900/50 transition-colors"
            >
              🤗 View on HuggingFace
            </a>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e2235]">
                  {["ID", "Preview", "Label", "Method", "Source", "Confidence", "Resolution", "Created"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#4b5563] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-[#111420] hover:bg-[#0d0f17] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[#4b5563] font-mono">{row.id}</td>
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-950 to-[#0d0f17] border border-[#1e2235] flex items-center justify-center text-base">
                        👤
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx("badge", row.label === "FAKE" ? "badge-fake" : "badge-real")}>
                        {row.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-purple">{row.method}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">{row.source}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-indigo-400">{row.confidence}%</td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8] font-mono">{row.resolution}</td>
                    <td className="px-4 py-3 text-xs text-[#4b5563]">{row.created}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
