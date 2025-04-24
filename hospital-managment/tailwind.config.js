/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#2f4f7f', // Define your custom dark blue color
        darkblack: '#333333', // Define your custom dark black color
      },
    },
  },
  plugins: [],
}

