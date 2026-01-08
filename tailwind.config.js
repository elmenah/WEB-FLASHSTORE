/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        beam: "beam calc(var(--duration)*1s) infinite linear",
        "beam-reverse": "beam-reverse calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        beam: {
          "0%": {
            "stroke-dashoffset": "10",
          },
          "100%": {
            "stroke-dashoffset": "-150",
          },
        },
        "beam-reverse": {
          "0%": {
            "stroke-dashoffset": "-10",
          },
          "100%": {
            "stroke-dashoffset": "150",
          },
        },
      },
    },
  },
  plugins: [],
}