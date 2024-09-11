export default {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    extend: {
      screens: {
        xl: "1000px", // Adiciona um breakpoint personalizado para 1000 pixels
      },
    },
  },
  plugins: [],
  darkMode: "selector",
};