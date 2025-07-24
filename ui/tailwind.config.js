/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // 使 Tailwind 应用到所有源代码文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}