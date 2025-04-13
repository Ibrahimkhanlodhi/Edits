module.exports = {
  parser: "@babel/eslint-parser", // Using Babel parser to handle ESModules
  extends: ["next/core-web-vitals", "next/typescript"], // Next.js + TypeScript config
  parserOptions: {
    ecmaVersion: 2020, // Enable modern ECMAScript features
    sourceType: "module", // This allows the usage of import/export syntax
  },
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "ImportDeclaration",
        message: "The 'import' keyword is reserved and should not be used in CommonJS files.",
        enabled: false,
      },
    ],
    // Add other rules to disable as needed
    "no-console": "off",
    "no-unused-vars": "off",
  },
};
