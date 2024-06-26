// @ts-check

// @ts-expect-error
import { rootConfig } from '@tanstack/config/eslint'

export default [
  ...rootConfig,
  {
    name: 'tanstack/temp',
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/method-signature-style': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
    },
  },
]
