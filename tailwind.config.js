/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'dirtyspokes': {
          light: '#ee7a3d',
          DEFAULT: '#b65d2e',
          dark: '#8a4723',
        },
      },
    },
  },
  plugins: [],
}

