"use client";

import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";

const models = [
  {
    name: "EfficientNet-B4",
    role: "Deepfake Detection",
    description: "Fine-tuned on 140K Real & Fake Faces dataset for binary classification (Real vs Fake). Uses attention mechanisms to focus on facial artifacts.",
    accuracy: 99.8,
    color: "#6366f1",
    badge: "Detection",
    metrics: [
      { k: "Accuracy", v: "99.8%" },
      { k: "F1-Score", v: "99.8%" },
      { k: "AUC-ROC", v: "99.9%" },
      { k: "Inference", v: "~142ms" },
    ],
    status: "Active",
    checkpoint: "efficientnet_b4_deepguard.pth",
  },
  {
    name: "SimSwap",
    role: "Face Swap Generation",
    description: "Identity-preserving face swap model. Fine-tuned on FF++ for high-quality realistic face swapping.",
    accuracy: 94.8,
    color: "#8b5cf6",
    badge: "Generation",
    metrics: [
      { k: "FID Score", v: "12.4" },
      { k: "SSIM", v: "0.91" },
      { k: "PSNR", v: "34.2dB" },
      { k: "Inference", v: "~800ms" },
    ],
    status: "Active",
    checkpoint: "simswap_ff++_v1.pth",
  },
  {
    name: "StyleGAN2-ADA",
    role: "Face Synthesis",
    description: "Adaptive discriminator augmentation GAN for high-quality face synthesis. Used for dataset generation.",
    accuracy: null,
    color: "#10b981",
    badge: "Generation",
    metrics: [
      { k: "FID Score", v: "4.9" },
      { k: "Resolution", v: "1024×1024" },
      { k: "Truncation", v: "0.7" },
      { k: "Inference", v: "~1.2s" },
    ],
    status: "Active",
    checkpoint: "stylegan2_ada_ffhq.pkl",
  },
  {
    name: "InsightFace (ArcFace)",
    role: "Face Embedding & Alignment",
    description: "Face recognition model used for face alignment, landmark detection, and identity embeddings in the generation pipeline.",
    accuracy: 99.1,
    color: "#f59e0b",
    badge: "Utility",
    metrics: [
      { k: "LFW Acc.", v: "99.83%" },
      { k: "Embedding", v: "512-dim" },
      { k: "Backbone", v: "ResNet-100" },
      { k: "Inference", v: "~25ms" },
    ],
    status: "Active",
    checkpoint: "arcface_r100.pth",
  },
];

export default function ModelsPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Model Registry" subtitle="— Fine-tuned models & checkpoints" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {models.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2235]">
                <div>
                  <div className="text-[13px] font-semibold text-[#cbd5e1]">{m.name}</div>
                  <div className="text-[10px] text-[#4b5563] mt-0.5">{m.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-purple">{m.badge}</span>
                  <span className="badge bg-emerald-900/40 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                    {m.status}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-xs text-[#6b7280] leading-relaxed">{m.description}</p>

                {/* Accuracy bar */}
                {m.accuracy && (
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-[#4b5563]">Primary Metric</span>
                      <span className="text-sm font-bold" style={{ color: m.color }}>{m.accuracy}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1e2235] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.accuracy}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: m.color }}
                      />
                    </div>
                  </div>
                )}

                {/* Metrics grid */}
                <div className="grid grid-cols-4 gap-2">
                  {m.metrics.map((metric) => (
                    <div key={metric.k} className="bg-[#13162a] rounded-lg p-2 border border-[#1e2235] text-center">
                      <div className="text-[9px] text-[#4b5563] mb-0.5">{metric.k}</div>
                      <div className="text-xs font-semibold text-[#c9d0e0]">{metric.v}</div>
                    </div>
                  ))}
                </div>

                {/* Checkpoint */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080a12] border border-[#1e2235]">
                  <span className="text-xs">💾</span>
                  <span className="text-[10px] text-[#4b5563] flex-1">Checkpoint:</span>
                  <code className="text-[10px] text-indigo-400 font-mono">{m.checkpoint}</code>
                </div>

                <div className="text-[10px] text-[#374151]">
                  Fine-tuned on FaceForensics++ · Training: Google Colab A100
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
