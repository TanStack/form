import { defineConfig, mergeConfig } from 'vitest/config'
import { defaultViteConfig } from '../../getViteConfig'

export default mergeConfig(
  defaultViteConfig,
  defineConfig({
    test: {
      name: 'vue-query',
      dir: './src',
      watch: false,
      environment: 'jsdom',
      globals: true,
      setupFiles: [],
      coverage: { provider: 'istanbul' },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
  }),
)
