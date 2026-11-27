import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { build } from 'vite'
import type { Rollup } from 'vite'

const entry = fileURLToPath(new URL('../dist/esm/index.js', import.meta.url))

const eventClientPackage = '@tanstack/devtools-event-client'
const eventClientModule = 'plugin.js'

async function bundle(mode: 'production' | 'development') {
  const result = (await build({
    configFile: false,
    logLevel: 'silent',
    mode,
    define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
    build: {
      write: false,
      minify: false,
      lib: { entry, formats: ['es'], fileName: 'index' },
    },
  })) as Array<Rollup.RollupOutput>

  return result
    .flatMap((output) => output.output)
    .filter((chunk): chunk is Rollup.OutputChunk => chunk.type === 'chunk')
}

function renderedEventClientModules(chunks: Array<Rollup.OutputChunk>) {
  return chunks
    .flatMap((chunk) => Object.entries(chunk.modules))
    .filter(
      ([id, module]) =>
        id.includes(eventClientPackage) &&
        id.endsWith(`/${eventClientModule}`) &&
        module.renderedLength > 0,
    )
    .map(([id, module]) => ({ id, renderedLength: module.renderedLength }))
}

describe('bundle', () => {
  it('excludes the devtools event client from production bundles', async () => {
    const chunks = await bundle('production')

    expect(renderedEventClientModules(chunks)).toEqual([])
  })

  it('includes the devtools event client in development bundles', async () => {
    const chunks = await bundle('development')

    expect(renderedEventClientModules(chunks)).not.toEqual([])
  })
})
