import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#07070c',
          900: '#0b0b12',
          850: '#101019',
          800: '#15151f',
          700: '#1e1e2b',
          600: '#2a2a3a',
        },
        neon: {
          DEFAULT: '#a259ff',
          soft: '#c79bff',
          dim: '#6d3bb5',
        },
        accent: {
          DEFAULT: '#00e5c0',
          dim: '#0a8f7a',
        },
        brand: {
          twitch: '#9146ff',
          kick: '#53fc18',
          youtube: '#ff0033',
          x: '#e7e9ea',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(162, 89, 255, 0.25), 0 18px 40px -20px rgba(162, 89, 255, 0.55)',
        card: '0 20px 45px -30px rgba(0, 0, 0, 0.9)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(162,89,255,0.18), transparent 60%), radial-gradient(circle at 85% 40%, rgba(0,229,192,0.12), transparent 55%)',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.9)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-live': 'pulse-live 1.6s ease-in-out infinite',
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
