// @ts-check

import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * List your npm packages here. The first package will be used as the versioner.
 * @type {import('./types').Package[]}
 */
export const packages = [
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

/**
 * Contains config for publishable branches.
 * @type {Record<string, import('./types').BranchConfig>}
 */
export const branchConfigs = {
  main: {
    prerelease: false,
  },
  next: {
    prerelease: true,
  },
  beta: {
    prerelease: true,
  },
  alpha: {
    prerelease: true,
  },
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))
export const rootDir = resolve(__dirname, '..')
