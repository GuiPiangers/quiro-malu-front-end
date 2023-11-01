import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        main: '#8A48C7',
        'main-hover': '#7B3DB5',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translate(-100%)' },
          '100%': { transform: 'translate(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0%' },
          '100%': { opacity: '100%' },
        },
        fadeOut: {
          '0%': { opacity: '100%' },
          '100%': { opacity: '0%' },
        },
      },
    },
  },
}
export default config
