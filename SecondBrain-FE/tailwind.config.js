/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#eeeeef",
          200: "#e6e9ed",
          600: "#95989c"
        },
        stone: {
          950: "#0c0a09",
          200: "#e7e5e4"
        },
        green: {
          600: "#16a34a",
          200: "#bbf7d0",
          300: "#86efac",
          900: "#14532d",
          950: "#052e16",
          500: "#22c55e"
        }
      }
    },
  },
  plugins: [],
}

