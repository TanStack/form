import { defineConfig } from 'vite'
import { octane } from 'octane/compiler/vite'

export default defineConfig({
  plugins: [octane()],
  resolve: {
    extensions: ['.tsrx', '.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  build: { target: 'esnext' },
})
