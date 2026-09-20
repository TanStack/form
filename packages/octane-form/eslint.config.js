// @ts-check

import tsrx from '@tsrx/eslint-plugin'
import rootConfig from '../../eslint.config.js'

export default [...rootConfig, ...tsrx.configs.recommended]
