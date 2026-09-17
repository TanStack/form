import { defineConfig } from 'vitest/config'
import angular from '@analogjs/vite-plugin-angular'
import tsconfigPaths from 'vite-tsconfig-paths'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json'

const tsconfigPath = 'tsconfig.spec.json'

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths({ projects: [tsconfigPath] }),
    angular({ tsconfig: tsconfigPath }),
  ],
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/core/testing',
      '@angular/common',
      '@angular/platform-browser',
      '@angular/platform-browser/testing',
      '@analogjs/vitest-angular/setup-snapshots',
      '@testing-library/angular',
      '@testing-library/jest-dom/vitest',
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
    globals: true,
    restoreMocks: true,
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
