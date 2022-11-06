/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      dropShadow: {
        'sharp/25': '1px 1px 0 rgba(0, 0, 0, 0.25)',
        'sharp/50': '1px 1px 0 rgba(0, 0, 0, 0.5)',
        'sharp/75': '1px 1px 0 rgba(0, 0, 0, 0.75)',
        sharp: '1px 1px 0 rgb(0, 0, 0)',
      },
      colors: {
        primary: {
          400: '#3B82F6',
          500: '#2563EB',
          600: '#1D4ED8',
        },
        error: {
          400: '#FF4D4D',
          500: '#F82D2D',
          600: '#E11D1D',
        },
      },
    },
  },
  plugins: [],
}
