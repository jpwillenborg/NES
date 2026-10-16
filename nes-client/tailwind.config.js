/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: '#090d16',
          panel: '#111823',
          cyan: '#00e5ff', 
          purple: '#fc107e'
        }
      },
      gridTemplateColumns: {
        24: 'repeat(24, minmax(0, 1fr))'
      }
    }
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-portfolio-cyan': theme('colors.portfolio.cyan'),
          '--color-portfolio-purple': theme('colors.portfolio.purple'),
        },
      });
    },
  ]
};
