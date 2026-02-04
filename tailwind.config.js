/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './App.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {}
  },
  plugins: []
};
