import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // Dark mode teal
          600: "#0d9488", // Light mode teal
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        accent: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8", // Dark mode sky blue
          500: "#0ea5e9",
          600: "#0284c7", // Light mode sky blue
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1E293B",
          cardLight: "#FFFFFF",
          cardDark: "#1E293B",
          bgLight: "#F8FAFC",
          bgDark: "#0F172A",
          borderLight: "#E2E8F0",
          borderDark: "#334155",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-hind-siliguri)", "sans-serif"],
        bangla: ["var(--font-hind-siliguri)", "sans-serif"],
        heading: ["var(--font-jakarta)", "var(--font-hind-siliguri)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.07)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanline 2s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { top: "0%" },
          "50%": { top: "95%" },
          "100%": { top: "0%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
