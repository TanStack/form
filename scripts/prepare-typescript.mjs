import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { check, patch } from 'ts-patch'

const require = createRequire(import.meta.url)

// Enable compiler plugins for every version in Octane's type-check matrix.
// Leave typescript.js unchanged so editor and compiler API users keep stock TS.
for (const compiler of [
  'typescript56',
  'typescript57',
  'typescript58',
  'typescript',
]) {
  const options = {
    dir: dirname(require.resolve(`${compiler}/package.json`)),
    silent: true,
  }
  patch('tsc.js', options)
  const installed = check(['tsc.js'], options)['tsc.js']
  if (!installed || installed.isOutdated) {
    throw new Error(`Could not enable compiler plugins for ${compiler}`)
  }
}
