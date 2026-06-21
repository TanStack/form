import { test } from '@playwright/test'
import {
  clearJsonResultDir,
  collectHeapUsage,
  createFreshPage,
  disposeBench,
  formatBenchmarkLabel,
  getBenchMetrics,
  implementations,
  openVariant,
  prepareBench,
  resultShardPath,
  runBenchInteraction,
  scenarioVariants,
  summarizeMemorySamples,
  writeJsonResult,
} from './runner-utils'
import type { MemorySample } from './runner-utils'

test.describe.configure({ mode: 'serial' })

test.beforeAll(() => {
  clearJsonResultDir('memory')
})

for (const implementation of implementations) {
  for (const variant of scenarioVariants) {
    test(`memory ${formatBenchmarkLabel(implementation, variant)}`, async ({
      browser,
    }) => {
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

      writeJsonResult(resultShardPath('memory', implementation, variant), {
        generatedAt: new Date().toISOString(),
        unit: 'bytes',
        result: {
          implementation,
          scenario: variant.id,
          size: variant.size,
          sizeKind: variant.sizeKind,
          samples,
          summary: summarizeMemorySamples(samples),
          metrics,
        },
      })
    })
  }
}
