import path from 'path'
import { BranchConfig, Package } from './types'

// TODO: List your npm packages here.
export const packages: Package[] = [
  {
    name: '@tanstack/form-core',
    packageDir: 'form-core',
    srcDir: 'src',
    builds: [
      {
        jsName: 'TanStackForm',
        entryFile: 'src/index.ts',
        globals: {},
      },
    ],
  },
  {
    name: '@tanstack/react-form',
    packageDir: 'react-form',
    srcDir: 'src',
    builds: [
      {
        jsName: 'ReactForm',
        entryFile: 'src/index.ts',
        globals: {
          react: 'React',
        },
      },
    ],
  },
  {
    name: '@tanstack/vue-form',
    packageDir: 'vue-form',
    srcDir: 'src',
    builds: [
      {
        jsName: 'VueForm',
        entryFile: 'src/index.ts',
        globals: {
          vue: 'Vue',
        },
      },
    ],
  },
  {
    name: '@tanstack/zod-form-adapter',
    packageDir: 'zod-form-adapter',
    srcDir: 'src',
    builds: [
      {
        jsName: 'TanStackForm',
        entryFile: 'src/index.ts',
        globals: {},
      },
    ],
  },
  {
    name: '@tanstack/yup-form-adapter',
    packageDir: 'yup-form-adapter',
    srcDir: 'src',
    builds: [
      {
        jsName: 'TanStackForm',
        entryFile: 'src/index.ts',
        globals: {},
      },
    ],
  },
  {
    name: '@tanstack/valibot-form-adapter',
    packageDir: 'valibot-form-adapter',
    srcDir: 'src',
    builds: [
      {
        jsName: 'TanStackForm',
        entryFile: 'src/index.ts',
        globals: {},
      },
    ],
  },
  {
    name: '@tanstack/solid-form',
    packageDir: 'solid-form',
    srcDir: 'src',
    builds: [
      {
        jsName: 'SolidForm',
        entryFile: 'src/index.ts',
        globals: {
          solid: 'Solid',
        },
      },
    ],
  },
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
export const examplesDirs = ['examples/react', 'examples/vue', 'examples/solid']
