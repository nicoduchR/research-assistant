import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Research Assistant Design System Colors
        primary: {
          DEFAULT: "#137fec", // Primary Blue
          hover: "#1068c2",
          dark: "#0b5cb5",
          foreground: "#FFFFFF",
        },
        background: {
          DEFAULT: "#FAFBFC",
          main: "#F9FAFB",
          light: "#f6f7f8",
          dark: "#101922",
        },
        text: {
          main: "#111827",
          dark: "#0f172a",
          primary: "#2C3E50", // Deep Navy
          secondary: "#95A5A6", // Warm Gray
        },
        sidebar: {
          bg: "#f8fafc",
          light: "#F3F4F6",
        },
        slate: {
          850: "#1a2530",
        },
        surface: {
          light: "#ffffff",
          dark: "#1e293b",
        },
        success: "#27AE60",
        warning: "#F39C12",
        error: {
          DEFAULT: "#E74C3C",
          bg: "#FEE2E2",
          border: "#EF4444",
        },
        processing: "#9B59B6",
        border: {
          DEFAULT: "#E0E0E0",
          light: "#E5E7EB",
          color: "#e2e8f0",
        },
        // Keep existing shadcn colors for compatibility
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2C3E50",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#2C3E50",
        },
        secondary: {
          DEFAULT: "#95A5A6",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F7F9FA",
          foreground: "#95A5A6",
        },
        accent: {
          DEFAULT: "#4A90E2",
          foreground: "#FFFFFF",
          amber: "#f59e0b",
          "amber-light": "#fef3c7",
        },
        destructive: {
          DEFAULT: "#E74C3C",
          foreground: "#FFFFFF",
        },
        input: "#E0E0E0",
        ring: "#4A90E2",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "1.3", fontWeight: "600" }],
        h2: ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        citation: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      boxShadow: {
        subtle: "0 2px 8px rgba(0,0,0,0.08)",
        medium: "0 4px 12px rgba(0,0,0,0.15)",
        strong: "0 8px 24px rgba(0,0,0,0.25)",
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
        "in": "fadeIn 300ms ease-out",
        "out": "fadeOut 300ms ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(16px)" },
        },
      },
      transitionDuration: {
        fast: "150ms",
        standard: "300ms",
        slow: "500ms",
      },
      transitionTimingFunction: {
        "ease-out-custom": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "ease-in-out-custom": "cubic-bezier(0.645, 0.045, 0.355, 1.0)",
      },
    },
  },
  plugins: [],
} satisfies Config;
