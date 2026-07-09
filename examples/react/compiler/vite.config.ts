import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = {}

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
        },
      }),
    ],
  }
})
