import { defineConfig, mergeConfig } from 'vitest/config'
import { defaultViteConfig } from '../../getViteConfig'
import solid from 'vite-plugin-solid'

export default mergeConfig(
  defaultViteConfig,
  defineConfig({
    plugins: [solid()],
    test: {
      name: 'solid-form',
      dir: './src',
      watch: false,
      setupFiles: [],
      environment: 'jsdom',
      globals: true,
      coverage: { provider: 'istanbul' },
      server: {
        deps: {
          // https://github.com/solidjs/solid-testing-library#known-issues
          inline: [/solid-js/],
        },
      },
    },
  }),
)
