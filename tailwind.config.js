/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      colors: {
        olive: '#505e47',
        'olive-deep': '#3a4531',
        'olive-ink': '#262c20',
        warm: '#dbd6b2',
        cream: '#f5f2e6',
        'cream-soft': '#ece7d3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'olive-warm': 'linear-gradient(to bottom, #dbd6b2, #505e47)',
        'warm-grad': 'linear-gradient(to bottom, #505e47, #dbd6b2)',
      },
      keyframes: {
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        flash: 'flash 1.2s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
