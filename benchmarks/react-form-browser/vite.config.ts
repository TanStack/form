import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
