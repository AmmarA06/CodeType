/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1e1e1e',
          card: '#252526',
          border: '#3e3e42',
          text: '#d4d4d4',
          muted: '#858585',
        },
        accent: {
          primary: '#569cd6',
          success: '#4ec9b0',
          error: '#f48771',
          warning: '#dcdcaa',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
