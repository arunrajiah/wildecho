/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          400: "#57aef5",
          500: "#208AEF",
          600: "#1273d4",
          700: "#0f5cab",
          900: "#0f3d6e",
          950: "#0a2748",
        },
      },
    },
  },
  plugins: [],
};
