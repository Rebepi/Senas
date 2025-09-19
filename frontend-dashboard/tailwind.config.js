/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",     // violeta
        secondary: "#f1f5f9",   // gris claro
        dark: "#1e293b",        // gris oscuro
      },
    },
  },
  plugins: [],
};
