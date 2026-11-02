import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1b4d3e",
          sage: "#8A9A86",
          cream: "#F9F6F0",
          gold: "#C5A880",
        }
      },
    },
  },
  plugins: [],
};
export default config;
