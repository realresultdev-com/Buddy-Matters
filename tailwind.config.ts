import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        amazon: {
          dark: "#131921",
          light: "#232f3e",
          subnav: "#232f3e",
          bg: "#eaeded",
          yellow: "#febd69",
          orange: "#f08804",
          btnYellow: "#ffd814",
          btnYellowHover: "#f7ca00",
          btnOrange: "#ffa41c",
          btnOrangeHover: "#fa8900",
          blue: "#007185",
          linkHover: "#c7511f",
          price: "#b12704",
          green: "#007600",
          border: "#d5d9d9",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
