import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

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
  define: {
    'process.env': JSON.stringify({}),
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
