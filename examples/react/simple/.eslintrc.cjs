// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    "react/no-children-prop": "off"
  },
};

module.exports = config;
