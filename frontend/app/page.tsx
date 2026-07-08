"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";

const BG     = "#0f0f1a";
const BG2    = "#111127";
const BG3    = "#161628";
const ACCENT = "#7c3aed";
const BORDER = "rgba(124,58,237,0.14)";
const TEXT   = "#e2e8f0";
const MUTED  = "#555577";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <AnimatePresence>
      {splash ? (
        <SplashScreen key="splash" onDone={() => setSplash(false)} />
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {/* Topbar */}
          <div style={{
            height: 56, background: BG2, borderBottom: `1px solid ${BORDER}`,
            display: "flex", alignItems: "center", padding: "0 24px", gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg,#7c3aed,#ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#fff",
            }}>DG</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>DeepGuard AI</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <div style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, background: "rgba(34,197,94,0.08)", color: "#4ade80", border: "0.5px solid rgba(34,197,94,0.2)" }}>● Model Online</div>
              <div style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, background: "rgba(124,58,237,0.1)", color: "#a855f7", border: "0.5px solid rgba(124,58,237,0.2)" }}>v2.0.0</div>
            </div>
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

            {/* Hero Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                borderRadius: 18, padding: "40px 36px", marginBottom: 28,
                background: "linear-gradient(135deg,#1a0e40 0%,#2d1060 50%,#1a0830 100%)",
                border: `0.5px solid rgba(124,58,237,0.3)`,
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 180, height: 180, borderRadius: "50%",
                background: "rgba(124,58,237,0.12)",
              }} />
              <div style={{
                position: "absolute", bottom: -30, right: 80,
                width: 120, height: 120, borderRadius: "50%",
                background: "rgba(236,72,153,0.08)",
              }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 11, color: "#a855f7", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>
                  Final Year Project · CS 2025–26
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: TEXT, lineHeight: 1.2, marginBottom: 12 }}>
                  Detect deepfakes<br />
                  <span style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    with AI precision
                  </span>
                </h1>
                <p style={{ fontSize: 14, color: "#8888aa", marginBottom: 28, maxWidth: 460, lineHeight: 1.6 }}>
                  EfficientNet-B4 fine-tuned on a custom face-swap dataset. GradCAM explainability. InsightFace generation pipeline. Built end-to-end.
                </p>
                <button
                  onClick={() => signIn("google")}
                  style={{
                    padding: "12px 28px", borderRadius: 10, border: "none",
                    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Get Started →
                </button>
              </div>
            </motion.div>

            {/* Stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}
            >
              {[
                { val: "91.54%", label: "Val Accuracy" },
                { val: "10,852", label: "Training Images" },
                { val: "AUC 0.94", label: "ROC Score" },
              ].map(s => (
                <div key={s.label} style={{
                  background: BG3, border: `0.5px solid ${BORDER}`,
                  borderRadius: 14, padding: "20px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#a855f7", marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 36 }}
            >
              {[
                { icon: "◎", title: "Deepfake Detection", desc: "EfficientNet-B4 fine-tuned on 10K+ face-swap images. Detects inswapper, FaceSwap, StyleGAN2, and more.", color: "#7c3aed" },
                { icon: "◈", title: "GradCAM Explainability", desc: "Gradient-weighted class activation maps highlight which facial regions triggered the prediction.", color: "#ec4899" },
                { icon: "✦", title: "Face-Swap Generation", desc: "InsightFace inswapper_128 pipeline with full parameter control — for adversarial research.", color: "#a855f7" },
                { icon: "▦", title: "Robustness Testing", desc: "Confusion matrix, cross-method benchmarks, compression robustness evaluation.", color: "#7c3aed" },
              ].map(f => (
                <div key={f.title} style={{
                  background: BG3, border: `0.5px solid ${BORDER}`,
                  borderRadius: 14, padding: "20px",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 10, color: f.color }}>{f.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </motion.div>

            {/* Sign in CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <button
                onClick={() => signIn("google")}
                style={{
                  padding: "13px 40px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                  color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                }}
              >
                Sign in with Google
              </button>
              <p style={{ fontSize: 11, color: MUTED, marginTop: 10 }}>
                Academic use only · Sowaiba Arshad · CS Final Year Project 2025–26
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
