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
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e11d48', // Primary gym crimson/red
          600: '#be123c',
          700: '#9f1239',
          800: '#881337',
          900: '#4c0519',
        },
        dark: {
          900: '#0a0d14',
          850: '#0f1420',
          800: '#151b2a',
          700: '#1e2638',
          600: '#28334b',
        }
      }
    },
  },
  plugins: [],
}
