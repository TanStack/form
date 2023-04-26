import path from 'path'
import type { BranchConfig, Package } from './types'

// TODO: List your npm packages here. The first package will be used as the versioner.
export const packages: Package[] = [
  {
    name: '@tanstack/form-core',
    packageDir: 'form-core',
    srcDir: 'src',
    jsName: 'FormCore',
    entryFile: 'src/index.ts',
    globals: {},
  },
  {
    name: '@tanstack/react-form',
    packageDir: 'react-form',
    srcDir: 'src',
    jsName: 'ReactForm',
    entryFile: 'src/index.ts',
    globals: {
      react: 'React',
    },
  },
  // {
  //   name: '@tanstack/react-form-devtools',
  //   packageDir: 'react-form-devtools',
  //   srcDir: 'src',
  // },
  // {
  //   name: '@tanstack/react-form-persist-client',
  //   packageDir: 'react-form-persist-client',
  //   srcDir: 'src',
  // },
  // {
  //   name: '@tanstack/solid-form',
  //   packageDir: 'solid-form',
  //   srcDir: 'src',
  // },
  // {
  //   name: '@tanstack/svelte-form',
  //   packageDir: 'svelte-form',
  //   srcDir: 'src',
  // },
  // {
  //   name: '@tanstack/vue-form',
  //   packageDir: 'vue-form',
  //   srcDir: 'src',
  // },
]

export const latestBranch = 'main'

export const branchConfigs: Record<string, BranchConfig> = {
  main: {
    prerelease: false,
    ghRelease: true,
  },
  next: {
    prerelease: true,
    ghRelease: true,
  },
  beta: {
    prerelease: true,
    ghRelease: true,
  },
  alpha: {
    prerelease: true,
    ghRelease: true,
  },
}

export const rootDir = path.resolve(__dirname, '..')
export const examplesDirs = [
  'examples/react',
  // 'examples/solid',
  // 'examples/svelte',
  // 'examples/vue',
]
