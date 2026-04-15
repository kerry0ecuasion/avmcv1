/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#eef3f9',
          100: '#d4e0f0',
          200: '#a9c1e0',
          300: '#7ea2d1',
          400: '#5383c1',
          500: '#416BA9',
          600: '#2B5597',
          700: '#1e3f73',
          800: '#142b50',
          900: '#0b1a33',
        },
        accent: {
          400: '#A2D45E',
          500: '#F3265D',
          600: '#d01e50',
        },
      },
      keyframes: {
        'medical-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'link-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(65, 107, 169, 0.4)' },
          '100%': { boxShadow: '0 0 0 8px rgba(65, 107, 169, 0)' },
        },
        'underline-expand': {
          'from': { width: '0', opacity: '0' },
          'to': { width: '100%', opacity: '1' },
        },
        'stagger-nav': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'nav-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(1deg)' },
          '66%': { transform: 'translateY(4px) rotate(-1deg)' },
        },
        'scale-reveal': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
      animation: {
        'medical-pulse': 'medical-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'link-glow': 'link-glow 0.6s ease-out',
        'underline-expand': 'underline-expand 0.4s ease-out forwards',
        'stagger-nav': 'stagger-nav 0.5s ease-out forwards',
        'nav-float': 'nav-float 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'float-gentle': 'float-gentle 6s ease-in-out infinite',
        'scale-reveal': 'scale-reveal 0.8s ease-out forwards',
      },
      spacing: {
        '120': '30rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
