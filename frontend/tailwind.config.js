/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Gold Palette
        gold: {
          50: '#fffdf5',
          100: '#fef9e8',
          200: '#fdf0c5',
          300: '#fbe294',
          400: '#f7cd59',
          500: '#eab308', // Primary Warm Gold
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          metallic: '#D4AF37', // Classic Metallic Gold
          bright: '#F59E0B',
          light: '#FDE68A',
          dark: '#997E25',
          amber: '#F59E0B',
        },
        brand: {
          50: '#fffdf5',
          100: '#fef9e8',
          200: '#fdf0c5',
          300: '#fbe294',
          400: '#f7cd59',
          500: '#eab308', // Primary Luxury Gold
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // High-End Charcoal & Pure Black Palette
        dark: {
          950: '#030303', // Pitch Black
          900: '#0a0a0a', // Core Background
          850: '#121212', // Surface 1
          800: '#18181b', // Surface 2 (Zinc 900)
          750: '#202024', // Surface 3
          700: '#27272a', // Borders
          600: '#3f3f46',
          500: '#52525b',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #997E25 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #ca8a04 0%, #fef08a 50%, #ca8a04 100%)',
        'dark-glass': 'linear-gradient(180deg, rgba(24, 24, 27, 0.85) 0%, rgba(10, 10, 10, 0.95) 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(10, 10, 10, 0.75) 0%, rgba(10, 10, 10, 0.92) 65%, #0a0a0a 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 15px -3px rgba(212, 175, 55, 0.25)',
        'gold': '0 0 25px -4px rgba(212, 175, 55, 0.35)',
        'gold-lg': '0 0 40px -2px rgba(234, 179, 8, 0.45)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.85)',
      }
    },
  },
  plugins: [],
}
