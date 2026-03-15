const { COLOR } = require("./shared/constants/colors.constant.js");

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
        ...COLOR,
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
        title3: [
          "20px",
          {
            lineHeight: "30px",
            letterSpacing: "-0.18px",
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
