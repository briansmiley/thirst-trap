import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        blood: '#2e0604',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        alertFlash: {
          '0%, 100%': { color: '#ff0000' },
          '50%': { color: '#8b0000' },
        },
      },
      animation: {
        alertFlash: 'alertFlash 1s step-end infinite',
      },
    },
  },
  plugins: [animate],
}
export default config
