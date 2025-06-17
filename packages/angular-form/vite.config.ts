import { defineConfig } from 'vitest/config'
import angular from '@analogjs/vite-plugin-angular'
import tsconfigPaths from 'vite-tsconfig-paths'
import packageJson from './package.json'

const tsconfigPath = 'tsconfig.spec.json'

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths({projects: [tsconfigPath]}), angular({ tsconfig: tsconfigPath })],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
    globals: true,
    restoreMocks: true,
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
