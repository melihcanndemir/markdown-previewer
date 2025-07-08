/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import scrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
    scrollbar({ nocompatible: true }),
  ],
  variants: {
    scrollbar: ['dark', 'rounded']
  }
} 