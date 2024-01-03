import { defineConfig, mergeConfig } from 'vitest/config'
import { getDefaultViteConfig } from '../../getViteConfig'

export default mergeConfig(
  getDefaultViteConfig({ dirname: __dirname, entryPath: 'src/index.ts' }),
  defineConfig({
    test: {
      name: 'valibot-form-adapter',
      dir: './src',
      watch: false,
      environment: 'jsdom',
      globals: true,
      coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
      typecheck: { enabled: true },
    },
  }),
)
