module.exports = {
  parser: "@typescript-eslint/parser", // Use TypeScript parser
  parserOptions: {
    ecmaVersion: 2020, // Set ECMAScript version to handle ES2017 and later syntax
    sourceType: "module", // Enable ESModules (import/export)
    ecmaFeatures: {
      jsx: true, // Enable JSX support (if using React)
    },
  },
  extends: [
    "next/core-web-vitals", // Next.js linting rules
    "next/typescript", // Add TypeScript linting rules for Next.js
  ],
  rules: {
    // Disable the "no-restricted-syntax" rule entirely
    "no-restricted-syntax": "off",
    // You can also disable other rules you don't need
    "no-console": "off",
    "no-unused-vars": "off",
  },
};
