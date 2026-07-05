/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f6ff',
          100: '#eceeff',
          200: '#d3d6ff',
          300: '#aab0ff',
          400: '#7c81fb',
          500: '#5457ee',
          600: '#413ed6',
          700: '#3630ac',
          800: '#2e2c89',
          900: '#28286f',
        },
        ink: '#14161f',
        paper: '#faf9f6',
        amber: {
          400: '#f2ab3d',
          500: '#e8932a',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(20, 22, 31, 0.06), 0 1px 2px rgba(20,22,31,0.04)',
        cardHover: '0 16px 32px -12px rgba(20, 22, 31, 0.18)',
      },
    },
  },
  plugins: [],
};
