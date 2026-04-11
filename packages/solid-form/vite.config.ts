import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/vite-config'
import { fileURLToPath } from 'node:url'
import solid from 'vite-plugin-solid'
import packageJson from './package.json'

const testingLibraryPath = fileURLToPath(
  new URL('./tests/testing-library.ts', import.meta.url),
)

const config = defineConfig({
  plugins: [solid()],
  resolve: {
    alias: [
      { find: '@solidjs/testing-library', replacement: testingLibraryPath },
    ],
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
  },
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: ['./src/index.tsx'],
    srcDir: './src',
  }),
)
