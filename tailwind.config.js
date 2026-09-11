/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#F5D77F',
          400: '#E5C05B',
          500: '#D4AF37', // Official JyM metallic gold
          600: '#B89025',
          700: '#8C6B14',
        },
        dark: {
          950: '#000000', // True Deep Black
          900: '#080808',
          850: '#0F0F0F',
          800: '#161616',
          700: '#222222',
          600: '#333333',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
