import reactCompiler from 'eslint-plugin-react-compiler'
import rootConfig from '../../../eslint.config.js'

export default [
  ...rootConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactCompiler.configs.recommended,
  },
]
