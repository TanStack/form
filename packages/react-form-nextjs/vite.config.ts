import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/vite-config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json'

const config = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@testing-library/jest-dom/vitest',
      '@testing-library/react',
      'react',
      'react-dom',
      'react-dom/client',
    ],
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    globals: true,
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
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: ['./src/index.ts'],
    cjs: false,
    srcDir: './src',
  }),
)
