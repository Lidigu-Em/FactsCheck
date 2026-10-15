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
        brand: {
          red:   "#C0392B",
          dark:  "#1A1A2E",
          slate: "#2D3748",
          muted: "#4A5568",
          light: "#F7F9FC",
        },
        verdict: {
          false:      "#DC2626",
          true:       "#16A34A",
          misleading: "#D97706",
          unproven:   "#6B7280",
        },
      },
      fontFamily: {
        sans:  ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Georgia", "Cambria", "ui-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
