import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  getScenarioVariants,
  scenarioVariantToSearchParams,
} from '../src/scenarios'
import type { Browser, Page } from '@playwright/test'
import type {
  BrowserBenchMetrics,
  ImplementationId,
  ScenarioVariant,
} from '../src/browser-bench.types'

export const implementations: Array<ImplementationId> = [
  'tanstack',
  'react-hook-form',
  'formik',
]
export const scenarioVariants = getScenarioVariants()

export type ResultKind = 'memory' | 'speed'

export interface NumericSummary {
  max: number
  median: number
  min: number
  p75: number
  p95: number
}

export interface HeapUsage {
  totalSize: number
  usedSize: number
}

export interface MemorySample {
  afterInteractions: HeapUsage
  afterMount: HeapUsage
  afterUnmount: HeapUsage
  beforeMount: HeapUsage
}

const baseUrl = 'http://127.0.0.1:4174'

export function getVariantUrl(
  implementation: ImplementationId,
  variant: ScenarioVariant,
): string {
  const params = scenarioVariantToSearchParams(implementation, variant)
  return `${baseUrl}/?${params.toString()}`
}

export function formatBenchmarkLabel(
  implementation: ImplementationId,
  variant: ScenarioVariant,
): string {
  return `${implementation} ${variant.id} ${variant.sizeKind}=${variant.size}`
}

export function resultShardPath(
  kind: ResultKind,
  implementation: ImplementationId,
  variant: ScenarioVariant,
): string {
  return `${kind}/${implementation}/${scenarioVariantSlug(variant)}.json`
}

export function clearJsonResultDir(kind: ResultKind) {
  rmSync(join(process.cwd(), 'dist', 'results', kind), {
    force: true,
    recursive: true,
  })
}

export async function openVariant(
  page: Page,
  implementation: ImplementationId,
  variant: ScenarioVariant,
) {
  await page.goto(getVariantUrl(implementation, variant))
  await page.waitForFunction(() => Boolean(window.__bench))
}

export async function prepareBench(page: Page) {
  await page.evaluate(async () => {
    await window.__bench?.prepare()
  })
}

export async function disposeBench(page: Page) {
  await page.evaluate(async () => {
    await window.__bench?.dispose()
  })
}

export async function getBenchMetrics(
  page: Page,
): Promise<BrowserBenchMetrics> {
  return page.evaluate(() => {
    if (!window.__bench) {
      throw new Error('Benchmark controller was not initialized')
    }
    return window.__bench.getMetrics()
  })
}

export async function measureBenchRun(page: Page): Promise<number> {
  return page.evaluate(async () => {
    if (!window.__bench) {
      throw new Error('Benchmark controller was not initialized')
    }

    await window.__bench.reset()
    const start = performance.now()
    await window.__bench.run()
    const end = performance.now()
    await window.__bench.assert()

    return end - start
  })
}

export async function runBenchInteraction(page: Page) {
  await page.evaluate(async () => {
    if (!window.__bench) {
      throw new Error('Benchmark controller was not initialized')
    }

    await window.__bench.reset()
    await window.__bench.run()
    await window.__bench.assert()
  })
}

export async function collectHeapUsage(page: Page): Promise<HeapUsage> {
  const client = await page.context().newCDPSession(page)
  await client.send('HeapProfiler.collectGarbage')
  await client.send('HeapProfiler.collectGarbage')
  const usage = (await client.send('Runtime.getHeapUsage')) as HeapUsage
  await client.detach()

  return {
    totalSize: usage.totalSize,
    usedSize: usage.usedSize,
  }
}

export async function createFreshPage(browser: Browser): Promise<Page> {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  })
  return context.newPage()
}

export function summarize(samples: Array<number>): NumericSummary {
  if (samples.length === 0) {
    throw new Error('Cannot summarize an empty sample set')
  }

  const sorted = samples.slice().sort((a, b) => a - b)

  return {
    min: sorted[0]!,
    median: percentile(sorted, 0.5),
    p75: percentile(sorted, 0.75),
    p95: percentile(sorted, 0.95),
    max: sorted[sorted.length - 1]!,
  }
}

export function summarizeMemorySamples(samples: Array<MemorySample>) {
  return {
    beforeMount: summarize(
      samples.map((sample) => sample.beforeMount.usedSize),
    ),
    afterMount: summarize(samples.map((sample) => sample.afterMount.usedSize)),
    afterInteractions: summarize(
      samples.map((sample) => sample.afterInteractions.usedSize),
    ),
    afterUnmount: summarize(
      samples.map((sample) => sample.afterUnmount.usedSize),
    ),
  }
}

export function writeJsonResult(filename: string, result: unknown) {
  const resultsDir = join(process.cwd(), 'dist', 'results')
  const filePath = join(resultsDir, filename)

  mkdirSync(resultsDir, { recursive: true })
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(result, null, 2)}\n`)
}

function scenarioVariantSlug(variant: ScenarioVariant): string {
  return `${variant.id}-${variant.sizeKind}-${variant.size}`
}

function percentile(sortedSamples: Array<number>, percentileValue: number) {
  const index = Math.min(
    sortedSamples.length - 1,
    Math.max(0, Math.ceil(sortedSamples.length * percentileValue) - 1),
  )

  return sortedSamples[index]!
}
