"use client";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header style={{
      height: 52, display: "flex", alignItems: "center",
      padding: "0 24px", flexShrink: 0,
      background: "#161622",
      borderBottom: "0.5px solid rgba(99,102,241,0.14)",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <h1 style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{title}</h1>
        {subtitle && (
          <span style={{ fontSize: 11, color: "#4b5563" }}>{subtitle}</span>
        )}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 11px", borderRadius: 20,
          fontSize: 11, fontWeight: 500,
          background: "rgba(16,185,129,0.08)",
          color: "#34d399",
          border: "0.5px solid rgba(16,185,129,0.2)",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#34d399", display: "inline-block",
          }} />
          Model Online
        </span>
        <span style={{
          padding: "4px 11px", borderRadius: 20,
          fontSize: 11, fontWeight: 500,
          background: "rgba(99,102,241,0.1)",
          color: "rgba(99,102,241,0.7)",
          border: "0.5px solid rgba(99,102,241,0.2)",
        }}>
          v2.0.0
        </span>
        {actions}
      </div>
    </header>
  );
}
