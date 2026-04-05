/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        medical: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(239, 68, 68, 0.12)",
      },
    },
  },
  plugins: [],
};
