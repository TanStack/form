import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { generateReferenceDocs } from '@tanstack/typedoc-config'
import { glob } from 'tinyglobby'

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
  ],
})

// Find all markdown files matching the pattern
const markdownFiles = [
  ...(await glob('docs/reference/**/*.md')),
  ...(await glob('docs/framework/*/reference/**/*.md')),
]

console.log(`Found ${markdownFiles.length} markdown files to process\n`)

// Process each markdown file
markdownFiles.forEach((file) => {
  const content = readFileSync(file, 'utf-8')
  let updatedContent = content
  updatedContent = updatedContent.replaceAll(/\]\(\.\.\//gm, '](../../')
  // updatedContent = content.replaceAll(/\]\(\.\//gm, '](../')
  updatedContent = updatedContent.replaceAll(
    /\]\((?!https?:\/\/|\/\/|\/|\.\/|\.\.\/|#)([^)]+)\)/gm,
    // @ts-expect-error
    (match, p1) => `](../${p1})`,
  )

  // Write the updated content back to the file
  if (updatedContent !== content) {
    writeFileSync(file, updatedContent, 'utf-8')
    console.log(`Processed file: ${file}`)
  }
})

console.log('\n✅ All markdown files have been processed!')

process.exit(0)
