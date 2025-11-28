// @ts-check

import pluginReactHooks from 'eslint-plugin-react-hooks'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-compiler/react-compiler': 'error',
    },
  },
]
