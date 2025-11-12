/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // React Native Reusables 기본 테마
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // 앱 아이콘 기반 브랜드 컬러
        teal: {
          50: '#E6F7F5',
          100: '#B3E8E2',
          200: '#8DD5CC',
          300: '#5CBDB3',
          400: '#3EAFA3',
          500: '#2A9B8F',
          600: '#1B7A7A',
          700: '#156565',
          800: '#0F4F4F',
          900: '#0A3939',
        },
        slate: {
          50: '#EDF3F7',
          100: '#DBE7F0',
          200: '#B7CFE1',
          300: '#93B7D2',
          400: '#6F9FC3',
          500: '#4B7FA0',
          600: '#3D6882',
          700: '#2F5164',
          800: '#243D4D',
          900: '#1A2D38',
        },
        coral: {
          50: '#FFF0EC',
          100: '#FFD7CC',
          200: '#FFB59D',
          300: '#FF9B7A',
          400: '#FF8761',
          500: '#F5764A',
          600: '#E6866D',
          700: '#CC6B51',
          800: '#B35540',
          900: '#994630',
        },
        cream: {
          50: '#FFFBF5',
          100: '#FFF5E1',
          200: '#F5E6D3',
          300: '#E8D4BB',
          400: '#DBC4A5',
          500: '#CEB590',
          600: '#B8A07A',
          700: '#9A8564',
          800: '#7C6A4F',
          900: '#5E503B',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
