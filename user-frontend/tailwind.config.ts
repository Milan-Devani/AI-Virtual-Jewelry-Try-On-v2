import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBF9F5", // warm off-white / luxury ivory
        foreground: "#1A1715", // dark charcoal
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1715",
          border: "#EBE6DF",
        },
        primary: {
          DEFAULT: "#1F1D1A",
          foreground: "#FAF7F2",
          hover: "#332F2A",
        },
        gold: {
          50: "#FDFBF7",
          100: "#F9F4EA",
          200: "#F1E4CB",
          300: "#E6D0A7",
          400: "#D8B77E",
          500: "#C89E58",
          600: "#B38541",
          700: "#926831",
          800: "#75522A",
          900: "#604325",
        },
        champagne: "#E8DEC8",
        muted: {
          DEFAULT: "#F4EFEA",
          foreground: "#736D66",
        },
        accent: {
          DEFAULT: "#F8F3EA",
          foreground: "#2E2A24",
        },
        border: "#E7E1D8",
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(28, 25, 23, 0.04)",
        card: "0 4px 20px -2px rgba(28, 25, 23, 0.06)",
        float: "0 12px 36px -4px rgba(28, 25, 23, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
