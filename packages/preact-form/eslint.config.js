// @ts-check

import pluginReact from '@eslint-react/eslint-plugin'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs.recommended,
  },
  {
    rules: {
      '@eslint-react/no-use-context': 'off',
    },
  },
]
