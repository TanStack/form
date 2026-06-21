import { test } from '@playwright/test'
import {
  clearJsonResultDir,
  disposeBench,
  formatBenchmarkLabel,
  getBenchMetrics,
  implementations,
  measureBenchRun,
  openVariant,
  prepareBench,
  resultShardPath,
  scenarioVariants,
  summarize,
  writeJsonResult,
} from './runner-utils'

test.describe.configure({ mode: 'serial' })

test.beforeAll(() => {
  clearJsonResultDir('speed')
})

for (const implementation of implementations) {
  for (const variant of scenarioVariants) {
    test(`speed ${formatBenchmarkLabel(implementation, variant)}`, async ({
      page,
    }) => {
      await openVariant(page, implementation, variant)
      await prepareBench(page)

      for (let index = 0; index < variant.speed.warmups; index++) {
        await measureBenchRun(page)
      }

      const samples = []
      for (let index = 0; index < variant.speed.iterations; index++) {
        samples.push(await measureBenchRun(page))
      }

      const metrics = await getBenchMetrics(page)
      await disposeBench(page)

      writeJsonResult(resultShardPath('speed', implementation, variant), {
        generatedAt: new Date().toISOString(),
        unit: 'milliseconds',
        result: {
          implementation,
          scenario: variant.id,
          size: variant.size,
          sizeKind: variant.sizeKind,
          warmups: variant.speed.warmups,
          iterations: variant.speed.iterations,
          samples,
          summary: summarize(samples),
          metrics,
        },
      })
    })
  }
}
