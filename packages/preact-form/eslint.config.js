// @ts-check

// @ts-ignore: no types for eslint-config-preact
import preact from 'eslint-config-preact'
import tseslint from 'typescript-eslint'
import rootConfig from '../../eslint.config.js'
// eslint-config-preact uses typescript-eslint under the hood

export default [
  ...rootConfig,
  ...preact,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      'typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Disable base rule to prevent overload false positives
      'no-redeclare': 'off',
      // TS-aware version handles overloads correctly
      '@typescript-eslint/no-redeclare': 'error',
      'no-duplicate-imports': 'off',
      'no-unused-vars': 'off',
    },
  },
]
