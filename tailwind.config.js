/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      brand: {
        darBlue: '#1F3A93',
        redDark: '#BB2F3D',
        redBright: '#D72638',
        grayLight: '#F5F5F5',
      },
    },
    extend: {},
  },
  plugins: [],
}
