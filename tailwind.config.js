/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        canvas: 'var(--bg-primary)',
        card: 'var(--bg-secondary)',
        dark: 'var(--neutral-dark)',
        yellow: 'var(--accent-yellow)',
        pink: 'var(--accent-pink)',
        cyan: 'var(--accent-cyan)',
        border: 'var(--border-color)',
        subtle: 'var(--border-subtle)',
        danger: 'var(--danger-bg)',
      },
      boxShadow: {
        brutal: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
        'brutal-sm': '2px 2px 0px var(--border-color)',
        'brutal-pressed': '0px 0px 0px var(--border-color)',
      },
      borderWidth: {
        brutal: 'var(--border-width)',
        'brutal-thick': 'var(--border-width-thick)',
      },
      borderRadius: {
        brutal: 'var(--border-radius)',
        'brutal-sm': 'var(--border-radius-sm)',
        pill: 'var(--border-radius-pill)',
      },
    },
  },
  plugins: [],
};
