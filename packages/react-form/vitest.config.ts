import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [react()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    globals: true,
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
