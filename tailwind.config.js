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
          bg: '#030508',
          panel: '#080d1a',
          blue: '#39c6ff',
          glow: '#5ad8ff',
          edge: '#1b3a5c',
          purple: '#a371f7',
          gold: '#fbbf24',
          shadow: '#7c3aed',
        }
      },
      boxShadow: {
        glow: '0 0 12px rgba(57,198,255,.6), 0 0 30px rgba(57,198,255,.25)',
        'glow-purple': '0 0 12px rgba(163,113,247,.5), 0 0 30px rgba(124,58,237,.2)',
        'glow-gold': '0 0 12px rgba(251,191,36,.6), 0 0 30px rgba(251,191,36,.2)',
      }
    }
  },
  plugins: []
}
