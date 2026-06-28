import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#08090d",
          secondary: "#0d0f17",
          tertiary: "#13162a",
        },
        border: {
          DEFAULT: "#1e2235",
          light: "#2d3252",
        },
        accent: {
          purple: "#6366f1",
          violet: "#8b5cf6",
          green: "#10b981",
          red: "#ef4444",
          amber: "#f59e0b",
        },
        text: {
          primary: "#e2e8f0",
          secondary: "#94a3b8",
          muted: "#4b5563",
          dim: "#374151",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-purple": "linear-gradient(135deg, #6366f1, #8b5cf6)",
        "gradient-glow": "linear-gradient(135deg, #6366f155, #8b5cf655)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #6366f144" },
          "100%": { boxShadow: "0 0 20px #6366f166, 0 0 40px #6366f133" },
        },
      },
      boxShadow: {
        "purple-glow": "0 0 20px #6366f133, 0 0 60px #6366f111",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
