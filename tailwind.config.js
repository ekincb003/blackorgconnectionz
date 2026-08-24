/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf8eb',
          100: '#f5efc7',
          200: '#ecdd8f',
          300: '#e1c653',
          400: '#d4ab27',
          500: '#b88c17',
          600: '#9d6e12',
          700: '#7e5012',
          800: '#694116',
          900: '#583617',
          950: '#331c0a',
        },
        brand: {
          black: '#0a0a0c',
          card: '#121317',
          border: '#23252e',
          accent: '#e5a93c',
          crimson: '#9b111e',
          royal: '#1b3b6f',
          emerald: '#0d5c3a',
          purple: '#4a154b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
