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
      boxShadow: {
        "glow": "0 0 50px 10px rgba(99,102,241,0.8)", // sombra brillante para hover
      },
      perspective: {
        '1000': '1000px', // perspectiva para flip card
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      // Agregamos utilidades para flip card
      addUtilities({
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
      });
    }
  ],
};
