// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['**/build', '**/coverage', '**/dist'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import/recommended',
    'plugin:import/typescript',
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
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: true,
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
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true },
    ],
    'no-shadow': 'error',
    'import/no-cycle': 'error',
    'import/no-unresolved': ['error', { ignore: ['^@tanstack/'] }],
    'import/no-unused-modules': ['off', { unusedExports: true }],
    'import/order': [
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
