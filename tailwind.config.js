// tailwind.config.js - Copy this exact code to your project

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#F9F8F6',
        'charcoal': '#1A1A1A',
        'gray-custom': '#808080',
        'gold': '#D4AF37',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': '3.5rem',  // 56px
        'h2': '2.625rem', // 42px
        'h3': '1.5rem',   // 24px
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
      },
    },
  },
  plugins: [],
}
