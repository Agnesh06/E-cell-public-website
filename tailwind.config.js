/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFC',
        foreground: '#0A0A0A',
        primary: {
          DEFAULT: '#2547FF',
          foreground: '#FFFFFF',
        },
        surface: '#FFFFFF',
        'soft-blue': '#EDEFFC',
        text: '#0A0A0A',
        'text-secondary': '#262626',
        border: '#E5E5E7',
        muted: {
          DEFAULT: '#F1F1F4',
          foreground: '#71717A',
        },
        input: '#E5E5E7',
        ring: '#2547FF',
        accent: {
          DEFAULT: '#F4F4F6',
          foreground: '#0A0A0A',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration, 35s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 35s) linear infinite',
        fadeIn: 'fadeIn 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
}
