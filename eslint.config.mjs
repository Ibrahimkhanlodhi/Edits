import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = {
  extends: [
    "next/core-web-vitals",
    "next",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "babel-eslint", // Only if you're using Babel explicitly (not usually needed with Next.js)
};

export default eslintConfig;
