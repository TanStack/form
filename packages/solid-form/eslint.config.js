// @ts-check

import rootConfig from '../../eslint.config.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
  },
  {
    plugins: {},
    rules: {},
  },
  {
    files: ['**/__tests__/**'],
    rules: {},
  },
]
