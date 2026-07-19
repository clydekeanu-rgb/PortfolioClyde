import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "#161618",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "#9A9AA2",
          foreground: "#F4F4F5",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "#7C3AED",
          soft: "#A78BFA",
          foreground: "#F4F4F5",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        "syntax-string": "#FACC15",
        "syntax-keyword": "#F472B6",
        "syntax-comment": "#6B7280",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        readable: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 34px rgba(124, 58, 237, 0.22)",
        soft: "0 18px 60px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        "shimmer-slide":
          "shimmer-slide var(--speed, 3s) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed, 3s) * 2) infinite linear",
        ripple:
          "ripple var(--duration, 2s) ease calc(var(--i, 0) * 0.2s) infinite",
        marquee: "marquee var(--duration, 40s) infinite linear",
        "marquee-vertical":
          "marquee-vertical var(--duration, 40s) linear infinite",
      },
      keyframes: {
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": { transform: "translateZ(0) rotate(0)" },
          "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
          "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
          "100%": { transform: "translateZ(0) rotate(360deg)" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
