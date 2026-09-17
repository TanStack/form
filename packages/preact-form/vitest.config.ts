import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [preact()],
  optimizeDeps: {
    include: [
      '@testing-library/jest-dom/vitest',
      '@testing-library/preact',
      '@testing-library/user-event',
      'preact',
      'preact/hooks',
      'preact/compat',
      '@tanstack/preact-store',
    ],
  },
  test: {
    name: packageJson.name,
    dir: './tests',
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
