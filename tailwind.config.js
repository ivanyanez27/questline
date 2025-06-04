/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#F3F0FF',
          100: '#E9E3FF',
          200: '#D4CBFF',
          300: '#B7A8FF',
          400: '#9B85FF',
          500: '#6B46C1',
          600: '#553C9A',
          700: '#44337A',
          800: '#322659',
          900: '#1F1637',
          950: '#0F0B1D',
        },
        secondary: {
          50: '#EDFAFA',
          100: '#D5F5F6',
          200: '#AFECEF',
          300: '#7EDCE2',
          400: '#38B2AC',
          500: '#319795',
          600: '#2C7A7B',
          700: '#285E61',
          800: '#234E52',
          900: '#1D4044',
          950: '#0F2228',
        },
        accent: {
          50: '#FFF5EB',
          100: '#FEE8D3',
          200: '#FDD0A7',
          300: '#F6AD55',
          400: '#ED8936',
          500: '#DD6B20',
          600: '#C05621',
          700: '#9C4221',
          800: '#7B341E',
          900: '#652B19',
          950: '#331509',
        },
        text: {
          primary: '#2D3748',
          secondary: '#4A5568',
        },
        bg: {
          light: '#F7FAFC',
          dark: '#1A202C',
          card: {
            light: '#FFFFFF',
            dark: '#2D3748',
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};