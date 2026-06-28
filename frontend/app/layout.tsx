import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "DeepGuard AI — Deepfake Detection & Generation",
  description: "Final Year Project — AI-powered deepfake detection and generation platform using EfficientNet-B4 and SimSwap",
  keywords: ["deepfake", "detection", "AI", "machine learning", "FYP"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#08090d] text-[#e2e8f0] antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0d0f17",
                color: "#e2e8f0",
                border: "1px solid #1e2235",
                borderRadius: "10px",
                fontSize: "13px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#0d0f17" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#0d0f17" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
