"use client";
import { useState, useCallback, type ReactNode, type CSSProperties } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "@/components/Topbar";
import toast from "react-hot-toast";

const ACCENT = "#7c3aed";
const BG3    = "#161628";
const BG4    = "#1e1e32";
const BORDER = "rgba(124,58,237,0.14)";
const TEXT   = "#e2e8f0";
const MUTED  = "#555577";

// Backend returns raw JPEG — we store it as an object URL
interface GenResult { resultUrl: string; sourcePreview: string; targetPreview: string; }

const GlassCard = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ background: BG3, border: `0.5px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", ...style }}>
    {children}
  </div>
);

const CardHead = ({ title, badge }: { title: string; badge?: ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: `0.5px solid ${BORDER}` }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{title}</span>
    {badge}
  </div>
);

function DropZone({ label, file, setFile, setPreview, preview }: {
  label: string; file: File | null; setFile: (f: File) => void;
  setPreview: (s: string) => void; preview: string | null;
}) {
  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted[0]) return;
    setFile(accepted[0]);
    setPreview(URL.createObjectURL(accepted[0]));
  }, [setFile, setPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [".jpg",".jpeg",".png",".webp"] }, maxFiles: 1, maxSize: 20 * 1024 * 1024,
  });

  return (
    <div>
      <label style={{ fontSize: 10, color: MUTED, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
      <div {...getRootProps()} style={{
        border: `1.5px dashed ${isDragActive ? ACCENT : "rgba(124,58,237,0.2)"}`,
        borderRadius: 10, padding: preview ? 0 : 28, overflow: "hidden",
        background: isDragActive ? "rgba(124,58,237,0.05)" : "rgba(0,0,0,0.2)",
        cursor: "pointer", transition: "all 0.2s", minHeight: 120,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <input {...getInputProps()} />
        {preview
          ? <img src={preview} alt={label} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
          : <div style={{ textAlign: "center", padding: "0 12px" }}>
              <p style={{ fontSize: 12, color: MUTED }}>{isDragActive ? "Drop here" : "Drop or click"}</p>
              <p style={{ fontSize: 10, color: "#374151", marginTop: 3 }}>JPG · PNG · WEBP</p>
            </div>
        }
      </div>
      {file && (
        <p style={{ fontSize: 10, color: "rgba(124,58,237,0.5)", marginTop: 4, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          {file.name}
        </p>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, note }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; note?: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: ACCENT }} />
      {note && <p style={{ fontSize: 9.5, color: "#374151", marginTop: 3 }}>{note}</p>}
    </div>
  );
}

export default function GeneratePage() {
  const [srcFile, setSrcFile]   = useState<File | null>(null);
  const [tgtFile, setTgtFile]   = useState<File | null>(null);
  const [srcPrev, setSrcPrev]   = useState<string | null>(null);
  const [tgtPrev, setTgtPrev]   = useState<string | null>(null);
  const [strength, setStrength] = useState(0.75);
  const [alpha, setAlpha]       = useState(0.9);
  const [resolution, setResol]  = useState(512);
  const [postProc, setPostProc] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<GenResult | null>(null);

  const generate = async () => {
    if (!srcFile || !tgtFile) return;
    setLoading(true); setResult(null);
    const fd = new FormData();
    // Field names must match backend: source, target
    fd.append("source", srcFile);
    fd.append("target", tgtFile);
    fd.append("identity_strength", String(strength));
    fd.append("blend_alpha", String(alpha));
    fd.append("resolution", String(resolution));
    fd.append("postprocess", String(postProc));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, { method: "POST", body: fd });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail || `Server error ${res.status}`);
      }
      // Backend returns raw JPEG bytes — convert to object URL
      const blob = await res.blob();
      const resultUrl = URL.createObjectURL(blob);
      setResult({
        resultUrl,
        sourcePreview: srcPrev!,
        targetPreview: tgtPrev!,
      });
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally { setLoading(false); }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.resultUrl;
    a.download = `deepguard_swap_${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Topbar title="Generate Deepfake" subtitle="— InsightFace · inswapper_128.onnx" />

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

          {/* UPLOAD */}
          <GlassCard>
            <CardHead title="Upload Faces" badge={
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(239,68,68,0.08)", color: "#f87171", border: "0.5px solid rgba(239,68,68,0.2)" }}>
                Research Only
              </span>
            } />
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              <DropZone label="Source Face (Identity)" file={srcFile} setFile={setSrcFile} preview={srcPrev} setPreview={setSrcPrev} />
              <DropZone label="Target Face (Canvas)" file={tgtFile} setFile={setTgtFile} preview={tgtPrev} setPreview={setTgtPrev} />
            </div>
          </GlassCard>

          {/* CONTROLS */}
          <GlassCard>
            <CardHead title="Parameters" />
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 18 }}>
              <Slider label="Identity Strength" value={strength} min={0} max={1} step={0.05}
                onChange={setStrength} note="Higher = more source identity preserved" />
              <Slider label="Blend Alpha" value={alpha} min={0} max={1} step={0.05}
                onChange={setAlpha} note="Blending between source and target" />
              <Slider label="Resolution" value={resolution} min={128} max={1024} step={128}
                onChange={setResol} note="Output resolution (px)" />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Post-processing</span>
                <button onClick={() => setPostProc(p => !p)} style={{
                  width: 38, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                  background: postProc ? "linear-gradient(135deg,#7c3aed,#ec4899)" : BG4, position: "relative", transition: "background 0.2s",
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, transition: "left 0.2s",
                    left: postProc ? 21 : 3,
                  }} />
                </button>
              </div>


              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  onClick={generate} disabled={!srcFile || !tgtFile || loading}
                  style={{
                    padding: "11px 0", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
                    cursor: (!srcFile || !tgtFile) ? "not-allowed" : "pointer",
                    background: (!srcFile || !tgtFile || loading) ? "rgba(124,58,237,0.25)" : "linear-gradient(135deg,#7c3aed,#ec4899)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {loading ? <><Spinner />Generating...</> : "Generate Deepfake"}
                </button>
                {result && (
                  <button onClick={download} style={{
                    padding: "10px 0", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    background: "transparent", border: `0.5px solid rgba(124,58,237,0.25)`, color: "rgba(168,85,247,0.7)",
                  }}>
                    Download
                  </button>
                )}
              </div>

              <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,0.07)", border: "0.5px solid rgba(239,68,68,0.2)" }}>
                <p style={{ fontSize: 10, color: "#f87171", fontWeight: 600, marginBottom: 3 }}>⚠ Research Platform</p>
                <p style={{ fontSize: 10, color: "rgba(248,113,113,0.6)", lineHeight: 1.5 }}>
                  Academic use only. All outputs logged. Non-consensual swapping prohibited.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* OUTPUT */}
          <GlassCard>
            <CardHead title="Generated Output" badge={result ? (
              <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: "rgba(124,58,237,0.1)", color: "rgba(168,85,247,0.8)", border: "0.5px solid rgba(124,58,237,0.2)" }}>
                Face Swap Complete
              </span>
            ) : undefined} />
            <div style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 260 }}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <Spinner size={28} />
                    <p style={{ fontSize: 12, color: MUTED }}>Processing inswapper_128…</p>
                    <p style={{ fontSize: 10, color: "#374151" }}>Aligning facial landmarks</p>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                    <img src={result.resultUrl} alt="Generated"
                      style={{ width: "100%", borderRadius: 10, border: `0.5px solid ${BORDER}` }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["Source", result.sourcePreview], ["Target", result.targetPreview]].map(([l, b]) => (
                        <div key={l} style={{ flex: 1 }}>
                          <p style={{ fontSize: 9, color: MUTED, marginBottom: 4 }}>{l}</p>
                          <img src={b} alt={l}
                            style={{ width: "100%", height: 52, objectFit: "cover", borderRadius: 6, border: `0.5px solid ${BORDER}` }} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: "center", color: MUTED }}>
                    <p style={{ fontSize: 13 }}>Output will appear here</p>
                    <p style={{ fontSize: 10, marginTop: 4, color: "#374151" }}>Upload two faces and click Generate</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* INFO CHIPS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { label: "Engine",   value: "inswapper_128.onnx" },
            { label: "Backend",  value: "InsightFace + ONNX" },
            { label: "Max Size", value: "100 MB per file" },
            { label: "Logging",  value: "All swaps logged" },
          ].map((m) => (
            <div key={m.label} style={{ background: BG4, border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ fontSize: 9, color: MUTED, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span style={{
      width: size, height: size,
      border: `2px solid rgba(255,255,255,0.2)`, borderTopColor: "#fff",
      borderRadius: "50%", animation: "spin 0.7s linear infinite",
      display: "inline-block", flexShrink: 0,
    }} />
  );
}
