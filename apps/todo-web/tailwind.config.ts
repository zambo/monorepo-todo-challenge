import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Next.js app files
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    // Monorepo packages - scan all package source files for classes
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/stores/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/utils/src/**/*.{js,ts,jsx,tsx}",
  ],
  // Tailwind v4 uses CSS-based configuration for theme, minimal JS config for content
  plugins: [],
};

export default config;
