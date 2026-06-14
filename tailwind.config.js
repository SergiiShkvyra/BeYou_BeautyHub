/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      colors: {
        olive: '#505e47',
        warm: '#dbd6b2',
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
      },
      animation: {
        flash: 'flash 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
