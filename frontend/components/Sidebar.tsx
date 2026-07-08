"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const BG     = "#0d0d18";
const BG2    = "#111127";
const ACCENT = "#7c3aed";
const BORDER = "rgba(124,58,237,0.12)";
const MUTED  = "#555577";
const TEXT   = "#8888aa";

const navItems = [
  { href: "/dashboard",           label: "Home",        icon: "⌂" },
  { href: "/dashboard/detect",    label: "Detect",      icon: "◎" },
  { href: "/dashboard/generate",  label: "Generate",    icon: "✦" },
  { href: "/dashboard/robustness",label: "Robustness",  icon: "▦" },
];

export default function Sidebar() {
  const pathname   = usePathname();
  const { data: session } = useSession();

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Icon rail */}
      <div style={{
        width: 52, background: BG,
        display: "flex", flexDirection: "column",
        alignItems: "center", padding: "14px 0", gap: 6,
        borderRight: `1px solid ${BORDER}`, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          width: 34, height: 34, borderRadius: 10, marginBottom: 10,
          background: "linear-gradient(135deg,#7c3aed,#ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff",
        }}>DG</div>

        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div title={item.label} style={{
                width: 36, height: 36, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, cursor: "pointer", transition: "all 0.15s",
                background: active ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "transparent",
                color: active ? "#fff" : "#4a4a6a",
              }}>
                {item.icon}
              </div>
            </Link>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* Avatar */}
        {session?.user?.image ? (
          <img src={session.user.image} alt="avatar"
            style={{ width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${BORDER}`, cursor: "pointer" }}
            onClick={() => signOut()}
          />
        ) : (
          <div onClick={() => signOut()} style={{
            width: 30, height: 30, borderRadius: "50%", cursor: "pointer",
            background: "rgba(124,58,237,0.2)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 12, color: ACCENT, fontWeight: 600,
          }}>
            {session?.user?.name?.[0] ?? "?"}
          </div>
        )}
      </div>

      {/* Nav panel */}
      <div style={{
        width: 188, background: BG2,
        display: "flex", flexDirection: "column",
        borderRight: `1px solid ${BORDER}`, flexShrink: 0,
      }}>
        <div style={{ padding: "16px 14px 8px", fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Navigation
        </div>

        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", margin: "1px 8px", borderRadius: 9,
                fontSize: 13, cursor: "pointer", transition: "all 0.15s",
                background: active ? "rgba(124,58,237,0.14)" : "transparent",
                color: active ? "#a855f7" : TEXT,
              }}>
                <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{item.icon}</span>
                {item.label}
                {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: ACCENT }} />}
              </div>
            </Link>
          );
        })}

        <div style={{ marginTop: 16, padding: "0 8px" }}>
          <div style={{ height: "0.5px", background: BORDER }} />
        </div>

        <div style={{ padding: "12px 14px 8px", fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Model
        </div>
        {[
          { icon: "◈", label: "EfficientNet-B4" },
          { icon: "◉", label: "GradCAM" },
          { icon: "◬", label: "InsightFace" },
        ].map(i => (
          <div key={i.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", margin: "1px 8px", borderRadius: 9, fontSize: 12, color: MUTED }}>
            <span style={{ fontSize: 13, width: 18, textAlign: "center" }}>{i.icon}</span>
            {i.label}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {/* Sign out */}
        <div
          onClick={() => signOut()}
          style={{
            margin: "0 8px 12px", padding: "9px 12px", borderRadius: 9,
            fontSize: 12, color: MUTED, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out
        </div>
      </div>
    </div>
  );
}
