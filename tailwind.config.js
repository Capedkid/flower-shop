/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF69B4", // Demet Çiçekçilik ana rengi
        secondary: "#6FCF97",
        gold: "#FFD700",
      },
      fontFamily: {
        sans: ["Poppins", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
} 