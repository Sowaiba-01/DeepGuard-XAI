"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Topbar from "@/components/Topbar";

const BG3 = "#161628", BG4 = "#1e1e32", BORDER = "rgba(124,58,237,0.14)", TEXT = "#e2e8f0", MUTED = "#555577";

export default function DashboardHome() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] ?? "Researcher";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Topbar title="Home" subtitle="— DeepGuard AI v2.0.0" />
      <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Welcome */}
        <div style={{ borderRadius: 14, padding: "28px 28px", background: "linear-gradient(135deg,#1a0e40 0%,#2d1060 50%,#1a0830 100%)", border: `0.5px solid rgba(124,58,237,0.3)`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(124,58,237,0.1)" }} />
          <div style={{ fontSize: 11, color: "#a855f7", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>Welcome back</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: TEXT, marginBottom: 6 }}>Hello, {name} 👋</h1>
          <p style={{ fontSize: 13, color: "#8888aa" }}>DeepGuard AI is ready. Upload an image to detect deepfakes or generate face swaps for research.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { label: "Val Accuracy", value: "91.54%", color: "#a855f7" },
            { label: "Training Images", value: "10,852", color: "#7c3aed" },
            { label: "AUC-ROC", value: "0.9486", color: "#7c3aed" },
            { label: "False Positive Rate", value: "1.27%", color: "#22c55e" },
          ].map(s => (
            <div key={s.label} style={{ background: BG3, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { href: "/dashboard/detect",     icon: "◎", title: "Detect Deepfake",    desc: "Upload an image and run EfficientNet-B4 inference with GradCAM heatmap.",     color: "#7c3aed" },
            { href: "/dashboard/generate",   icon: "✦", title: "Generate Face Swap", desc: "Use InsightFace inswapper_128 to generate a deepfake for adversarial testing.", color: "#ec4899" },
            { href: "/dashboard/robustness", icon: "▦", title: "Robustness Testing", desc: "Cross-method benchmarks, confusion matrix, and artifact detection rates.",       color: "#7c3aed" },
            { href: "https://huggingface.co/Sowaiba01/deepguard-backend", icon: "⬡", title: "HuggingFace Model", desc: "View the EfficientNet-B4 model weights and dataset on HuggingFace Hub.", color: "#f59e0b", external: true },
          ].map(f => (
            <Link key={f.title} href={f.href} target={(f as any).external ? "_blank" : undefined} style={{ textDecoration: "none" }}>
              <div style={{ background: BG3, border: `0.5px solid ${BORDER}`, borderRadius: 14, padding: "20px", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
                <div style={{ fontSize: 22, color: f.color, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* HuggingFace links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <a href="https://huggingface.co/Sowaiba01/deepguard-backend" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ background: BG4, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤗</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>Model on HuggingFace</div>
                <div style={{ fontSize: 10, color: MUTED }}>EfficientNet-B4 weights & backend</div>
              </div>
            </div>
          </a>
          <a href="https://github.com/Sowaiba-01/DeepGuard-XAI" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ background: BG4, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⌥</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>GitHub Repository</div>
                <div style={{ fontSize: 10, color: MUTED }}>Source code & documentation</div>
              </div>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}
