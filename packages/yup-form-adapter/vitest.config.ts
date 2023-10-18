import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'yup-form-adapter',
    dir: './src',
    watch: false,
    environment: 'jsdom',
    globals: true,
    coverage: { provider: 'istanbul' },
  },
})
