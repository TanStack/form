import * as path from 'path'
import { fileURLToPath } from 'url'
import * as TypeDoc from 'typedoc'
import 'typedoc-plugin-markdown'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
]

async function main() {
  for (const pkg of packages) {
    const app = await TypeDoc.Application.bootstrapWithPlugins({
      ...options,
      entryPoints: [pkg.entryPoint],
      tsconfig: pkg.tsconfig,
    })

    const project = await app.convert()

    if (project) {
      await app.generateDocs(project, pkg.outputDir)
    }
  }
}

main().catch(console.error)
