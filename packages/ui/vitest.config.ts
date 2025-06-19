import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["../../test-setup.ts"],
    include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".next"],
  },
  resolve: {
    alias: {
      "@repo/ui": path.resolve(__dirname, "./src"),
      "@repo/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@repo/stores": path.resolve(__dirname, "../../packages/stores/src"),
      "@repo/utils": path.resolve(__dirname, "../../packages/utils/src"),
      "@repo/config": path.resolve(__dirname, "../../packages/config"),
    },
  },
});
