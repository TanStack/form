// @ts-check

import { defineConfig } from 'eslint/config'

// @ts-ignore Needed due to moduleResolution Node vs Bundler
import { tanstackConfig } from '@tanstack/eslint-config'

export default defineConfig([
  ...tanstackConfig,
  {
    name: 'tanstack/temp',
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/method-signature-style': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-async-promise-executor': 'off',
      'no-empty': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "ImportDeclaration[source.value='lucide-solid'][importKind!='type'] > ImportSpecifier[importKind!='type'][imported.name=/Icon$/]",
          message:
            "Import icons from 'lucide-solid/icons/{name}' instead of the 'lucide-solid' barrel.",
        },
      ],
    },
  },
])
