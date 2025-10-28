const { off } = require("./src/app");

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "linebreak-style": 0,
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "consistent-return": "off",
    semi: ["error", "always"],
    "no-unused-vars": "off",
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-console": "off",
    "no-restricted-syntax": "off",
    "no-lonely-if": "off",
    "no-continue": "off",
    "prefer-destructuring": "off",
    camelcase: "off",
  },
};
