import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './apps/drawcanvas/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/drawcanvas/components/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/drawcanvas/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
