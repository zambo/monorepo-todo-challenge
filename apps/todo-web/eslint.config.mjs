import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// App-specific linting - extends base + adds React rules
const eslintConfig = [
  ...compat.extends(
    "../../packages/config/eslint/base.js",
    "../../packages/config/eslint/react.js",
  ),
];

export default eslintConfig;
