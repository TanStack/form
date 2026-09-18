import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  optimizeDeps: {
    include: ['@tanstack/store', '@tanstack/pacer-lite'],
  },
  test: {
    name: packageJson.name,
    dir: './',
    watch: false,
    setupFiles: ['./tests/test-setup.ts'],
    globals: true,
    browser: {
      enabled: true,
      provider: playwright(
        process.env.CI ? { launchOptions: { channel: 'chrome' } } : {},
      ),
      instances: [{ browser: 'chromium', headless: true }],
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**/*'],
    },
  },
})
