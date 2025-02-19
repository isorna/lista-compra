import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import css from "@eslint/css";

// INFO: https://eslint.org/blog/2025/02/eslint-css-support/?s=03


/** @type {import('eslint').Linter.Config[]} */
export default [
  // lint js files
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  // lint css files
  {
    files: ["**/*.css"],
    plugins: {
      css,
    },
    language: "css/css",
    rules: {
      "css/no-duplicate-imports": "error",
    },
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];