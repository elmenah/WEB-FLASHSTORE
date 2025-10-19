/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        beam: "beam calc(var(--duration)*1s) infinite linear",
        "beam-reverse": "beam-reverse calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
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