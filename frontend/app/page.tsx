"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";

const ACCENT  = "#6366f1";
const DANGER  = "#ef4444";
const BG      = "#0f0f13";
const TEXT    = "#e2e8f0";
const MUTED   = "#4b5563";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard/detect");
  }, [status, router]);

  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <SplashScreen onDone={handleSplashDone} />

      <AnimatePresence>
        {splashDone && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: BG, overflow: "hidden" }}
          >
            {/* NAV */}
            <nav style={{
              position: "relative", zIndex: 20,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 40px", height: 56,
              borderBottom: "0.5px solid rgba(99,102,241,0.1)",
              background: "rgba(15,15,19,0.9)",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>
                DeepGuard<span style={{ color: ACCENT }}> AI</span>
              </div>
              <div style={{ display: "flex", gap: 32 }}>
                {["Detect", "Generate", "Models", "Dataset"].map((item) => (
                  <span
                    key={item}
                    onClick={() => signIn("google", { callbackUrl: "/dashboard/detect" })}
                    style={{ fontSize: 13, color: MUTED, cursor: "pointer", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                    onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard/detect" })}
                style={{
                  fontSize: 13, fontWeight: 600, padding: "8px 22px",
                  borderRadius: 8, background: ACCENT, color: "#fff",
                  border: "none", cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
                onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
              >
                Get started
              </button>
            </nav>

            {/* HERO */}
            <div style={{ position: "relative", flex: 1, display: "flex" }}>
              {/* Bg atmosphere */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(ellipse 55% 70% at 72% 48%, #1a1a2e 0%, #0f0f13 65%)",
                }} />
                <div style={{
                  position: "absolute", width: 600, height: 500,
                  top: "5%", left: "-5%",
                  background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
                  borderRadius: "50%",
                }} />
              </div>

              {/* LEFT */}
              <div style={{
                position: "relative", zIndex: 10,
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "32px 64px 80px", width: "50%",
              }}>
                <motion.p
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(99,102,241,0.6)", textTransform: "uppercase", marginBottom: 22 }}
                >
                  DeepGuard AI · Deepfake Detection Platform
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5 }}
                  style={{ fontSize: "clamp(38px,4.8vw,60px)", fontWeight: 800, lineHeight: 1.07, color: TEXT, marginBottom: 26 }}
                >
                  See through
                  <br />
                  <span style={{ color: ACCENT }}>every face.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  style={{ fontSize: 14, color: "rgba(226,232,240,0.38)", lineHeight: 1.75, marginBottom: 36, maxWidth: 380 }}
                >
                  Deepfake detection at{" "}
                  <span style={{ color: "rgba(226,232,240,0.7)" }}>99.54% accuracy</span>.
                  Fine-tuned EfficientNet-B4 with GradCAM explainability.
                </motion.p>

                <motion.div
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 }}
                >
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard/detect" })}
                    style={{
                      padding: "12px 28px", borderRadius: 9,
                      background: ACCENT, border: "none",
                      fontSize: 14, fontWeight: 600, color: "#fff",
                      cursor: "pointer", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
                    onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
                  >
                    Detect an image
                  </button>
                  <a
                    href="https://huggingface.co/Sowaiba01/Deepguard-dataset"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: "12px 24px", borderRadius: 9,
                      background: "transparent",
                      border: "0.5px solid rgba(99,102,241,0.25)",
                      fontSize: 14, fontWeight: 500, color: "rgba(99,102,241,0.6)",
                      textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.color = ACCENT; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; e.currentTarget.style.color = "rgba(99,102,241,0.6)"; }}
                  >
                    View dataset
                  </a>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ marginTop: 22, fontSize: 11, color: "rgba(226,232,240,0.15)" }}
                >
                  FYP · Computer Science · 2025–2026 · Open source on HuggingFace
                </motion.p>
              </div>

              {/* RIGHT: face landmark visual */}
              <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0,
                width: "52%", display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.22, duration: 0.7 }}
                >
                  <LandmarkFaceSVG />
                </motion.div>

                <motion.div
                  style={{ position: "absolute", bottom: "12%", right: "6%" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <ResultCard />
                </motion.div>

                <motion.div
                  style={{ position: "absolute", top: "14%", right: "22%" }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <StatChip label="Accuracy" value="99.54%" />
                </motion.div>
                <motion.div
                  style={{ position: "absolute", top: "14%", right: "4%" }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72 }}
                >
                  <StatChip label="Dataset" value="10.8K" />
                </motion.div>
              </div>
            </div>

            {/* BOTTOM STATS */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                borderTop: "0.5px solid rgba(99,102,241,0.08)",
                display: "flex", justifyContent: "center", alignItems: "center",
                gap: 60, padding: "16px 40px",
              }}
            >
              {[
                { val: "10,852",         label: "Dataset Images" },
                { val: "99.54%",         label: "Val Accuracy" },
                { val: "EfficientNet-B4",label: "Model" },
                { val: "inswapper_128",  label: "Generation" },
                { val: "AUC 99.8%",      label: "ROC Score" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LandmarkFaceSVG() {
  const landmarks = {
    jaw:        [[148,278],[158,306],[172,332],[190,355],[212,373],[238,382],[266,382],[292,373],[314,355],[330,332],[342,306],[350,278]],
    leftBrow:   [[162,196],[176,188],[194,184],[212,186],[228,194]],
    rightBrow:  [[272,194],[288,186],[306,184],[324,188],[338,196]],
    leftEye:    [[168,222],[182,214],[198,214],[212,220],[198,228],[182,228]],
    rightEye:   [[288,220],[302,214],[318,214],[332,222],[318,228],[302,228]],
    noseBridge: [[250,210],[250,224],[250,238],[250,250]],
    noseBase:   [[230,258],[240,264],[250,266],[260,264],[270,258]],
    outerMouth: [[216,284],[232,276],[250,272],[268,276],[284,284],[268,298],[250,302],[232,298]],
    innerMouth: [[230,284],[250,280],[270,284],[250,298]],
  };

  const allDots = Object.values(landmarks).flat() as [number,number][];
  const keyPoints: [number,number][] = [[168,222],[212,220],[332,222],[288,220],[216,284],[284,284],[250,302]];

  return (
    <svg width="420" height="460" viewBox="0 0 500 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="faceAtmo" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="scanLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0"/>
          <stop offset="35%" stopColor="#6366f1" stopOpacity="0.6"/>
          <stop offset="65%" stopColor="#6366f1" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
        </linearGradient>
      </defs>

      <ellipse cx="250" cy="240" rx="200" ry="220" fill="url(#faceAtmo)"/>
      <circle cx="250" cy="240" r="195" stroke="#6366f1" strokeWidth="0.7" strokeOpacity="0.28" strokeDasharray="7 5"/>
      <circle cx="250" cy="240" r="155" stroke="#6366f1" strokeWidth="0.4" strokeOpacity="0.1"/>

      {/* Brackets */}
      <path d="M72,60 L72,84 L96,84"   stroke="#6366f1" strokeWidth="1.6" strokeOpacity="0.55"/>
      <path d="M428,60 L428,84 L404,84" stroke="#6366f1" strokeWidth="1.6" strokeOpacity="0.55"/>
      <path d="M72,420 L72,396 L96,396"  stroke="#6366f1" strokeWidth="1.6" strokeOpacity="0.55"/>
      <path d="M428,420 L428,396 L404,396" stroke="#6366f1" strokeWidth="1.6" strokeOpacity="0.55"/>

      {/* Eye detection boxes */}
      <rect x="150" y="204" width="80" height="36" rx="4" stroke="#6366f1" strokeWidth="0.7" strokeOpacity="0.45" fill="#6366f1" fillOpacity="0.04"/>
      <rect x="270" y="204" width="80" height="36" rx="4" stroke="#6366f1" strokeWidth="0.7" strokeOpacity="0.45" fill="#6366f1" fillOpacity="0.04"/>
      <text x="152" y="200" fontSize="7.5" fill="#6366f1" fillOpacity="0.45" fontFamily="monospace">L.EYE</text>
      <text x="272" y="200" fontSize="7.5" fill="#6366f1" fillOpacity="0.45" fontFamily="monospace">R.EYE</text>

      {/* Mouth box */}
      <rect x="200" y="268" width="100" height="44" rx="4" stroke="#6366f1" strokeWidth="0.6" strokeOpacity="0.28" fill="#6366f1" fillOpacity="0.02"/>

      {/* GradCAM blobs — red for fake regions */}
      <ellipse cx="190" cy="222" rx="38" ry="24" fill="#ef4444" fillOpacity="0.08"/>
      <ellipse cx="310" cy="222" rx="38" ry="24" fill="#ef4444" fillOpacity="0.08"/>

      {/* Landmark lines */}
      <polyline points={landmarks.jaw.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.6" strokeOpacity="0.18" fill="none"/>
      <polyline points={landmarks.leftBrow.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.6" strokeOpacity="0.22" fill="none"/>
      <polyline points={landmarks.rightBrow.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.6" strokeOpacity="0.22" fill="none"/>
      <polygon points={landmarks.leftEye.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.7" strokeOpacity="0.32" fill="none"/>
      <polygon points={landmarks.rightEye.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.7" strokeOpacity="0.32" fill="none"/>
      <polyline points={landmarks.noseBridge.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.16" fill="none"/>
      <polyline points={landmarks.noseBase.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.16" fill="none"/>
      <polygon points={landmarks.outerMouth.map(([x,y]) => `${x},${y}`).join(" ")}
        stroke="#6366f1" strokeWidth="0.6" strokeOpacity="0.22" fill="none"/>

      {/* Landmark dots */}
      {allDots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2} fill="#6366f1" fillOpacity={0.6}/>
      ))}
      {/* Key point rings */}
      {keyPoints.map(([x,y],i) => (
        <circle key={`k${i}`} cx={x} cy={y} r={3.5} fill="none"
          stroke="#6366f1" strokeWidth="1" strokeOpacity="0.5"/>
      ))}

      <rect x="72" y="232" width="356" height="1.2" fill="url(#scanLine)" opacity="0.65"/>
      <text x="78" y="440" fontSize="8.5" fill="#6366f1" fillOpacity="0.35" fontFamily="monospace">
        {"68 LANDMARKS · FAKE · 97.4% CONF."}
      </text>
    </svg>
  );
}

function ResultCard() {
  return (
    <div style={{
      width: 158,
      background: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)",
      backdropFilter: "blur(16px)",
      border: "0.5px solid rgba(239,68,68,0.3)",
      borderRadius: 12,
      padding: "14px 16px",
      boxShadow: "0 16px 48px rgba(239,68,68,0.15), 0 4px 16px rgba(0,0,0,0.5)",
    }}>
      <p style={{ fontSize: 8, color: "rgba(248,113,113,0.55)", letterSpacing: "0.14em", marginBottom: 6 }}>
        ANALYSIS COMPLETE
      </p>
      <p style={{ fontSize: 30, fontWeight: 800, color: "#ef4444", lineHeight: 1, marginBottom: 6 }}>
        FAKE
      </p>
      <div style={{ height: 3, background: "rgba(239,68,68,0.15)", borderRadius: 2, marginBottom: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", width: "97%", background: "#ef4444", borderRadius: 2, opacity: 0.75 }} />
      </div>
      <p style={{ fontSize: 9, color: "rgba(248,113,113,0.5)", marginBottom: 2 }}>97.4% confidence</p>
      <p style={{ fontSize: 8, color: "rgba(226,232,240,0.2)" }}>EfficientNet-B4 · 144ms</p>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: "10px 14px", minWidth: 90, textAlign: "center",
      background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.03) 100%)",
      backdropFilter: "blur(12px)",
      border: "0.5px solid rgba(99,102,241,0.2)",
      borderRadius: 10,
    }}>
      <p style={{ fontSize: 8, color: "rgba(99,102,241,0.5)", letterSpacing: "0.1em", marginBottom: 3 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{value}</p>
    </div>
  );
}
