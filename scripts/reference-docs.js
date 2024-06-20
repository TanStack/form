import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises } from 'node:fs'
const { rm, mkdir } = promises
import * as TypeDoc from 'typedoc'

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
]

async function main() {
  for (const pkg of packages) {
    // Clean and recreate the output directories
    await rm(pkg.outputDir, { recursive: true })
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
