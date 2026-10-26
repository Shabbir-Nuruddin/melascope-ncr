import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tetr: {
          bg: "#060b08",
          surface: "#0c1510",
          card: "#0f1a14",
          elevated: "#15241c",
          border: "#1c3327",
          borderHover: "#284b39",
          primary: "#00df81",
          primaryDark: "#059669",
          primaryHover: "#10b981",
          accent: "#22c55e",
          neon: "#00ff87",
          lime: "#a3e635",
          gold: "#eab308",
          muted: "#6e8a7b",
          text: "#f0fdf4",
        },
      },
    },
  },
  plugins: [],
};
export default config;
