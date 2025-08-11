/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
        }
      },
      boxShadow: {
        glow: '0 10px 30px -12px rgba(6, 182, 212, 0.25)',
        card: '0 8px 20px -10px rgba(0,0,0,0.4)'
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    },
  },
  plugins: [],
}