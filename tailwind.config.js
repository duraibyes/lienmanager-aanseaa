/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#0075be",        // clean blue (professional)
        primaryHover: "#1d4ed8",

        textOnPrimary: "#ffffff",
        textOnPrimaryMuted: "rgba(255,255,255,0.8)",
        text: "#1f2937",
        textMuted: "#6b7280",

        border: "#e5e7eb",

        danger: "#ef4444",
        dangerBg: "#fef2f2",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(-30deg, #0075be, #00aeea 100%)",
      },
    },
  },
  plugins: [],
};
