/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', '"Work Sans"', 'sans-serif'],
        display: ['"Work Sans"', 'sans-serif'],
      },
      colors: {
        primary: "#f5c538",
        background: "#1c1c1e",
        surface: "#2c2c2e",
        surfaceLight: "#3a3a3c",
        textMain: "#f2f2f7",
        textSub: "#8e8e93",
      }
    }
  },
  plugins: [],
}
