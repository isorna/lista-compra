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
    }]
  }
};