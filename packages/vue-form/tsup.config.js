// @ts-check

import { defineConfig } from 'tsup'
import { legacyConfig, modernConfig } from '../../getTsupConfig.js'

export default defineConfig([
  modernConfig({ entry: ['src/*.ts', 'src/*.tsx'] }),
  legacyConfig({ entry: ['src/*.ts', 'src/*.tsx'] }),
])
