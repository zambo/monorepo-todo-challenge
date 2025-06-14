// React-specific extensions
module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn",
  },
};
