/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)', /* teal-700 / teal-500 dark */
          foreground: 'var(--color-primary-foreground)', /* white / dark-surface */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* slate-800 / slate-700 dark */
          foreground: 'var(--color-secondary-foreground)', /* slate-50 / slate-100 dark */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* orange-600 / orange-400 dark */
          foreground: 'var(--color-accent-foreground)', /* white / dark-surface */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-600 / red-500 dark */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* emerald-600 / emerald-500 dark */
          foreground: 'var(--color-success-foreground)', /* white / dark-surface */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* amber-600 / amber-500 dark */
          foreground: 'var(--color-warning-foreground)', /* white / dark-surface */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-600 / red-500 dark */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* slate-100 / slate-800 dark */
          foreground: 'var(--color-muted-foreground)', /* slate-500 / white-70 dark */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* slate-50 / dark-elevated */
          foreground: 'var(--color-card-foreground)', /* slate-700 / white-90 dark */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white / dark-elevated-2 */
          foreground: 'var(--color-popover-foreground)', /* slate-800 / white-90 dark */
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '500' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        'prose': '70ch',
      },
      boxShadow: {
        'warm-sm': 'var(--shadow-sm)',
        'warm': 'var(--shadow-md)',
        'warm-md': 'var(--shadow-md)',
        'warm-lg': 'var(--shadow-lg)',
        'warm-xl': 'var(--shadow-xl)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out': 'slide-out 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}