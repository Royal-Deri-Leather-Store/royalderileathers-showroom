/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whiskey: '#B07D4F',
        pitchblack: '#0A0A0A',
        charcoal: '#141414',
        ivory: '#F9F9F9',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      scale: {
        '108': '1.08',
      }
    },
  },
  plugins: [],
}
