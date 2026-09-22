// @ts-check

import tsrx from '@tsrx/eslint-plugin'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig.map((config) =>
    config.name === 'tanstack/javascript'
      ? { ...config, files: [...(config.files ?? []), 'localsrc/**/*.cts'] }
      : config,
  ),
  ...tsrx.configs.recommended,
]
