/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0A2463', light: '#1a3a8f', dark: '#061840' },
        crimson: { DEFAULT: '#E84855', light: '#f07078', dark: '#c0303b' },
        amber:   { DEFAULT: '#F5A623', light: '#f8bd55', dark: '#d48a10' },
        slate:   { DEFAULT: '#F4F7FA', dark: '#e2e8f0' },
        ink:     { DEFAULT: '#1A1A2E', light: '#2d2d4e' },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body:    ['Open Sans', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out both',
        'slide-up':   'slideUp 0.4s ease-out both',
        'slide-right':'slideRight 0.5s ease-out both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'pop':        'pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      keyframes: {
        fadeIn:     { from: { opacity:'0' }, to: { opacity:'1' } },
        slideUp:    { from: { opacity:'0', transform:'translateY(20px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        slideRight: { from: { opacity:'0', transform:'translateX(40px)' }, to: { opacity:'1', transform:'translateX(0)' } },
        pop:        { from: { opacity:'0', transform:'scale(0.8)' },       to: { opacity:'1', transform:'scale(1)' } },
      },
    },
  },
  plugins: [],
};
