import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [solid()],
  optimizeDeps: {
    include: ['solid-js', 'solid-js/web'],
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    globals: true,
    browser: {
      enabled: true,
      provider: playwright(
        process.env.CI ? { launchOptions: { channel: 'chrome' } } : {},
      ),
      instances: [{ browser: 'chromium', headless: true }],
    },
  },
})
