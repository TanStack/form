import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateReferenceDocs } from '@tanstack/typedoc-config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await generateReferenceDocs({
  packages: [
    {
      name: 'form-core',
      entryPoints: [resolve(__dirname, '../packages/form-core/src/index.ts')],
      tsconfig: resolve(__dirname, '../packages/form-core/tsconfig.docs.json'),
      outputDir: resolve(__dirname, '../docs/reference'),
    },
    {
      name: 'angular-form',
      entryPoints: [
        resolve(__dirname, '../packages/angular-form/src/index.ts'),
      ],
      tsconfig: resolve(
        __dirname,
        '../packages/angular-form/tsconfig.docs.json',
      ),
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
      name: 'preact-form',
      entryPoints: [resolve(__dirname, '../packages/preact-form/src/index.ts')],
      tsconfig: resolve(
        __dirname,
        '../packages/preact-form/tsconfig.docs.json',
      ),
      outputDir: resolve(__dirname, '../docs/framework/preact/reference'),
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
    // The server adapters each re-export all of react-form on top of their own
    // API, so they exclude it as well as form-core and get their own output
    // directory -- all three export a `useTransform` and a `ServerValidateError`,
    // which would otherwise overwrite each other.
    {
      name: 'react-form-nextjs',
      entryPoints: [
        resolve(__dirname, '../packages/react-form-nextjs/src/index.ts'),
      ],
      tsconfig: resolve(
        __dirname,
        '../packages/react-form-nextjs/tsconfig.docs.json',
      ),
      outputDir: resolve(__dirname, '../docs/framework/react/reference/nextjs'),
      exclude: [
        'packages/form-core/**/*',
        'packages/react-form/**/*',
        '**/react-store/**/*',
      ],
    },
    {
      name: 'react-form-remix',
      entryPoints: [
        resolve(__dirname, '../packages/react-form-remix/src/index.ts'),
      ],
      tsconfig: resolve(
        __dirname,
        '../packages/react-form-remix/tsconfig.docs.json',
      ),
      outputDir: resolve(__dirname, '../docs/framework/react/reference/remix'),
      exclude: [
        'packages/form-core/**/*',
        'packages/react-form/**/*',
        '**/react-store/**/*',
      ],
    },
    {
      name: 'react-form-start',
      entryPoints: [
        resolve(__dirname, '../packages/react-form-start/src/index.ts'),
      ],
      tsconfig: resolve(
        __dirname,
        '../packages/react-form-start/tsconfig.docs.json',
      ),
      outputDir: resolve(__dirname, '../docs/framework/react/reference/start'),
      exclude: [
        'packages/form-core/**/*',
        'packages/react-form/**/*',
        '**/react-store/**/*',
      ],
    },
  ],
})

console.log('\n✅ All markdown files have been processed!')

process.exit(0)
