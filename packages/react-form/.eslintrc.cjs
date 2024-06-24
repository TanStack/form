// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: [
    'plugin:@eslint-react/recommended-legacy',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/no-children-prop': 'off',
    'react-hooks/exhaustive-deps': 'error',
  },
}

module.exports = config
