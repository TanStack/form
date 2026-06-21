import { test } from '@playwright/test'
import {
  collectHeapUsage,
  createFreshPage,
  disposeBench,
  getBenchMetrics,
  implementations,
  openVariant,
  prepareBench,
  runBenchInteraction,
  scenarioVariants,
  summarizeMemorySamples,
  writeJsonResult,
} from './runner-utils'
import type { MemorySample } from './runner-utils'

test.describe.configure({ mode: 'serial' })

test('collect browser memory results', async ({ browser }) => {
  const results = []

  for (const implementation of implementations) {
    for (const variant of scenarioVariants) {
      const samples: Array<MemorySample> = []
      let metrics = null

      for (let index = 0; index < variant.memory.samples; index++) {
        const page = await createFreshPage(browser)

        try {
          await openVariant(page, implementation, variant)
          const beforeMount = await collectHeapUsage(page)

          await prepareBench(page)
          const afterMount = await collectHeapUsage(page)

          for (
            let interaction = 0;
            interaction < variant.memory.interactions;
            interaction++
          ) {
            await runBenchInteraction(page)
          }
          const afterInteractions = await collectHeapUsage(page)

          metrics = await getBenchMetrics(page)
          await disposeBench(page)
          const afterUnmount = await collectHeapUsage(page)

          samples.push({
            beforeMount,
            afterMount,
            afterInteractions,
            afterUnmount,
          })
        } finally {
          await page.context().close()
        }
      }

      results.push({
        implementation,
        scenario: variant.id,
        size: variant.size,
        sizeKind: variant.sizeKind,
        samples,
        summary: summarizeMemorySamples(samples),
        metrics,
      })
    }
  }

  writeJsonResult('memory.json', {
    generatedAt: new Date().toISOString(),
    unit: 'bytes',
    results,
  })
})
