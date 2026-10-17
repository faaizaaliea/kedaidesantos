export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#46564a", // warna dominan
          light: "#5f7565", // welcome
        },
        sage: {
          DEFAULT: "#879587",
          dark: "#7c8b80",
        },
        sand: "#d0cec2", // badge
        line: "#b1b2b5", // border
        cream: "#f4f1e8", // bg
        paper: "#fdfcf5", // panel
        white: "#ffffff", //putih
      },
      boxShadow: {
        rim: "0 3px 10px 2px rgba(208,206,194,0.5)", // bayangan navbar & welcome
        pop: "0 0 10px 2px rgba(135,149,135,0.5)", //bayangan popup
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"], // teks utama
        serif: ["Fraunces", "Georgia", "serif"], // "Welcome"
        display: ['"Fugaz One"', "system-ui", "sans-serif"], // "Dashboard Kasir"
      },
    },
  },
  plugins: [],
};
