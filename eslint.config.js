// @ts-check

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/config/eslint'

export default [
  ...tanstackConfig,
  {
    name: 'tanstack/temp',
    rules: {
      'ts/array-type': 'off',
      'ts/ban-types': 'off',
      'ts/method-signature-style': 'off',
      'ts/naming-convention': 'off',
      'ts/no-unnecessary-type-assertion': 'off',
      'no-async-promise-executor': 'off',
    },
  },
]
