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
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F2E9D4',
          300: '#E8DFC9',
          400: '#D8B77E',
          500: '#C29853',
          600: '#9E7734',
          700: '#7D5C22',
          800: '#5C4116',
          900: '#3D2A0C',
        },
      },
    },
  },
  plugins: [],
};
