import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
    include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".next"],
  },
  resolve: {
    alias: {
      "@repo/ui": "./packages/ui/src",
      "@repo/shared": "./packages/shared/src",
      "@repo/stores": "./packages/stores/src",
      "@repo/utils": "./packages/utils/src",
      "@repo/config": "./packages/config",
    },
  },
});
