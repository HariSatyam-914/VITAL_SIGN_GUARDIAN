/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
        },
        background: {
          light: 'var(--background-light)',
          dark: 'var(--background-dark)',
        },
        text: {
          light: 'var(--text-light)',
          dark: 'var(--text-dark)',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}