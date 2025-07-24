/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "roboto-regular": ["Roboto-Regular"],
        "roboto-italic": ["Roboto-Italic"],
        "roboto-bold": ["Roboto-Bold"],
      },
      // colors: {
      //   chatapp: {
      //     green: "#25D366", // green for chat bubbles
      //     background: "#E8E1D9", // Default chat background (light mode)
      //     "dark-background": "#0B141A", // chat dark mode background
      //   },
      // },
    },
  },
  plugins: [],
};
