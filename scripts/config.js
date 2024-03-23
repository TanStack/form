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
  },
  {
    name: '@tanstack/react-form',
    packageDir: 'packages/react-form',
  },
  {
    name: '@tanstack/vue-form',
    packageDir: 'packages/vue-form',
  },
  {
    name: '@tanstack/zod-form-adapter',
    packageDir: 'packages/zod-form-adapter',
  },
  {
    name: '@tanstack/yup-form-adapter',
    packageDir: 'packages/yup-form-adapter',
  },
  {
    name: '@tanstack/valibot-form-adapter',
    packageDir: 'packages/valibot-form-adapter',
  },
  {
    name: '@tanstack/solid-form',
    packageDir: 'packages/solid-form',
  },
  {
    name: '@tanstack/lit-form',
    packageDir: 'packages/lit-form',
  },
  {
    name: '@tanstack/angular-form',
    packageDir: 'packages/angular-form',
  },
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
