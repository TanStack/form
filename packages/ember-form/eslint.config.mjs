import babelParser from '@babel/eslint-parser/experimental-worker'
import emberParser from 'ember-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import ember from 'eslint-plugin-ember/recommended'
import importPlugin from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import globals from 'globals'

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
}

export default defineConfig([
  globalIgnores([
    'dist/',
    'dist-*/',
    'declarations/',
    'coverage/',
    'node_modules/',
    '!**/.*',
  ]),
  js.configs.recommended,
  prettier,
  ember.configs.base,
  ember.configs.gjs,
  ember.configs.gts,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ...esmParserOptions },
    },
    rules: {
      // The JS rule reports type-only declarations. ember-tsc covers this.
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{gjs,gts}'],
    languageOptions: {
      parser: emberParser,
      parserOptions: { ...esmParserOptions },
      // ember-source 7.1 puts these in template scope without an import.
      globals: {
        on: 'readonly',
        fn: 'readonly',
        hash: 'readonly',
        array: 'readonly',
        concat: 'readonly',
        get: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{js,gjs,ts,gts}'],
    languageOptions: {
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['src/**/*'],
    plugins: { import: importPlugin },
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
  {
    files: ['**/*.cjs'],
    plugins: { n },
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.mjs'],
    plugins: { n },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: esmParserOptions,
      globals: { ...globals.node },
    },
  },
])
