import { test } from '@playwright/test'
import {
  disposeBench,
  getBenchMetrics,
  implementations,
  measureBenchRun,
  openVariant,
  prepareBench,
  scenarioVariants,
  summarize,
  writeJsonResult,
} from './runner-utils'

test.describe.configure({ mode: 'serial' })

test('collect browser speed results', async ({ page }) => {
  const results = []

  for (const implementation of implementations) {
    for (const variant of scenarioVariants) {
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

      results.push({
        implementation,
        scenario: variant.id,
        size: variant.size,
        sizeKind: variant.sizeKind,
        warmups: variant.speed.warmups,
        iterations: variant.speed.iterations,
        samples,
        summary: summarize(samples),
        metrics,
      })
    }
  }

  writeJsonResult('speed.json', {
    generatedAt: new Date().toISOString(),
    unit: 'milliseconds',
    results,
  })
})
