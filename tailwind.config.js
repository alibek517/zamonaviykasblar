/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Onest', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: '#FAF7F2',
          warm: '#F3EFE6',
          dark: '#0B111E',
          surface: '#131C2E',
        },
        ink: {
          DEFAULT: '#0F1E36',
          muted: '#475569',
          primary: '#1E3A8A',
          royal: '#2563EB',
        },
        lime: {
          accent: '#65A30D',
          bright: '#84CC16',
        },
        amber: {
          accent: '#D97706',
          bright: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};
