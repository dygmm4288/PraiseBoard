/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#111111",
          800: "#272728",
          700: "#323234",
          500: "#8E8E93",
          300: "#D1D1D6",
          200: "#EEEEEE",
          100: "#F6F6F6",
        },
        white: "#FFFFFF",
        primary: {
          800: "#2C2643",
          700: "#44307A",
          600: "#5839A8",
          500: "#7145D6",
          400: "#8C5CFF",
          300: "#B696FF",
          200: "#D2BFFF",
          100: "#E8DEFF",
          DEFAULT: "#7DE0FF",
          foreground: "#000",
        },
        secondary: {
          // TODO 추가 예정
        },
      },
      fontFamily: {
        pretendard: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        title1: [
          "32px",
          {
            lineHeight: "44px",
            letterSpacing: "-0.64px",
          },
        ],
        title2: [
          "26px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.52px",
          },
        ],
        body1: [
          "18px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.18px",
          },
        ],
        body2: [
          "18px",
          {
            lineHeight: "28px",
            letterSpacing: "0em",
          },
        ],
        button1: [
          "18px",
          {
            lineHeight: "24px",
            letterSpacing: "0em",
          },
        ],
        caption1: [
          "15px",
          {
            lineHeight: "22px",
            letterSpacing: "0em",
          },
        ],
      },
      spacing: {
        screen: "16px",
        screenLg: "24px",
        screenSm: "12px",

        section: "20px",
        card: "16px",

        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};
