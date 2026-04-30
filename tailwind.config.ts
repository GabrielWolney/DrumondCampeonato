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
        drumond: {
          orange: "#f88d2a",    // Pantone 715 C - Laranja oficial da marca
          dark: "#101820",      // Pantone Black 6 C - Fundo escuro
          "orange-dark": "#d6741c",
          "orange-light": "#ffa04e",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-opensans)", "sans-serif"],
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        "primary-gradient": "linear-gradient(135deg, #f88d2a 0%, #d6741c 100%)",
      },
      borderRadius: {
        "card": "28px",
        "btn": "14px",
      },
      boxShadow: {
        "glass": "0 24px 48px -12px rgba(0,0,0,0.5), inset 1px 1px 2px 0 rgba(255,255,255,0.05), inset -1px -1px 1px 0 rgba(0,0,0,0.2)",
        "glass-hover": "0 40px 80px -15px rgba(248,141,42,0.15), inset 1px 1px 3px 0 rgba(255,255,255,0.1), inset -1px -1px 1px 0 rgba(0,0,0,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;