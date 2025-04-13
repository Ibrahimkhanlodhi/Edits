module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable 'import' reserved keyword error
    "no-restricted-syntax": [
      "error",
      {
        selector: "ImportDeclaration",
        message: "The 'import' keyword is reserved, and should not be used in CommonJS files.",
        enabled: false
      }
    ],
    // You can disable other rules you don't need
    "@next/next/no-img-element": "off",
    "react/react-in-jsx-scope": "off",
    "no-console": "off",
    "no-unused-vars": "off",
  },
};
