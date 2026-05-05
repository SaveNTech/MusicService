import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'bg-base': '#08080f',
        'bg-surface': '#0f0f1c',
        'bg-card': '#13132a',
        'bg-elevated': '#1a1a35',
        'accent': {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          dim: 'rgba(124,58,237,0.2)',
        },
        'sky': {
          accent: '#0ea5e9',
        },
        'rose': {
          accent: '#f43f5e',
        },
        'border-subtle': 'rgba(255,255,255,0.07)',
        'text-primary': '#e8e8f5',
        'text-secondary': '#7878a0',
        'text-muted': '#4a4a6a',
      },
      backdropBlur: {
        xs: '4px',
      },
      keyframes: {
        eq1: {
          '0%': { height: '4px' },
          '100%': { height: '18px' },
        },
        eq2: {
          '0%': { height: '10px' },
          '100%': { height: '22px' },
        },
        eq3: {
          '0%': { height: '16px' },
          '100%': { height: '6px' },
        },
        floatOrb: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.97)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        eq1: 'eq1 0.55s ease-in-out infinite alternate',
        eq2: 'eq2 0.4s ease-in-out infinite alternate',
        eq3: 'eq3 0.65s ease-in-out infinite alternate',
        'float-orb': 'floatOrb 12s ease-in-out infinite',
        'float-orb-slow': 'floatOrb 18s ease-in-out infinite reverse',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
