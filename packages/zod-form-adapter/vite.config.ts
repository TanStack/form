import { defineConfig, mergeConfig } from 'vitest/config'
import { defaultViteConfig } from '../../getViteConfig'

export default mergeConfig(
  defaultViteConfig,
  defineConfig({
    test: {
      name: 'zod-form-adapter',
      dir: './src',
      watch: false,
      environment: 'jsdom',
      globals: true,
      coverage: { provider: 'istanbul' },
    },
  }),
)
