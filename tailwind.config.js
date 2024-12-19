/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      fontSize: {
        'dynamic-base': 'clamp(14px, 4vw, 16px)',
        'dynamic-sm': 'clamp(12px, 3.5vw, 14px)',
        'dynamic-xs': 'clamp(10px, 3vw, 12px)',
      },
      padding: {
        dynamic: 'clamp(8px, 2vw, 16px)',
      },
      margin: {
        dynamic: 'clamp(8px, 2vw, 16px)',
      },
      gap: {
        dynamic: 'clamp(8px, 2vw, 16px)',
      },
      scale: {
        mobile: '1.2',
      },
    },
  },
  plugins: [],
};
