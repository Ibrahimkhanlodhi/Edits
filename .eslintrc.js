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
    // Optional: Disable the "no-restricted-syntax" rule if it's causing issues with `import`
    "no-restricted-syntax": [
      "off", // Disable this if you don't need it
      {
        selector: "ImportDeclaration",
        message: "The 'import' keyword is reserved",
      },
    ],
    // You can also disable other rules you don't need
    "no-console": "off",
    "no-unused-vars": "off",
  },
};
