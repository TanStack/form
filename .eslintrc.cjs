// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['**/build', '**/coverage', '**/dist'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import-x'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import-x/recommended',
    'plugin:import-x/typescript',
    'prettier',
  ],
  env: {
    browser: true,
    es2020: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  settings: {
    'import-x/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/method-signature-style': 'off', // ENABLE
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true },
    ],
    'import-x/default': 'off',
    'import-x/export': 'off',
    'import-x/namespace': 'off',
    'import-x/newline-after-import': 'error',
    'import-x/no-cycle': 'error',
    'import-x/no-duplicates': 'off',
    'import-x/no-named-as-default-member': 'off',
    'import-x/no-unresolved': 'off',
    'import-x/no-unused-modules': ['off', { unusedExports: true }],
    'import-x/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    'no-async-promise-executor': 'off',
    'no-empty': 'off',
    'no-redeclare': 'off',
    'no-shadow': 'error',
    'no-undef': 'off',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'off',
      },
    },
  ],
}

module.exports = config
