/** @type {import('tailwindcss').Config} */
const config = {
  plugins: [
    tailwindcss('./tailwind.config.ts'),
    autoprefixer,
    tailwindcssAnimate,
    postcssImport,
  ],
};

export default config;