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
          400: '#F5C518',
          500: '#E5B107',
          600: '#C79700',
        },
        dark: {
          900: '#0B0F17',
          800: '#131A26',
          700: '#1C2638',
          600: '#2A374E',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
