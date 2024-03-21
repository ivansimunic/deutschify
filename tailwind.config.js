import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons"


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Philosopher"],
    },
    colors: {
      wood: "#1A1818",
      paper: "#F4E5CE",
      correct: "#00E6AC",
      incorrect: "#FF4D4D"
    },
  },
  plugins: [
    iconsPlugin({
      // Select the icon collections you want to use
      // You can also ignore this option to automatically discover all individual icon packages you have installed
      // If you install @iconify/json, you should explicitly specify the collections you want to use, like this:
      // collections: getIconCollections(["mdi", "lucide"]),
      // If you want to use all icons from @iconify/json, you can do this:
      collections: getIconCollections("all"),
      // and the more recommended way is to use `dynamicIconsPlugin`, see below.
    }),
  ],
};

