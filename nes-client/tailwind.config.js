/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: '#090d16',
          panel: '#111823',
          accent: '#00e5ff'
        }
      },
      gridTemplateColumns: {
        24: 'repeat(24, minmax(0, 1fr))'
      }
    }
  },
  plugins: []
};
