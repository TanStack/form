import path from 'path'
import { BranchConfig, Package } from './types'

// TODO: List your npm packages here.
export const packages: Package[] = [
  {
    name: '@tanstack/form-core',
    packageDir: 'packages/form-core',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/react-form',
    packageDir: 'packages/react-form',
    entries: ['main', 'module', 'types'],
  },
  {
    name: '@tanstack/vue-form',
    packageDir: 'packages/vue-form',
    entries: ['main', 'module', 'types'],
  },
  // {
  //   name: '@tanstack/solid-store',
  //   packageDir: 'packages/solid-store',
  //   entries: ['main', 'module', 'types'],
  // },
  // {
  //   name: '@tanstack/svelte-store',
  //   packageDir: 'packages/svelte-store',
  //   entries: ['main', 'module', 'types'],
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
