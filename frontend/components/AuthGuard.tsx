"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{
        height: "100vh", background: "#0f0f1a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "3px solid rgba(124,58,237,0.2)",
          borderTopColor: "#7c3aed",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return <>{children}</>;
}
