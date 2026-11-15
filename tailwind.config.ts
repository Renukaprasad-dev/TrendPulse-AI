import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0f1623",
        "surface-card": "#141c2e",
        "surface-border": "#1e293b",
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        accent: {
          blue: "#38bdf8",
          cyan: "#06b6d4",
          purple: "#a855f7",
          pink: "#ec4899",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(99, 102, 241, 0.3)",
        "glow-rose": "0 0 20px -5px rgba(244, 63, 94, 0.3)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
