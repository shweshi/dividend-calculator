/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-dark": "#16151c", // Replace with your desired hex code
        "card-dark": "#fff"
      },
    },
  },
  plugins: [],
};

