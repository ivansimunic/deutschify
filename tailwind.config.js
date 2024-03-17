/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
    fontFamily: {
      sans: ["Philosopher"]
    },
    colors: {
      wood: "#1A1818",
      paper: "#F4E5CE",
    },
  },
  plugins: [],
}

