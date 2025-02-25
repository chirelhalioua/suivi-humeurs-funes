/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4CAF50",
          "primary-hover": "#45a049",
          secondary: "#2C1810",
          "secondary-hover": "#3d251b",
          background: "#F4E4BC",
        },
        fontFamily: {
          inter: ["Inter", "sans-serif"],
          sora: ["Sora", "sans-serif"],
        },
        animation: {
          "fade-in-up": "fadeInUp 1s ease-out forwards",
          "slide-up": "slideUp 0.6s ease-out forwards",
        },
        keyframes: {
          fadeInUp: {
            "0%": {
              opacity: "0",
              transform: "translateY(20px)",
            },
            "100%": {
              opacity: "1",
              transform: "translateY(0)",
            },
          },
          slideUp: {
            "0%": {
              opacity: "0",
              transform: "translateY(20px)",
            },
            "100%": {
              opacity: "1",
              transform: "translateY(0)",
            },
          },
        },
      },
    },
    plugins: [],
  };
  