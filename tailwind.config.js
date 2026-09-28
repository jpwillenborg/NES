/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./Views/**/*.cshtml",
    "./Pages/**/*.cshtml",
    "./wwwroot/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: '#090d16',
          panel: '#111823',
          accent: '#00e5ff',
        }
      }
    },
  },
  plugins: [],
}
