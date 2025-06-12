import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Root ESLint configuration for monorepo
 *
 * Purpose:
 * - Enables lint-staged to work across entire monorepo from root
 * - Extends shared base config from packages/config/eslint/base.js
 * - Provides fallback linting for files not covered by package-specific configs
 *
 * Note: Individual apps/packages can have their own configs for development
 */
const eslintConfig = [
  ...compat.extends("prettier", "./packages/config/eslint/base.js"),
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
    ],
  },
];

export default eslintConfig;
