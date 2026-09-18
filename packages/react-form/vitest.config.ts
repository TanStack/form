import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'vitest-browser-react',
      'react',
      'react-dom',
      'react-dom/client',
      '@tanstack/react-store',
    ],
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    setupFiles: ['vitest-browser-react', './tests/test-setup.ts'],
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
    projects: [
      {
        extends: true,
        test: {
          name: `${packageJson.name}: normal`,
          env: {
            VITEST_REACT_STRICT_MODE: 'false',
          },
        },
      },
      {
        extends: true,
        test: {
          name: `${packageJson.name}: strict`,
          env: {
            VITEST_REACT_STRICT_MODE: 'true',
          },
        },
      },
    ],
  },
})
