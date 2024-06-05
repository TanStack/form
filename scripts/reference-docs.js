import * as path from 'path'
import { fileURLToPath } from 'url'
import * as TypeDoc from 'typedoc'
import 'typedoc-plugin-markdown'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const base = path.resolve(__dirname, '../packages/form-core')
  const app = await TypeDoc.Application.bootstrapWithPlugins({
    entryPoints: [path.resolve(base, 'src/index.ts')],
    plugin: [
      'typedoc-plugin-markdown',
      path.resolve(__dirname, './typedoc-remove-prefix.mjs'),
    ],
    tsconfig: path.resolve(base, 'tsconfig.json'),
    hideGenerator: true,
    readme: 'none',
    flattenOutputFiles: true,
    entryFileName: 'index',
    hideBreadcrumbs: true,
    hidePageHeader: true,
    useCodeBlocks: true,
    excludePrivate: true,
  })

  const project = await app.convert()

  if (project) {
    const outputDir = 'docs/reference'
    await app.generateDocs(project, outputDir)
  }
}

main().catch(console.error)
