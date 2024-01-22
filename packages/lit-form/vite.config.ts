import { defineConfig, mergeConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'lit-form',
    dir: './src',
    watch: false,
    environment: 'jsdom',
    globals: true,
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
  },
})
