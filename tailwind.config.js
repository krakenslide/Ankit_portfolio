/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060606',
        surface: '#0c0c0c',
        accent: '#c8f542',
        cyan: '#3de8c8',
        muted: '#585450',
        tx: '#e4e0d8',
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
        display: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}
