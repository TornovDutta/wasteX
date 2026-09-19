/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#141414", // dark bg
        secondary: "#1a1a1a", // slightly lighter bg
        accent: "#F59E0B", // yellowish/orange similar to wemakedevs AWS
        textmain: "#f3f4f6", // whiteish text
        textmuted: "#9ca3af", // gray text
      }
    },
  },
  plugins: [],
}
