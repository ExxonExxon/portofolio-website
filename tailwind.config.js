/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./contact.html", "./src/**/*.{js,ts}"],
  theme: {
    extend: {
      fontSize: {
        xxs: "11px",
        xxxs: "10px",
      },
      letterSpacing: {
        "widest-xl": "0.2em",
        "widest-2xl": "0.25em",
        "widest-3xl": "0.3em",
        "widest-4xl": "0.4em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
