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
        festive: {
          50: "#fff8ed",
          100: "#ffeed4",
          200: "#ffd9a8",
          300: "#ffbe71",
          400: "#ff9738",
          500: "#f97711",
          600: "#ea5907",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        ncr: {
          dark: "#0f172a",
          surface: "#1e293b",
          border: "#334155",
          accent: "#f59e0b",
        }
      },
    },
  },
  plugins: [],
};
export default config;
