/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F7F8FA',
        'bg-tertiary': '#EFF1F5',
        'bg-card': '#FFFFFF',
        'bg-input': '#F7F8FA',
        'bg-dark': '#193B68',
        'bg-dark-card': '#1B2D4A',

        // Borders
        'border-primary': '#E5E7EB',
        'border-hover': '#CBD5E1',
        'border-active': '#1479FF',

        // Typography
        'text-primary': '#193B68',
        'text-secondary': '#5A6B82',
        'text-tertiary': '#94A3B8',
        'text-white': '#FFFFFF',

        // Brand
        'brand': '#1479FF',
        'brand-hover': '#1060D0',
        'brand-muted': 'rgba(20, 121, 255, 0.10)',
        'brand-light': 'rgba(20, 121, 255, 0.06)',

        // Accents
        'accent-cyan': '#14D2FF',
        'accent-blue': '#14A5FF',
        'accent-teal': '#14EBFF',

        // Status
        'success': '#16A34A',
        'success-muted': 'rgba(22, 163, 74, 0.08)',
        'warning': '#D97706',
        'warning-muted': 'rgba(217, 119, 6, 0.08)',
        'danger': '#DC2626',
        'danger-muted': 'rgba(220, 38, 38, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'hero-sm': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'section': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
        'elevated': '0 8px 24px rgba(0,0,0,0.10)',
        'brand': '0 4px 14px rgba(20,121,255,0.30)',
      },
      borderRadius: {
        'card': '4px',
        'btn': '4px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'fade-in-up-d1': 'fadeInUp 0.4s 0.08s ease-out both',
        'fade-in-up-d2': 'fadeInUp 0.4s 0.16s ease-out both',
        'fade-in-up-d3': 'fadeInUp 0.4s 0.24s ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
