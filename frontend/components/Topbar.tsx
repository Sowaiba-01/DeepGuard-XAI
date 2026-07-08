"use client";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div style={{
      height: 52, background: "#111127",
      borderBottom: "1px solid rgba(124,58,237,0.12)",
      display: "flex", alignItems: "center",
      padding: "0 20px", gap: 10, flexShrink: 0,
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{title}</span>
      {subtitle && (
        <span style={{ fontSize: 11, color: "#555577" }}>{subtitle}</span>
      )}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500,
          background: "rgba(34,197,94,0.08)", color: "#4ade80",
          border: "0.5px solid rgba(34,197,94,0.2)",
        }}>● Model Online</div>
        <div style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500,
          background: "rgba(124,58,237,0.1)", color: "#a855f7",
          border: "0.5px solid rgba(124,58,237,0.2)",
        }}>v2.0.0</div>
      </div>
    </div>
  );
}
