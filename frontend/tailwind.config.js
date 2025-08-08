module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Updated colour palette for a sleek blue aesthetic
        primary: {
          DEFAULT: '#eff6ff', // light blue background
          dark: '#dbeafe',
        },
        accent: '#3b82f6', // vibrant blue for buttons and highlights
        secondary: '#e0e7ff', // secondary background shade
        highlight: '#bfdbfe', // lighter highlight shade
      },
      fontFamily: {
        // Use Inter for body text and headings
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
};