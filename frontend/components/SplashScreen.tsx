"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#6366f1";
const BG     = "#0f0f13";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase]       = useState<"in" | "out" | "done">("in");
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  const statuses = [
    "Initializing engine",
    "Loading EfficientNet-B4",
    "Analyzing neural signatures",
    "Calibrating GradCAM",
    "Ready",
  ];

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      setProgress((p) => Math.min(p + 1.6, 100));
      setStatusIdx(Math.min(Math.floor(tick / 13), statuses.length - 1));
    }, 28);

    const t1 = setTimeout(() => setPhase("out"), 1700);
    const t2 = setTimeout(() => { setPhase("done"); onDone(); }, 2300);

    return () => { clearInterval(interval); clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: BG }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Data stream lines */}
          {[
            { y: "18%", w: "38%", left: "0%",  op: 0.07 },
            { y: "18%", w: "22%", left: "52%", op: 0.05 },
            { y: "36%", w: "18%", left: "0%",  op: 0.06 },
            { y: "36%", w: "48%", left: "28%", op: 0.08 },
            { y: "64%", w: "32%", left: "8%",  op: 0.07 },
            { y: "64%", w: "20%", left: "62%", op: 0.05 },
            { y: "80%", w: "44%", left: "18%", op: 0.06 },
          ].map((l, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute", top: l.y, left: l.left,
                width: l.w, height: 1.5,
                background: `rgba(99,102,241,${l.op})`,
                borderRadius: 1,
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: "easeOut" }}
            />
          ))}

          {/* Center glow */}
          <div style={{
            position: "absolute", width: 500, height: 300,
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Logo + progress */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase === "out" ? 0 : 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.04em", color: "#e2e8f0" }}>
              DEEPGUARD<span style={{ color: ACCENT }}> AI</span>
            </div>

            <p style={{
              fontSize: 10, color: "rgba(99,102,241,0.5)",
              letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
            }}>
              {statuses[statusIdx]}
            </p>

            {/* Dot row */}
            <div style={{ display: "flex", gap: 5 }}>
              {Array.from({ length: 22 }).map((_, i) => {
                const filled = i < Math.floor(progress / (100 / 22));
                return (
                  <div key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: filled
                      ? `rgba(99,102,241,${0.35 + (i / 22) * 0.65})`
                      : "rgba(99,102,241,0.08)",
                    transition: "background 0.12s ease",
                  }} />
                );
              })}
            </div>

            <p style={{
              fontSize: 10, color: "rgba(99,102,241,0.3)",
              fontVariantNumeric: "tabular-nums", letterSpacing: "0.1em",
            }}>
              {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
