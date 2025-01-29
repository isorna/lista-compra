/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: [
      "src/css/output.css"
  ],
  rules: {
    "alpha-value-notation": "number"
  }
};