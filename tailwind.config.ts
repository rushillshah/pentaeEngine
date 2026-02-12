import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#F3EDE4",
        },
        gold: {
          DEFAULT: "#B8860B",
          light: "#D4A843",
        },
        charcoal: "#2C2C2C",
        "warm-gray": "#6B6560",
        tan: "#E8E0D4",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
