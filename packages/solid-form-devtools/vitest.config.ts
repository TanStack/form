import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [solid()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    globals: true,
    // Override vite-plugin-solid's jsdom default; tests run in the browser.
    environment: 'node',
    browser: {
      enabled: true,
      provider: playwright(
        process.env.CI ? { launchOptions: { channel: 'chrome' } } : {},
      ),
      instances: [{ browser: 'chromium', headless: true }],
    },
  },
})
