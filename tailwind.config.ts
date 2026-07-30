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
        brand: {
          primary: "#064e3b",
          "primary-dark": "#003527",
          "primary-light": "#80bea6",
          "primary-fixed": "#b0f0d6",
          secondary: "#b80938",
          "secondary-dark": "#db2e4e",
          surface: "#ffffff",
          background: "#f9f9ff",
          "surface-dim": "#d0daef",
          "surface-container": "#e6eeff",
          outline: "#e5e7eb",
          "outline-dark": "#707974",
          "on-surface": "#121c2a",
          "on-surface-variant": "#404944",
        },
        primary: {
          DEFAULT: "#064e3b",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#b80938",
          foreground: "#ffffff",
        },
        background: "#f9f9ff",
        foreground: "#121c2a",
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#121c2a",
        },
        border: "#e5e7eb",
      },
      fontFamily: {
        sans: [
          "Hanken Grotesk",
          "Hind Siliguri",
          "Noto Sans Bengali",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        "card-hover": "0px 8px 20px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
