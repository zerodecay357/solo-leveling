/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif']
      },
      colors: {
        system: {
          bg: '#06080f',
          panel: '#0b1120',
          blue: '#39c6ff',
          glow: '#5ad8ff',
          edge: '#1b3a5c'
        }
      },
      boxShadow: {
        glow: '0 0 12px rgba(57,198,255,.6), 0 0 30px rgba(57,198,255,.25)'
      }
    }
  },
  plugins: []
}
