

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Ensure App Router (Next.js 13+)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Pages Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Components
    "./public/**/*.html",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
