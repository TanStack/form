import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackBuildConfig } from '@tanstack/config/build'
import solid from 'vite-plugin-solid'

const config = defineConfig({
  plugins: [solid()],
  test: {
    name: 'solid-form',
    dir: './src',
    watch: false,
    setupFiles: [],
    environment: 'jsdom',
    globals: true,
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
    server: {
      deps: {
        // https://github.com/solidjs/solid-testing-library#known-issues
        inline: [/solid-js/],
      },
    },
  },
})

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: './src/index.ts',
    srcDir: './src',
    exclude: ['./src/tests'],
  }),
)
