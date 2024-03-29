// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react-hooks/exhaustive-deps': 'error',
    'react/no-children-prop': 'off',
  },
}

module.exports = config
