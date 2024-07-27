import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateReferenceDocs } from '@tanstack/config/typedoc'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('@tanstack/config/typedoc').Package[]} */
const packages = [
  {
    name: 'form-core',
    entryPoints: [resolve(__dirname, '../packages/form-core/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/form-core/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/reference'),
  },
  {
    name: 'angular-form',
    entryPoints: [resolve(__dirname, '../packages/angular-form/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/angular-form/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/framework/angular/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'lit-form',
    entryPoints: [resolve(__dirname, '../packages/lit-form/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/lit-form/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/framework/lit/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'react-form',
    entryPoints: [resolve(__dirname, '../packages/react-form/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/react-form/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/framework/react/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'solid-form',
    entryPoints: [resolve(__dirname, '../packages/solid-form/src/index.tsx')],
    tsconfig: resolve(__dirname, '../packages/solid-form/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/framework/solid/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'vue-form',
    entryPoints: [resolve(__dirname, '../packages/vue-form/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/vue-form/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/framework/vue/reference'),
    exclude: ['packages/form-core/**/*'],
  },
]

await generateReferenceDocs({ packages })

process.exit(0)
