"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

const navItems = [
  { href: "/dashboard/detect",     label: "Detect Deepfake" },
  { href: "/dashboard/generate",   label: "Generate Deepfake" },
  { href: "/dashboard/robustness", label: "Robustness Testing" },
  { href: "/dashboard/analytics",  label: "Analytics" },
  { href: "/dashboard/dataset",    label: "Dataset Explorer" },
  { href: "/dashboard/models",     label: "Models" },
];

const BG      = "#0f0f13";
const BG2     = "#161622";
const ACCENT  = "#6366f1";
const BORDER  = "rgba(99,102,241,0.14)";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: 220, minWidth: 220,
        display: "flex", flexDirection: "column",
        background: BG2,
        borderRight: `0.5px solid ${BORDER}`,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: `0.5px solid ${BORDER}` }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0" }}>
          DeepGuard<span style={{ color: ACCENT }}> AI</span>
        </div>
        <div style={{ fontSize: 9.5, color: "#4b5563", marginTop: 3 }}>
          FYP · Deepfake Platform
        </div>
      </div>

      {/* User pill */}
      {session?.user && (
        <div style={{
          margin: "10px 10px 0",
          padding: "9px 10px", borderRadius: 8,
          background: "#1e1e2e",
          border: `0.5px solid ${BORDER}`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {session.user.image ? (
            <Image src={session.user.image} alt="avatar" width={24} height={24}
              style={{ borderRadius: "50%", flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: ACCENT, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff",
            }}>
              {session.user.name?.[0] ?? "U"}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 11, fontWeight: 500, color: "#e2e8f0",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {session.user.name}
            </div>
            <div style={{
              fontSize: 9.5, color: "#4b5563",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {session.user.email}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 8px 0", overflowY: "auto" }}>
        <p style={{
          fontSize: 8.5, fontWeight: 600, color: "#4b5563",
          textTransform: "uppercase", letterSpacing: "0.12em",
          padding: "0 8px 8px",
        }}>
          Navigation
        </p>

        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 10px", borderRadius: 7, marginBottom: 1,
                  cursor: "pointer",
                  background: active ? "rgba(99,102,241,0.12)" : "transparent",
                  border: active ? "0.5px solid rgba(99,102,241,0.25)" : "0.5px solid transparent",
                  color: active ? ACCENT : "#4b5563",
                  fontSize: 12, fontWeight: active ? 500 : 400,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(99,102,241,0.06)";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#4b5563";
                  }
                }}
              >
                <span>{item.label}</span>
                {active && (
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "10px 8px", borderTop: `0.5px solid ${BORDER}` }}>
        <a
          href="https://huggingface.co/Sowaiba01/deepguard-ai"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 10px", borderRadius: 7,
            background: "rgba(99,102,241,0.07)",
            border: `0.5px solid rgba(99,102,241,0.15)`,
            marginBottom: 6, textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 14 }}>🤗</span>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: ACCENT }}>HuggingFace</div>
            <div style={{ fontSize: 9, color: "#4b5563", marginTop: 1 }}>Dataset · 10,852 samples</div>
          </div>
        </a>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            padding: "8px 10px", borderRadius: 7,
            fontSize: 12, color: "#4b5563",
            background: "transparent", border: "none",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.background = "rgba(239,68,68,0.07)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "#4b5563";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Sign out
        </button>
      </div>
    </motion.aside>
  );
}
