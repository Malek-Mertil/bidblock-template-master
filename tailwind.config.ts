import type { Config } from "tailwindcss";
/* import daisyui from "daisyui"; */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        "dashboard-bg": "#F1F5F9",
        "dashboard-primary": "#3686FF",
        "dashboard-text": "#101010",
        primaryBlue: "#1265FC",
        lightBlue: "#80E8FF",
        darkGray: "#1E1E1E",
        lightGray: "#F6F6F6",
      },
      fontFamily: {
        Aeonik: ["Aeonik", "sans-serif"],
        SFPro: ["SF-Pro-Display", "sans-serif"],
      },
      maxWidth: {
        "8xl": "1366px",
      },
      transitionProperty: {
        "max-height": "max-height",
        "max-width": "max-width",
      },
      backgroundImage: {
        Header_bg: "url('/images/acceuil/header_bg.webp')",
      },
    },
  },
  /*  plugins: [daisyui], */
  /*  daisyui: {
    themes: [
      {
        bidblock: {
          primary: "#2565C7",

          "primary-content": "#f3f4f6",

          secondary: "#065f46",

          "secondary-content": "#f3f4f6",

          accent: "#4c1d95",

          "accent-content": "#f3f4f6",

          neutral: "#2565C7",

          "neutral-content": "#f3f4f6",

          "base-100": "#EFF7FF",

          "base-200": "#EFF7FF",

          "base-300": "#EFF7FF",

          "base-content": "#0c4a6e",

          info: "#00ffff",

          "info-content": "#111827",

          success: "#2dd4bf",

          "success-content": "#f3f4f6",

          warning: "#eab308",

          "warning-content": "#f3f4f6",

          error: "#e11d48",

          "error-content": "#f3f4f6",
        },
      },
    ],
  }, */
} satisfies Config;
