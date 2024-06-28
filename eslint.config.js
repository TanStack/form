// @ts-check

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/config/eslint'

export default [
  ...tanstackConfig,
  {
    name: 'tanstack/local',
    rules: {
      'ts/array-type': 'off',
      'ts/ban-types': 'off',
      'ts/method-signature-style': 'off',
      'ts/naming-convention': 'off',
      'ts/no-unnecessary-type-assertion': 'off',
      'ts/prefer-for-of': 'off',
      'ts/require-await': 'off',
      'no-async-promise-executor': 'off',
      'no-empty': 'off',
    },
  },
]
