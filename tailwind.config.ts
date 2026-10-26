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
          bg: "#f4f8f5",
          canvas: "#f8faf8",
          surface: "#ffffff",
          card: "#ffffff",
          cardHover: "#f0fdf4",
          elevated: "#ffffff",
          border: "#e2ece6",
          borderHover: "#a7f3d0",
          borderFocus: "#059669",
          primary: "#059669",
          primaryDark: "#047857",
          primaryHover: "#10b981",
          primaryLight: "#ecfdf5",
          primaryTint: "#d1fae5",
          accent: "#10b981",
          neon: "#00df81",
          lime: "#65a30d",
          muted: "#52796f",
          text: "#0f291e",
          textMuted: "#4b6357",
        },
      },
    },
  },
  plugins: [],
};
export default config;
