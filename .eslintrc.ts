module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Add your custom rule overrides here
    "@next/next/no-img-element": "off",
    "react/react-in-jsx-scope": "off", // already unnecessary in Next.js
    "no-console": "off",
    "no-unused-vars": "off",
  },
};
