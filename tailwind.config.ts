import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0F",
        surface: "#161618",
        border: "#2A2A2E",
        primary: "#F4F4F5",
        secondary: "#9A9AA2",
        accent: "#7C3AED",
        "accent-soft": "#A78BFA",
        "syntax-string": "#FACC15",
        "syntax-keyword": "#F472B6",
        "syntax-comment": "#6B7280",
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
    },
  },
  plugins: [],
};

export default config;
