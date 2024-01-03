import { defineConfig, mergeConfig } from 'vitest/config'
import { getDefaultViteConfig } from '../../getViteConfig'

export default mergeConfig(
  getDefaultViteConfig({ dirname: __dirname, entryPath: 'src/index.ts' }),
  defineConfig({
    test: {
      name: 'vue-query',
      dir: './src',
      watch: false,
      environment: 'jsdom',
      globals: true,
      setupFiles: [],
      coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
      typecheck: { enabled: true },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
  }),
)
