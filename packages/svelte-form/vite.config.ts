import { defineConfig } from 'vitest/config'
import { defaultClientConditions } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: [
      'vitest-browser-svelte',
      'svelte',
      '@tanstack/svelte-store',
      '@tanstack/form-core',
    ],
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    setupFiles: ['vitest-browser-svelte'],
    browser: {
      enabled: true,
      provider: playwright(
        process.env.CI ? { launchOptions: { channel: 'chrome' } } : {},
      ),
      instances: [{ browser: 'chromium', headless: true }],
    },
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
  },
  resolve: {
    conditions: ['browser', ...defaultClientConditions],
  },
})
