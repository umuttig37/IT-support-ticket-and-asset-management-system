import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        slate: "#334155",
        mist: "#e2e8f0",
        canvas: "#f8fafc",
        signal: "#0f766e",
        accent: "#c2410c"
      },
      boxShadow: {
        panel: "0 18px 55px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
