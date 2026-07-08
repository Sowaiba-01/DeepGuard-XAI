"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BG  = "#0f0f1a";
const BG2 = "#111127";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep]         = useState(0);

  const steps = [
    "Loading EfficientNet-B4 weights…",
    "Initializing GradCAM hooks…",
    "Starting InsightFace engine…",
    "DeepGuard AI ready.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 400); return 100; }
        return p + 1.4;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onDone]);

  useEffect(() => {
    setStep(Math.min(3, Math.floor(progress / 26)));
  }, [progress]);

  const dots   = Array.from({ length: 8 });
  const filled = Math.round((progress / 100) * 8);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed", inset: 0, background: BG,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 9999, gap: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: 72, height: 72, borderRadius: 18,
          background: "linear-gradient(135deg,#7c3aed,#ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "#fff",
          boxShadow: "0 0 40px rgba(124,58,237,0.3)",
        }}
      >DG</motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>DeepGuard AI</div>
        <div style={{ fontSize: 12, color: "#555577" }}>Deepfake Detection Platform</div>
      </motion.div>

      <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 5 }}>
        {[100, 85, 70, 55, 40].map((w, i) => (
          <div key={i} style={{ height: 3, background: BG2, borderRadius: 2 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(w, progress * (w / 100) * 1.1)}%` }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{ height: 3, borderRadius: 2, background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}
            />
          </div>
        ))}
      </div>

      <div style={{ width: 260 }}>
        <div style={{ height: 4, background: BG2, borderRadius: 3 }}>
          <motion.div style={{ height: 4, borderRadius: 3, background: "linear-gradient(90deg,#7c3aed,#ec4899)", width: `${progress}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "#555577" }}>{steps[step]}</span>
          <span style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600 }}>{Math.round(progress)}%</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {dots.map((_, i) => (
          <motion.div key={i} animate={{ background: i < filled ? "#7c3aed" : "#1e1e32" }} transition={{ duration: 0.2 }} style={{ width: 8, height: 8, borderRadius: "50%" }} />
        ))}
      </div>
    </motion.div>
  );
}
