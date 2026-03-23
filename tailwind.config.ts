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
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'bar-grow': 'barGrow 0.8s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        barGrow: {
          from: { width: '0%' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(184, 134, 11, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(184, 134, 11, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
