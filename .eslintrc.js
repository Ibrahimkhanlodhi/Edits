module.exports = {
  root: true,
  extends: ["next", "eslint:recommended"],
  rules: {
    // Disable specific rules globally
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-require-imports": "off",
    "react/display-name": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "no-unused-vars": "off", // Disabling `no-unused-vars`
    "no-undef": "off", // Disabling `no-undef`
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
};
