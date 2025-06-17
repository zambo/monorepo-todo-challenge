import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: ["zustand", "immer", "@repo/shared", "@repo/utils"],
  splitting: false,
  clean: true,
  watch: options.watch,
}));
