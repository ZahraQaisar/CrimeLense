/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0B1220',
        'navy-light': '#0F172A',
        'neon-teal': '#14F1D9',
        'danger': '#FF4D4D',
        'warning': '#F59E0B',
        'safe': '#22C55E',
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
