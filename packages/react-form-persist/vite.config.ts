import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackBuildConfig } from '@tanstack/config/build'
import react from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [react()],
  test: {
    name: 'react-form-persist',
    dir: './src',
    watch: false,
    environment: 'jsdom',
    globals: true,
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
  },
})

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: './src/index.ts',
    srcDir: './src',
    exclude: ['./src/tests'],
  }),
)
