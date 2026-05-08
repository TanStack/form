/**
 * Mount + unmount cost for forms with many `<form.Field>` instances.
 *
 * Skipped by default. Two modes:
 *
 *   # 1) Timing table across field counts
 *   PERF=1 pnpm --filter @tanstack/react-form test:lib field-render-perf
 *
 *   # 2) CPU profile of a single mount + unmount, written next to this file as
 *   #    field-render-perf.mount.N{N}.cpuprofile / .unmount.N{N}.cpuprofile.
 *   #    Open with Chrome DevTools (Performance → Load profile) or VS Code's
 *   #    "vscode-js-profile-flame" extension.
 *   PERF=1 PROFILE=1 PROFILE_N=2000 pnpm --filter @tanstack/react-form test:lib field-render-perf
 *
 * (No `--` separator: with pnpm 10's `--filter`, args after `--` get dropped
 * before vitest sees them, so the filename filter is silently ignored and the
 * full suite runs instead.)
 *
 *
 * RESULTS BEFORE OPTIMIZATION ==================================
 *  iterations=5 warmup=1 env=jsdom (median of 5)
 *      N      mount    unmount      total        total min..max
 *    100     17.9ms     18.5ms     36.3ms          35.3..45.8ms
 *    500    185.1ms    419.9ms    601.5ms        599.8..612.1ms
 *   1000    691.2ms   1897.7ms   2549.5ms      2457.9..2677.3ms
 *   2000   2709.0ms   8351.3ms  11060.6ms    10882.0..11462.1ms
 * ==============================================================
 *
 * NOTE: This file is intended to be removed before merge.
 */
import { writeFileSync } from 'node:fs'
import { Session } from 'node:inspector/promises'
import { join } from 'node:path'
import { describe, it } from 'vitest'
import { act, render } from '@testing-library/react'
import { useForm } from '../src/index'

const COUNTS = [100, 500, 1000, 2000]
const WARMUP = 1
const ITERATIONS = 5
const PROFILE = !!process.env.PROFILE
const PROFILE_N = Number(process.env.PROFILE_N || 1000)

function ManyFields({ ids }: { ids: string[] }) {
  const form = useForm({
    defaultValues: {} as Record<string, string>,
  })

  return (
    <form>
      {ids.map((id, i) => (
        <div key={id}>
          <label>
            <span>Field #{i + 1}</span>
            <form.Field name={id}>
              {(field) => (
                <input onChange={() => {}} value={field.state.value || ''} />
              )}
            </form.Field>
          </label>
        </div>
      ))}
    </form>
  )
}

function makeIds(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `f${i}`)
}

interface Sample {
  mountMs: number
  unmountMs: number
  totalMs: number
}

async function measureOnce(ids: string[]): Promise<Sample> {
  let result: ReturnType<typeof render> | null = null

  const t0 = performance.now()
  await act(async () => {
    result = render(<ManyFields ids={ids} />)
  })
  const t1 = performance.now()

  await act(async () => {
    result!.unmount()
  })
  const t2 = performance.now()

  return { mountMs: t1 - t0, unmountMs: t2 - t1, totalMs: t2 - t0 }
}

interface Stats {
  median: number
  min: number
  max: number
}

function summarize(xs: number[]): Stats {
  const sorted = [...xs].sort((a, b) => a - b)
  return {
    median: sorted[Math.floor(sorted.length / 2)]!,
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
  }
}

function fmt(ms: number) {
  return `${ms.toFixed(1).padStart(7)}ms`
}

// V8 CPU profile around an arbitrary region. Writes a .cpuprofile to disk that
// Chrome DevTools / vscode-js-profile-flame can load directly.
async function withCpuProfile<T>(
  outPath: string,
  fn: () => Promise<T>,
): Promise<T> {
  const session = new Session()
  session.connect()
  try {
    await session.post('Profiler.enable')
    // 100us sample interval — ~10x finer than default; plenty of detail
    // without ballooning profile size for sub-second regions.
    await session.post('Profiler.setSamplingInterval', { interval: 100 })
    await session.post('Profiler.start')
    const result = await fn()
    const { profile } = await session.post('Profiler.stop')
    writeFileSync(outPath, JSON.stringify(profile))
    return result
  } finally {
    session.disconnect()
  }
}

describe.skipIf(!process.env.PERF)('field render perf', () => {
  it('mount + unmount cost across field counts', async () => {
    const rows: Array<{
      n: number
      mount: Stats
      unmount: Stats
      total: Stats
    }> = []

    for (const N of COUNTS) {
      const ids = makeIds(N)
      for (let i = 0; i < WARMUP; i++) await measureOnce(ids)
      const samples: Sample[] = []
      for (let i = 0; i < ITERATIONS; i++) samples.push(await measureOnce(ids))
      rows.push({
        n: N,
        mount: summarize(samples.map((s) => s.mountMs)),
        unmount: summarize(samples.map((s) => s.unmountMs)),
        total: summarize(samples.map((s) => s.totalMs)),
      })
    }

    const lines = [
      '',
      `iterations=${ITERATIONS} warmup=${WARMUP} env=jsdom (median of ${ITERATIONS})`,
      `${'N'.padStart(5)}  ${'mount'.padStart(9)}  ${'unmount'.padStart(9)}  ${'total'.padStart(9)}  ${'total min..max'.padStart(20)}`,
    ]
    for (const r of rows) {
      lines.push(
        `${String(r.n).padStart(5)}  ${fmt(r.mount.median)}  ${fmt(r.unmount.median)}  ${fmt(r.total.median)}  ${`${r.total.min.toFixed(1)}..${r.total.max.toFixed(1)}ms`.padStart(20)}`,
      )
    }
    console.log(lines.join('\n'))
  }, 600_000)

  it.skipIf(!PROFILE)(
    `cpu profile: mount + unmount at N=${PROFILE_N}`,
    async () => {
      const ids = makeIds(PROFILE_N)
      for (let i = 0; i < WARMUP; i++) await measureOnce(ids)

      let result: ReturnType<typeof render> | null = null
      const mountPath = join(
        import.meta.dirname,
        `field-render-perf.mount.N${PROFILE_N}.cpuprofile`,
      )
      const unmountPath = join(
        import.meta.dirname,
        `field-render-perf.unmount.N${PROFILE_N}.cpuprofile`,
      )

      const mountMs = await withCpuProfile(mountPath, async () => {
        const t0 = performance.now()
        await act(async () => {
          result = render(<ManyFields ids={ids} />)
        })
        return performance.now() - t0
      })

      const unmountMs = await withCpuProfile(unmountPath, async () => {
        const t0 = performance.now()
        await act(async () => {
          result!.unmount()
        })
        return performance.now() - t0
      })

      console.log(
        [
          '',
          `cpu profile (N=${PROFILE_N}):`,
          `  mount   ${mountMs.toFixed(1)}ms  →  ${mountPath}`,
          `  unmount ${unmountMs.toFixed(1)}ms  →  ${unmountPath}`,
          `  open in: Chrome DevTools (Performance → Load profile)`,
          `           or VS Code "vscode-js-profile-flame" extension`,
        ].join('\n'),
      )
    },
    600_000,
  )
})
