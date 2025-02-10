/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 커스텀 색상 정의
        yellow: "#FFE76B", // 노란색
        lightOrange: "#FFD573", // 밝은 주황색
        orange: "#EC8E04", // 주황색
        blue: "#6B83FF", // 파란색 
        lightGray: "#C6C6C6", // 밝은 회색
        darkGray: "#595959", // 어두운 회색
      }
    },
    fontFamily: {
      Gidugu: ["Gidugu"],
    },
  },
  plugins: [],
};
