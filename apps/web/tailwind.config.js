/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Neuton-Regular"', 'Neuton', 'serif'],
        bold: ['"Neuton-Regular"', 'Neuton', 'serif'],
        subtext: ['"Kingthings_Exeter"', '"Kingthings Exeter"', 'serif'],
        sans: ['"Kingthings_Exeter"', '"Kingthings Exeter"', 'system-ui', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        dark: "#07080a",
        surface: "#0e1117",
      },
    },
  },
  plugins: [],
}
