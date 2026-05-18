import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0a0a0a',
          surface: '#111111',
          card: '#161616',
          elevated: '#1c1c1c',
        },
        accent: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dim: 'rgba(59,130,246,0.12)',
        },
        danger: '#ef4444',
        success: '#22c55e',
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          hover: 'rgba(255,255,255,0.13)',
        },
        text: {
          primary: '#f0f0f0',
          secondary: '#888888',
          muted: '#555555',
        },
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        eq1: { '0%': { height: '4px' }, '100%': { height: '18px' } },
        eq2: { '0%': { height: '10px' }, '100%': { height: '22px' } },
        eq3: { '0%': { height: '16px' }, '100%': { height: '6px' } },
      },
      animation: {
        'fade-up': 'fadeUp 0.3s ease-out forwards',
        'fade-in-up': 'fadeUp 0.3s ease-out forwards',
        eq1: 'eq1 0.55s ease-in-out infinite alternate',
        eq2: 'eq2 0.4s ease-in-out infinite alternate',
        eq3: 'eq3 0.65s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
} satisfies Config
