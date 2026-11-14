/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#080D20',
        ocean: '#102B50',
        electric: '#287BFF',
        liquid: {
          cyan: '#42DDF5',
          violet: '#9B70FF',
          pink: '#F078C8',
        },
        frosted: '#EAF5FF',
        emerald: {
          DEFAULT: '#10B981',
          500: '#10B981',
          400: '#34D399',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px rgba(66, 221, 245, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.08)',
        'glass-violet': '0 0 25px rgba(155, 112, 255, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.08)',
        'glass-electric': '0 0 30px rgba(40, 123, 255, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        deep: '24px',
      },
      backgroundImage: {
        'liquid-gradient': 'linear-gradient(135deg, #287BFF 0%, #42DDF5 50%, #9B70FF 100%)',
        'liquid-aurora': 'linear-gradient(135deg, #9B70FF 0%, #F078C8 50%, #42DDF5 100%)',
        'glass-surface': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glass-surface-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.6) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'left center' },
          '50%': { backgroundSize: '200% 200%', backgroundPosition: 'right center' },
        },
      },
    },
  },
  plugins: [],
};
