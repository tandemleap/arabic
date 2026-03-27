import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0F4C57',
          dark: '#0A3540',
          light: '#1A6678',
        },
        cream: {
          DEFAULT: '#F8F4EF',
          dark: '#EDE8E0',
        },
        rust: {
          DEFAULT: '#B85C38',
          dark: '#9A4A2C',
          light: '#C97050',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
