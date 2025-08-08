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
    },
  },
  plugins: [],
};
