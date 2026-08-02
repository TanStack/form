import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [preact()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    globals: true,
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
