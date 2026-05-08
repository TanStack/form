/**
 * Debugging:
 *   https://eslint.org/docs/latest/use/configure/debug
 *  ----------------------------------------------------
 *
 *   Print a file's calculated configuration
 *
 *     npx eslint --print-config path/to/file.js
 *
 *   Inspecting the config
 *
 *     npx eslint --inspect-config
 *
 */
import babelParser from '@babel/eslint-parser/experimental-worker';
import emberParser from 'ember-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import ember from 'eslint-plugin-ember/recommended';
import importPlugin from 'eslint-plugin-import';
import n from 'eslint-plugin-n';
import globals from 'globals';

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
};

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
      // type-only declarations confuse the JS rule; rely on tsc/glint instead
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{gjs,gts}'],
    languageOptions: {
      parser: emberParser,
      parserOptions: { ...esmParserOptions },
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
]);
