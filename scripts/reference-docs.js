import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, rm } from 'node:fs/promises'
import * as TypeDoc from 'typedoc'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * @type {Partial<import("typedoc").TypeDocOptions & import("typedoc-plugin-markdown").PluginOptions>}
 */
const options = {
  plugin: [
    'typedoc-plugin-markdown',
    resolve(__dirname, './typedoc-remove-prefix.js'),
  ],
  hideGenerator: true,
  readme: 'none',
  flattenOutputFiles: true,
  entryFileName: 'index',
  hideBreadcrumbs: true,
  hidePageHeader: true,
  useCodeBlocks: true,
  excludePrivate: true,
}

/** @type {Array<{name: string, entryPoints: Array<string>, tsconfig: string, outputDir: string, exclude?: Array<string>}>} */
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

async function main() {
  for (const pkg of packages) {
    // Clean and recreate the output directories
    try {
      await rm(pkg.outputDir, { recursive: true })
    } catch (error) {
      // @ts-expect-error
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
    await mkdir(pkg.outputDir, { recursive: true })

    const app = await TypeDoc.Application.bootstrapWithPlugins({
      ...options,
      entryPoints: pkg.entryPoints,
      tsconfig: pkg.tsconfig,
      exclude: pkg.exclude,
    })

    const project = await app.convert()

    if (project) {
      await app.generateDocs(project, pkg.outputDir)
    }
  }
}

main().catch(console.error)
