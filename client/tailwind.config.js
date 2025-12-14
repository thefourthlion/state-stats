import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: {
          DEFAULT: '#167c93',
          dark: '#125f73',
        },
        secondary: {
          DEFAULT: '#bfd4b7',
        },
        pastel: {
          teal: {
            DEFAULT: '#78BFB8',
            dark: '#5BA69E',
          },
          blue: {
            DEFAULT: '#A6D8DB',
            dark: '#639FA6',
          },
          pink: {
            DEFAULT: '#f3a3a3',
            dark: '#ed8b8b',
          },
          orange: {
            DEFAULT: '#f6c17a',
            dark: '#fba454',
          },
          red: {
            DEFAULT: '#f25430',
            dark: '#d94b2c',
          },
          green: {
            DEFAULT: '#97BF6F',
            dark: '#578C3E',
          },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #78BFB8 0%, #A6D8DB 100%)',
        'gradient-hero': 'linear-gradient(135deg, #78BFB8 0%, #A6D8DB 50%, #f3a3a3 100%)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}