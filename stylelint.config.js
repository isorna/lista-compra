/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  // extends: ["stylelint-config-tailwindcss"],
  ignoreFiles: [
      "src/css/output.css"
  ],
  rules: {
    "alpha-value-notation": "number",
    "at-rule-no-unknown": [true, {
      "ignoreAtRules": ["tailwind"]
    }],
    "selector-id-pattern": "^[a-z][a-zA-Z0-9]+$", // camel case selectors
    "no-descending-specificity": null
  }
};