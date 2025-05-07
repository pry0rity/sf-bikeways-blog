/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sf-green': '#008000',
        'sf-green-dark': '#006400',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 