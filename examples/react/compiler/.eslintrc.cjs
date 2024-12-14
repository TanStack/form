// @ts-check
const reactCompiler = require('eslint-plugin-react-compiler')

/** @type {import('eslint').Linter.Config} */
const config = {
  plugins: {
    'react-compiler': reactCompiler,
  },
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
}

module.exports = config
