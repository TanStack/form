import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises } from 'node:fs'
import * as TypeDoc from 'typedoc'

const { rm, mkdir } = promises
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @type {Partial<import("typedoc").TypeDocOptions & import("typedoc-plugin-markdown").PluginOptions>}
 */
const options = {
  plugin: [
    'typedoc-plugin-markdown',
    path.resolve(__dirname, './typedoc-remove-prefix.mjs'),
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

const packages = [
  {
    name: 'form-core',
    entryPoint: path.resolve(__dirname, '../packages/form-core/src/index.ts'),
    tsconfig: path.resolve(__dirname, '../packages/form-core/tsconfig.json'),
    outputDir: path.resolve(__dirname, '../docs/reference'),
  },
  {
    name: 'angular-form',
    entryPoint: path.resolve(
      __dirname,
      '../packages/angular-form/src/index.ts',
    ),
    tsconfig: path.resolve(__dirname, '../packages/angular-form/tsconfig.json'),
    outputDir: path.resolve(__dirname, '../docs/framework/angular/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'lit-form',
    entryPoint: path.resolve(
      __dirname,
      '../packages/lit-form/src/index.ts',
    ),
    tsconfig: path.resolve(__dirname, '../packages/lit-form/tsconfig.json'),
    outputDir: path.resolve(__dirname, '../docs/framework/lit/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'react-form',
    entryPoint: path.resolve(
      __dirname,
      '../packages/react-form/src/index.ts',
    ),
    tsconfig: path.resolve(__dirname, '../packages/react-form/tsconfig.json'),
    outputDir: path.resolve(__dirname, '../docs/framework/react/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'solid-form',
    entryPoint: path.resolve(
      __dirname,
      '../packages/solid-form/src/index.ts',
    ),
    tsconfig: path.resolve(__dirname, '../packages/solid-form/tsconfig.json'),
    outputDir: path.resolve(__dirname, '../docs/framework/solid/reference'),
    exclude: ['packages/form-core/**/*'],
  },
  {
    name: 'vue-form',
    entryPoint: path.resolve(
      __dirname,
      '../packages/vue-form/src/index.ts',
    ),
    tsconfig: path.resolve(__dirname, '../packages/vue-form/tsconfig.json'),
    outputDir: path.resolve(__dirname, '../docs/framework/vue/reference'),
    exclude: ['packages/form-core/**/*'],
  },
]

async function main() {
  for (const pkg of packages) {
    // Clean and recreate the output directories
    try {
      await rm(pkg.outputDir, { recursive: true })
    } catch (error) {
      // @ts-ignore
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
    await mkdir(pkg.outputDir, { recursive: true })

    const app = await TypeDoc.Application.bootstrapWithPlugins({
      ...options,
      entryPoints: [pkg.entryPoint],
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
