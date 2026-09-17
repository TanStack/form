import { defineConfig } from 'vitest/config'
import packageJson from './package.json' with { type: 'json' }
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: [
      '@testing-library/jest-dom/vitest',
      '@testing-library/vue',
      'vue',
      'vue/server-renderer',
      '@tanstack/vue-store',
    ],
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    setupFiles: ['./tests/test-setup.ts'],
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
  oxc: {
    jsx: {
      runtime: 'classic',
      pragma: 'h',
      pragmaFrag: 'Fragment',
    },
  },
})
