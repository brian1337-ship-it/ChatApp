/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "roboto-regular": ["Roboto-Regular"],
        "roboto-italic": ["Roboto-Italic"],
        "roboto-bold": ["Roboto-Bold"],
      },
    },
  },
  plugins: [],
};
