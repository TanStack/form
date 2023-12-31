import { defineConfig, mergeConfig } from 'vitest/config'
import { getDefaultViteConfig } from '../../getViteConfig'

console.log(__dirname)

export default mergeConfig(
  getDefaultViteConfig({ dirname: __dirname, entryPath: 'src/index.ts' }),
  defineConfig({
    test: {
      name: 'form-core',
      dir: './src',
      watch: false,
      environment: 'jsdom',
      globals: true,
      coverage: { provider: 'istanbul' },
    },
  }),
)
