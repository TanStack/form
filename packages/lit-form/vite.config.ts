import { defineConfig, mergeConfig } from 'vitest/config'
import {tanstackBuildConfig} from "@tanstack/config/build";

const config = defineConfig({
  test: {
    name: 'lit-form',
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
