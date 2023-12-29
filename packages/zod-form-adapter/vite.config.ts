import { defineConfig, mergeConfig } from 'vitest/config'
import { getDefaultViteConfig } from '../../getViteConfig'

export default mergeConfig(
  getDefaultViteConfig({ dirname: __dirname, entryPath: 'src/index.ts' }),
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
