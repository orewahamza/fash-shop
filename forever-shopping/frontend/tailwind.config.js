/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        primary: '#EF4444',
        secondary: '#3B82F6',
        accent: '#0EA5E9',
        brand: {
          red: {
            50: '#FFE5E5',
            100: '#FFCACA',
            200: '#FF9C9C',
            300: '#FF6F6F',
            400: '#F64F4F',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
          blue: {
            50: '#E7F1FF',
            100: '#D4E6FF',
            200: '#ABC9FF',
            300: '#84B0FF',
            400: '#5696FF',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E3A8A',
            900: '#172554',
          },
          black: {
            DEFAULT: '#0A0A0A',
            900: '#0A0A0A',
            950: '#050505',
          },
        },
        gray: {
          50: '#E7F1FF',
          100: '#D4E6FF',
          200: '#ABC9FF',
          300: '#84B0FF',
          400: '#5696FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#0A0A0A',
          800: '#0A0A0A',
          900: '#050505',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(90deg, #EF4444 0%, #3B82F6 100%)',
        'gradient-brand-soft': 'linear-gradient(90deg, rgba(239,68,68,0.9) 0%, rgba(59,130,246,0.9) 100%)',
        'gradient-brand-diagonal': 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)',
        'gradient-brand-radial': 'radial-gradient(circle at 30% 20%, rgba(239,68,68,0.35), rgba(59,130,246,0.35) 60%, rgba(10,10,10,0.8) 100%)',
      }
    },
  },
  plugins: [],
}
