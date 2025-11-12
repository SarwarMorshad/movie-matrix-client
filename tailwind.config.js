/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        primary: "#E50914",
        secondary: "#F59E0B",
        accent: "#8B5CF6",
        "base-100": "#0A0A0A",
        "base-200": "#141414",
        "base-300": "#1F1F1F",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        moviematrix: {
          primary: "#E50914",
          secondary: "#F59E0B",
          accent: "#8B5CF6",
          neutral: "#1F1F1F",
          "base-100": "#0A0A0A",
          "base-200": "#141414",
          "base-300": "#1F1F1F",
          info: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          "base-content": "#FFFFFF",
        },
      },
    ],
    darkTheme: "moviematrix",
  },
};
