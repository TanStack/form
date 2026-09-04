// @ts-check

import pluginReact from '@eslint-react/eslint-plugin'
import reactCompiler from 'eslint-plugin-react-compiler'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs.recommended,
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-compiler/react-compiler': 'error',
      // Must be "off" to avoid moving `useContext` to `use`, which breaks React 17/18 usage.
      '@eslint-react/no-use-context': 'off',
    },
  },
]
