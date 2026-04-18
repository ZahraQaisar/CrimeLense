/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New CSS variable mappings (rgb variants allow opacity modifiers like bg-surface/50)
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--surface-elevated-rgb) / <alpha-value>)',
        'accent-teal': 'rgb(var(--accent-rgb) / <alpha-value>)',
        'danger-red': 'rgb(var(--danger-rgb) / <alpha-value>)',
        'warning-amber': 'rgb(var(--warning-rgb) / <alpha-value>)',
        'info-blue': 'rgb(var(--info-rgb) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        'text-faint': 'rgb(var(--text-faint-rgb) / <alpha-value>)',

        // Legacy colors mapped to CSS variables (automatically upgrades old pages to light mode)
        'deep-navy': 'rgb(var(--bg-rgb) / <alpha-value>)',
        'navy-light': 'rgb(var(--surface-elevated-rgb) / <alpha-value>)',
        'neon-teal': 'rgb(var(--accent-rgb) / <alpha-value>)',
        'danger': 'rgb(var(--danger-rgb) / <alpha-value>)',
        'warning': 'rgb(var(--warning-rgb) / <alpha-value>)',
        'safe': 'rgb(var(--accent-rgb) / <alpha-value>)',
        'glass': 'rgba(var(--border-subtle), 0.5)',

        // Override standard colors so hardcoded text-white / text-gray-400 invert during light mode
        white: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        black: 'rgb(var(--bg-rgb) / <alpha-value>)',
        gray: {
          100: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
          200: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
          300: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
          400: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
          500: 'rgb(var(--text-faint-rgb) / <alpha-value>)',
          600: 'rgb(var(--text-faint-rgb) / <alpha-value>)',
          700: 'rgb(var(--border-default) / <alpha-value>)',
          800: 'rgb(var(--surface-elevated-rgb) / <alpha-value>)',
          900: 'rgb(var(--surface-rgb) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'Syne', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.07)',
        default: 'rgba(255,255,255,0.12)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fade-up': 'fadeUp 0.2s ease forwards',
        'shimmer': 'shimmer 1.5s infinite linear',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'bar-fill': 'barFill 0.8s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '0.5' },
        },
        barFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
      },
    },
  },
  plugins: [],
}
