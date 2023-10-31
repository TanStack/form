import path from 'path'
import { BranchConfig, Package } from './types'

// TODO: List your npm packages here.
export const packages: Package[] = [
  {
    name: '@tanstack/form-core',
    packageDir: 'form-core',
  },
  {
    name: '@tanstack/react-form',
    packageDir: 'react-form',
  },
  {
    name: '@tanstack/vue-form',
    packageDir: 'vue-form',
  },
  {
    name: '@tanstack/zod-form-adapter',
    packageDir: 'zod-form-adapter',
  },
  {
    name: '@tanstack/yup-form-adapter',
    packageDir: 'yup-form-adapter',
  },
  {
    name: '@tanstack/solid-form',
    packageDir: 'solid-form',
  },
  // {
  //   name: '@tanstack/svelte-form',
  //   packageDir: 'svelte-form',
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
  'examples/vue',
  // 'examples/solid',
  // 'examples/svelte',
]
