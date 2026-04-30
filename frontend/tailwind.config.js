/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        blush: {
          DEFAULT: '#F2C4CE',
          deep: '#E8A0B0',
        },
        sage: {
          DEFAULT: '#B5C9B0',
          deep: '#8BAF85',
        },
        beige: '#EDE0D4',
        'warm-white': '#FDFAF6',
        charcoal: '#2A2A2A',
        mid: '#5C5C5C',
        light: '#9A9A9A',
        gold: '#C9A96E',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Jost"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
