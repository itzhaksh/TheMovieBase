/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textStyles: {
        'responsive': 'text-sm sm:text-base',
        'heading': 'text-3xl font-bold text-gray-700 dark:text-white',
        'subheading': 'text-xl font-semibold text-gray-600 dark:text-gray-300',
        'body': 'text-base text-gray-600 dark:text-gray-400',
      }
    },
  },
  plugins: [],
}
