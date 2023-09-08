// @ts-check

import { defineConfig } from 'tsup'
import { legacyConfig, modernConfig } from '../../scripts/getTsupConfig.js'

export default defineConfig([
  modernConfig({
    entry: ['src/*.ts', 'src/*.tsx', 'src/utils/*.ts', 'src/utils/*.tsx'],
  }),
  legacyConfig({
    entry: ['src/*.ts', 'src/*.tsx', 'src/utils/*.ts', 'src/utils/*.tsx'],
  }),
])
