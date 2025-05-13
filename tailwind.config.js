import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'white',
            h1: {
              color: 'white',
            },
            h2: {
              color: 'white',
            },
            h3: {
              color: 'white',
            },
            strong: {
              color: 'white',
            },
            a: {
              color: 'white',
              '&:hover': {
                color: 'white',
                opacity: 0.8,
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    typographyPlugin,
  ],
};