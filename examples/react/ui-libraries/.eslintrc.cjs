// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['plugin:react-hooks/recommended'],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}

module.exports = config
