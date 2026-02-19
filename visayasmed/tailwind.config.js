/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'medical-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'link-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(2, 132, 199, 0)' },
          '100%': { boxShadow: '0 0 0 8px rgba(2, 132, 199, 0)' },
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
      },
      animation: {
        'medical-pulse': 'medical-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'link-glow': 'link-glow 0.6s ease-out',
        'underline-expand': 'underline-expand 0.4s ease-out forwards',
        'stagger-nav': 'stagger-nav 0.5s ease-out forwards',
        'nav-float': 'nav-float 2s ease-in-out infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
