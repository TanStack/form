import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [preact()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    globals: true,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**/*'],
    },
  },
})
