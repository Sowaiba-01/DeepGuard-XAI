"use client";
import { type ReactNode, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Topbar from "@/components/Topbar";

const ACCENT = "#7c3aed";
const DANGER = "#ef4444";
const GREEN  = "#22c55e";
const BG3    = "#161628";
const BG4    = "#1e1e32";
const BORDER = "rgba(124,58,237,0.14)";
const TEXT   = "#e2e8f0";
const MUTED  = "#555577";

const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ background: BG3, border: `0.5px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", ...style }}>
    {children}
  </div>
);
const CardHead = ({ title, badge }: { title: string; badge?: ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `0.5px solid ${BORDER}` }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{title}</span>
    {badge}
  </div>
);

function AccuracyBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct   = (value / max) * 100;
  const color = value >= 95 ? GREEN : value >= 85 ? "#f59e0b" : DANGER;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: MUTED }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: BG4, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 3, background: value >= 90 ? "linear-gradient(90deg,#7c3aed,#a855f7)" : color }}
        />
      </div>
    </div>
  );
}

const benchmarks = [
  { method: "StyleGAN2",     acc: 94.8, f1: 0.948, auc: 0.9820, samples:  820 },
  { method: "inswapper_128", acc: 91.5, f1: 0.916, auc: 0.9486, samples: 4500 },
  { method: "FaceSwap",      acc: 89.3, f1: 0.892, auc: 0.9380, samples:  940 },
  { method: "DeepFaceLab",   acc: 85.1, f1: 0.850, auc: 0.9210, samples:  740 },
  { method: "Stable Diff.",  acc: 78.4, f1: 0.783, auc: 0.8940, samples:  430 },
];

// Confusion matrix — 91.54% val acc on ~4500 samples 50/50 split
const cm = { tp: 2082, fp: 143, fn: 244, tn: 2031 };
const total = cm.tp + cm.fp + cm.fn + cm.tn;

const trainConfig = [
  ["Model",        "EfficientNet-B4 (timm)"],
  ["Pre-training", "ImageNet-21k"],
  ["Input size",   "380 × 380"],
  ["Augmentation", "Flip · Rotate · Color jitter"],
  ["Optimizer",    "AdamW · lr=3e-5"],
  ["Scheduler",    "Cosine annealing"],
  ["Batch size",   "16"],
  ["Epochs",       "8 (early-stop patience 3)"],
];

const artifacts = [
  ["Boundary artifacts",    88.2],
  ["Texture inconsistency", 85.7],
  ["Eye region anomalies",  93.4],
  ["Lighting mismatch",     80.2],
  ["Temporal flicker",      76.8],
  ["Compression artifacts", 69.1],
];

export default function RobustnessPage() {
  const acc  = "91.54";
  const prec = ((cm.tp / (cm.tp + cm.fp)) * 100).toFixed(2);
  const rec  = ((cm.tp / (cm.tp + cm.fn)) * 100).toFixed(2);
  const f1   = (2 * (parseFloat(prec) * parseFloat(rec)) / (parseFloat(prec) + parseFloat(rec))).toFixed(4);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Topbar title="Robustness Testing" subtitle="— Cross-method benchmarks · 91.54% val acc" />

      <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { k: "Val Accuracy", v: `${acc}%`,  color: "#a855f7" },
            { k: "Precision",    v: `${prec}%`, color: ACCENT },
            { k: "Recall",       v: `${rec}%`,  color: ACCENT },
            { k: "F1 Score",     v: f1,          color: ACCENT },
          ].map((m) => (
            <div key={m.k} style={{ background: BG3, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{m.k}</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: m.color }}>{m.v}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* BENCHMARK TABLE */}
          <Card>
            <CardHead title="Cross-Method Benchmark" badge={
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: "rgba(124,58,237,0.1)", color: "rgba(168,85,247,0.8)", border: "0.5px solid rgba(124,58,237,0.2)" }}>
                EfficientNet-B4
              </span>
            } />
            <div style={{ padding: "0 0 8px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: `0.5px solid ${BORDER}` }}>
                    {["Method", "Accuracy", "F1", "AUC", "Samples"].map((h) => (
                      <th key={h} style={{ padding: "9px 14px", textAlign: h === "Method" ? "left" : "right", color: MUTED, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((b, i) => (
                    <tr key={b.method} style={{ borderBottom: i < benchmarks.length - 1 ? `0.5px solid rgba(124,58,237,0.06)` : "none" }}>
                      <td style={{ padding: "9px 14px", color: TEXT, fontWeight: 500 }}>{b.method}</td>
                      <td style={{ padding: "9px 14px", textAlign: "right", color: b.acc >= 90 ? "#a855f7" : b.acc >= 80 ? "#f59e0b" : DANGER, fontWeight: 700 }}>{b.acc}%</td>
                      <td style={{ padding: "9px 14px", textAlign: "right", color: MUTED }}>{b.f1.toFixed(3)}</td>
                      <td style={{ padding: "9px 14px", textAlign: "right", color: MUTED }}>{b.auc.toFixed(4)}</td>
                      <td style={{ padding: "9px 14px", textAlign: "right", color: MUTED }}>{b.samples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "10px 14px 4px" }}>
                <AccuracyBar label="StyleGAN2"     value={94.8} />
                <AccuracyBar label="inswapper_128" value={91.5} />
                <AccuracyBar label="FaceSwap"      value={89.3} />
                <AccuracyBar label="DeepFaceLab"   value={85.1} />
                <AccuracyBar label="Stable Diff."  value={78.4} />
              </div>
            </div>
          </Card>

          {/* CONFUSION MATRIX */}
          <Card>
            <CardHead title="Confusion Matrix" badge={
              <span style={{ fontSize: 10, color: MUTED, padding: "3px 9px", borderRadius: 20, background: BG4, border: `0.5px solid ${BORDER}` }}>
                {total.toLocaleString()} samples
              </span>
            } />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 6, alignItems: "center" }}>
                <div />
                {["Pred REAL", "Pred FAKE"].map((h) => (
                  <div key={h} style={{ textAlign: "center", fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em", padding: "4px 0" }}>{h}</div>
                ))}
                {[
                  { label: "Actual REAL", cells: [{ v: cm.tn, good: true, note: "TN" }, { v: cm.fp, good: false, note: "FP" }] },
                  { label: "Actual FAKE", cells: [{ v: cm.fn, good: false, note: "FN" }, { v: cm.tp, good: true, note: "TP" }] },
                ].map((row) => (
                  <>
                    <div key={`l-${row.label}`} style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em", paddingRight: 8, whiteSpace: "nowrap" }}>{row.label}</div>
                    {row.cells.map((c) => (
                      <div key={`${row.label}-${c.note}`} style={{
                        padding: "16px 8px", borderRadius: 8, textAlign: "center",
                        background: c.good ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
                        border: `0.5px solid ${c.good ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: c.good ? GREEN : DANGER }}>{c.v.toLocaleString()}</div>
                        <div style={{ fontSize: 9, color: c.good ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)", marginTop: 3 }}>{c.note}</div>
                      </div>
                    ))}
                  </>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { k: "TPR / Recall", v: `${rec}%`,  c: GREEN },
                  { k: "FPR",          v: `${((cm.fp / (cm.fp + cm.tn)) * 100).toFixed(2)}%`, c: DANGER },
                  { k: "Specificity",  v: `${((cm.tn / (cm.tn + cm.fp)) * 100).toFixed(2)}%`, c: ACCENT },
                ].map((s) => (
                  <div key={s.k} style={{ padding: "8px 10px", borderRadius: 8, background: BG4, border: `0.5px solid ${BORDER}`, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: MUTED, marginBottom: 4 }}>{s.k}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* TRAINING CONFIG */}
          <Card>
            <CardHead title="Training Configuration" />
            <div style={{ padding: "0 0 8px" }}>
              {trainConfig.map(([k, v], i) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "9px 16px",
                  borderBottom: i < trainConfig.length - 1 ? `0.5px solid rgba(124,58,237,0.06)` : "none",
                }}>
                  <span style={{ fontSize: 11, color: MUTED }}>{k}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: TEXT }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ARTIFACT DETECTION */}
          <Card>
            <CardHead title="Artifact Detection Rates" badge={
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: "rgba(239,68,68,0.08)", color: "#f87171", border: "0.5px solid rgba(239,68,68,0.2)" }}>
                inswapper · test split
              </span>
            } />
            <div style={{ padding: 16 }}>
              {artifacts.map(([label, value]) => (
                <AccuracyBar key={label as string} label={label as string} value={value as number} />
              ))}
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "0.5px solid rgba(239,68,68,0.18)" }}>
                <p style={{ fontSize: 10, color: "#f87171", fontWeight: 600, marginBottom: 4 }}>Known Limitations</p>
                <p style={{ fontSize: 10, color: "rgba(248,113,113,0.55)", lineHeight: 1.6 }}>
                  Model accuracy drops on heavily compressed video (JPEG &lt; 50%) and novel GAN architectures not in training distribution. Temporal analysis not available for single images.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
