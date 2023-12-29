import solid from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

export default defineConfig({
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
  plugins: [solid()],
})
