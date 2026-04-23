/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Nunito Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Nunito Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0f172a',
        },
        slate: {
          800: '#1e293b',
        },
        emerald: {
          500: '#10b981',
        },
        crimson: {
          600: '#e11d48',
        }
      },
    },
  },
  plugins: [],
}
