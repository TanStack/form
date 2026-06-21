#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { cwd, exit, stderr } from 'node:process'
import { createServer } from 'vite'

const memoryPhases = [
  'beforeMount',
  'afterMount',
  'afterInteractions',
  'afterUnmount',
]

try {
  const options = parseArgs(process.argv.slice(2))
  const resultsDir = resolve(cwd(), options.resultsDir)
  const outputFile = resolve(
    cwd(),
    options.output ?? join(options.resultsDir, 'compare.json'),
  )
  const htmlOutputFile = resolve(
    cwd(),
    options.htmlOutput ?? join(options.resultsDir, 'compare.html'),
  )

  const speed = readResultFile(resultsDir, 'speed.json')
  const memory = readResultFile(resultsDir, 'memory.json')
  const speedMatrix = validateResultMatrix(speed, 'speed', options.baseline)
  const memoryMatrix = validateResultMatrix(memory, 'memory', options.baseline)

  const speedRows = createSpeedRows(speedMatrix, options.baseline)
  const memoryRows = createMemoryRows(memoryMatrix, options.baseline)
  const result = {
    generatedAt: new Date().toISOString(),
    baseline: options.baseline,
    resultsDir,
    speed: {
      unit: speed.unit,
      rows: speedRows,
    },
    memory: {
      unit: memory.unit,
      phases: memoryPhases,
      rows: memoryRows,
    },
  }

  mkdirSync(dirname(outputFile), { recursive: true })
  writeFileSync(outputFile, `${JSON.stringify(result, null, 2)}\n`)
  console.log(`Wrote ${outputFile}`)

  mkdirSync(dirname(htmlOutputFile), { recursive: true })
  writeFileSync(htmlOutputFile, createHtmlReport(result))
  console.log(`Wrote ${htmlOutputFile}`)

  if (options.open) {
    await serveReport(htmlOutputFile)
  }
} catch (error) {
  stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  exit(1)
}

function parseArgs(args) {
  const options = {
    baseline: 'tanstack',
    htmlOutput: undefined,
    open: false,
    resultsDir: 'dist/results',
    output: undefined,
  }

  for (let index = 0; index < args.length; index++) {
    const arg = args[index]

    if (arg === '--help' || arg === '-h') {
      printHelp()
      exit(0)
    }

    if (arg === '--baseline') {
      options.baseline = readOptionValue(args, ++index, arg)
      continue
    }

    if (arg === '--results-dir') {
      options.resultsDir = readOptionValue(args, ++index, arg)
      continue
    }

    if (arg === '--output') {
      options.output = readOptionValue(args, ++index, arg)
      continue
    }

    if (arg === '--html-output') {
      options.htmlOutput = readOptionValue(args, ++index, arg)
      continue
    }

    if (arg === '--open') {
      options.open = true
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function readOptionValue(args, index, option) {
  const value = args[index]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${option}`)
  }
  return value
}

function printHelp() {
  console.log(`Usage: pnpm compare [options]

Options:
  --results-dir <path>  Directory containing speed.json and memory.json
                        Default: dist/results
  --baseline <name>     Baseline implementation for ratios
                        Default: tanstack
  --output <path>       File to write structured comparison JSON
                        Default: <results-dir>/compare.json
  --html-output <path>  File to write a standalone chart report
                        Default: <results-dir>/compare.html
  --open                Serve and open the chart report with Vite
  -h, --help            Show this help message`)
}

function readResultFile(resultsDir, filename) {
  const filePath = join(resultsDir, filename)
  if (!existsSync(filePath)) {
    throw new Error(`Missing required benchmark result file: ${filePath}`)
  }

  try {
    return JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (error) {
    throw new Error(
      `Unable to parse ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

function validateResultMatrix(document, kind, baseline) {
  if (!document || typeof document !== 'object') {
    throw new Error(`${kind}.json must contain a JSON object`)
  }

  if (!Array.isArray(document.results)) {
    throw new Error(`${kind}.json must contain a results array`)
  }

  if (document.results.length === 0) {
    throw new Error(`${kind}.json results array is empty`)
  }

  const implementations = []
  const implementationSet = new Set()
  const groups = new Map()

  for (const row of document.results) {
    assertResultRow(row, kind)

    if (!implementationSet.has(row.implementation)) {
      implementations.push(row.implementation)
      implementationSet.add(row.implementation)
    }

    const key = variantKey(row)
    let group = groups.get(key)
    if (!group) {
      group = {
        scenario: row.scenario,
        size: row.size,
        sizeKind: row.sizeKind,
        rows: new Map(),
      }
      groups.set(key, group)
    }

    if (group.rows.has(row.implementation)) {
      throw new Error(
        `${kind}.json contains duplicate rows for ${row.implementation} ${formatVariant(row)}`,
      )
    }

    group.rows.set(row.implementation, row)
  }

  if (!implementationSet.has(baseline)) {
    throw new Error(
      `${kind}.json is missing baseline implementation "${baseline}"`,
    )
  }

  if (implementations.length < 2) {
    throw new Error(
      `${kind}.json must contain at least one implementation to compare against "${baseline}"`,
    )
  }

  for (const group of groups.values()) {
    for (const implementation of implementations) {
      if (!group.rows.has(implementation)) {
        throw new Error(
          `${kind}.json has an incomplete implementation matrix: missing ${implementation} for ${formatVariant(group)}`,
        )
      }
    }
  }

  return { groups: [...groups.values()], implementations }
}

function assertResultRow(row, kind) {
  if (!row || typeof row !== 'object') {
    throw new Error(`${kind}.json contains a non-object result row`)
  }

  for (const field of ['implementation', 'scenario', 'sizeKind']) {
    if (typeof row[field] !== 'string' || row[field].length === 0) {
      throw new Error(`${kind}.json result rows must include a string ${field}`)
    }
  }

  if (typeof row.size !== 'number' || !Number.isFinite(row.size)) {
    throw new Error(`${kind}.json result rows must include a numeric size`)
  }

  if (!row.summary || typeof row.summary !== 'object') {
    throw new Error(`${kind}.json result rows must include a summary object`)
  }
}

function createSpeedRows(matrix, baseline) {
  const rows = []

  for (const group of matrix.groups) {
    const baselineRow = group.rows.get(baseline)
    assertNumericSummary(baselineRow.summary, 'speed', baseline, group)

    for (const implementation of matrix.implementations) {
      if (implementation === baseline) continue

      const comparisonRow = group.rows.get(implementation)
      assertNumericSummary(
        comparisonRow.summary,
        'speed',
        implementation,
        group,
      )

      rows.push({
        scenario: group.scenario,
        sizeKind: group.sizeKind,
        size: group.size,
        baseline: {
          implementation: baseline,
          summary: baselineRow.summary,
        },
        comparison: {
          implementation,
          summary: comparisonRow.summary,
        },
        median: compareValues(
          baselineRow.summary.median,
          comparisonRow.summary.median,
        ),
        p95: compareValues(baselineRow.summary.p95, comparisonRow.summary.p95),
      })
    }
  }

  return rows
}

function createMemoryRows(matrix, baseline) {
  const rows = []

  for (const group of matrix.groups) {
    const baselineRow = group.rows.get(baseline)
    assertMemorySummary(baselineRow.summary, baseline, group)

    for (const implementation of matrix.implementations) {
      if (implementation === baseline) continue

      const comparisonRow = group.rows.get(implementation)
      assertMemorySummary(comparisonRow.summary, implementation, group)

      for (const phase of memoryPhases) {
        rows.push({
          scenario: group.scenario,
          sizeKind: group.sizeKind,
          size: group.size,
          phase,
          baseline: {
            implementation: baseline,
            summary: baselineRow.summary[phase],
          },
          comparison: {
            implementation,
            summary: comparisonRow.summary[phase],
          },
          median: compareValues(
            baselineRow.summary[phase].median,
            comparisonRow.summary[phase].median,
          ),
        })
      }
    }
  }

  return rows
}

function assertNumericSummary(summary, kind, implementation, variant) {
  for (const field of ['median', 'p95']) {
    if (
      typeof summary[field] !== 'number' ||
      !Number.isFinite(summary[field])
    ) {
      throw new Error(
        `${kind}.json summary for ${implementation} ${formatVariant(variant)} must include numeric ${field}`,
      )
    }
  }
}

function assertMemorySummary(summary, implementation, variant) {
  for (const phase of memoryPhases) {
    if (!summary[phase] || typeof summary[phase] !== 'object') {
      throw new Error(
        `memory.json summary for ${implementation} ${formatVariant(variant)} is missing ${phase}`,
      )
    }

    if (
      typeof summary[phase].median !== 'number' ||
      !Number.isFinite(summary[phase].median)
    ) {
      throw new Error(
        `memory.json summary for ${implementation} ${formatVariant(variant)} must include numeric ${phase}.median`,
      )
    }
  }
}

function compareValues(baseline, comparison) {
  const delta = comparison - baseline
  const ratio = baseline === 0 ? null : comparison / baseline

  return {
    baseline,
    comparison,
    ratio,
    delta,
    deltaPercent: ratio === null ? null : (ratio - 1) * 100,
  }
}

function createHtmlReport(result) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>React Form Browser Benchmark Comparison</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7f9;
      --panel: #ffffff;
      --text: #19202a;
      --muted: #647084;
      --line: #d7dce5;
      --best: #16775f;
      --worse: #a33b32;
      --neutral: #345a99;
      --track: #edf1f5;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      line-height: 1.4;
    }

    header {
      border-bottom: 1px solid var(--line);
      background: var(--panel);
      padding: 28px 32px 24px;
    }

    main {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px 32px 48px;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1 {
      font-size: 28px;
      font-weight: 720;
    }

    h2 {
      font-size: 20px;
      margin: 0;
    }

    h3 {
      font-size: 16px;
      margin: 0;
    }

    h4 {
      font-size: 12px;
      letter-spacing: 0.02em;
      margin: 0 0 10px;
      text-transform: uppercase;
    }

    .lede {
      color: var(--muted);
      margin-top: 8px;
      max-width: 860px;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 18px;
    }

    .pill {
      background: #eef2f7;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: #334155;
      font-size: 13px;
      padding: 5px 10px;
    }

    .grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }

    .report-section {
      margin-top: 32px;
    }

    .section-head {
      margin-bottom: 12px;
    }

    .section-head p {
      color: var(--muted);
      font-size: 13px;
      margin-top: 4px;
    }

    .scenario-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    }

    .scenario-panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
    }

    .panel-head {
      align-items: end;
      border-bottom: 1px solid var(--line);
      display: grid;
      gap: 12px;
      grid-template-columns: minmax(0, 1fr) auto;
      padding: 14px 16px;
    }

    .panel-head p {
      color: var(--muted);
      font-size: 13px;
      margin-top: 3px;
    }

    .size-control {
      display: grid;
      gap: 5px;
      min-width: 158px;
    }

    .size-control span {
      color: var(--muted);
      font-size: 12px;
    }

    .size-control select {
      appearance: none;
      background:
        linear-gradient(45deg, transparent 50%, #5b6778 50%) right 12px center / 6px 6px no-repeat,
        linear-gradient(135deg, #5b6778 50%, transparent 50%) right 8px center / 6px 6px no-repeat,
        #ffffff;
      border: 1px solid var(--line);
      border-radius: 6px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
      line-height: 1.2;
      padding: 7px 28px 7px 10px;
    }

    .chart-variant {
      padding: 14px 16px 16px;
    }

    .variant-label {
      color: var(--muted);
      font-size: 12px;
      margin: 0 0 10px;
    }

    .bar-list {
      display: grid;
      gap: 8px;
    }

    .bar-row {
      align-items: center;
      display: grid;
      gap: 10px;
      grid-template-columns: minmax(116px, 0.85fr) minmax(180px, 1.8fr) minmax(88px, auto);
      min-height: 38px;
    }

    .bar-name strong {
      display: block;
      font-size: 13px;
      font-weight: 680;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .bar-name span {
      color: var(--muted);
      display: block;
      font-size: 12px;
      margin-top: 1px;
    }

    .bar-track {
      background: var(--track);
      border: 1px solid var(--line);
      border-radius: 999px;
      height: 20px;
      overflow: hidden;
    }

    .bar-fill {
      background: var(--even);
      border-radius: 999px;
      display: block;
      height: 100%;
      width: var(--bar-width);
    }

    .bar-row.best .bar-fill {
      background: var(--best);
    }

    .bar-row.worse .bar-fill {
      background: var(--worse);
    }

    .bar-row.neutral .bar-fill {
      background: var(--neutral);
    }

    .bar-value {
      text-align: right;
      white-space: nowrap;
    }

    .bar-value strong {
      display: block;
      font-size: 13px;
    }

    .bar-value span {
      color: var(--muted);
      display: block;
      font-size: 12px;
      margin-top: 1px;
    }

    .phase-group + .phase-group {
      border-top: 1px solid #edf0f4;
      margin-top: 14px;
      padding-top: 14px;
    }

    .empty {
      color: var(--muted);
      font-size: 12px;
    }

    .summary {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      margin-top: 20px;
    }

    .summary-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px 16px;
    }

    .summary-card strong {
      display: block;
      font-size: 24px;
      line-height: 1.1;
    }

    .summary-card span {
      color: var(--muted);
      display: block;
      font-size: 13px;
      margin-top: 4px;
    }

    .note {
      background: #eef4ff;
      border: 1px solid #cad8f3;
      border-radius: 8px;
      color: #263c68;
      font-size: 13px;
      margin-top: 16px;
      padding: 12px 14px;
    }

    @media (max-width: 820px) {
      header {
        padding: 22px 18px;
      }

      main {
        padding: 18px;
      }

      .bar-row {
        grid-template-columns: 1fr;
      }

      .bar-value {
        text-align: left;
      }

      .panel-head {
        grid-template-columns: 1fr;
      }

      .size-control {
        min-width: 0;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>React Form Browser Benchmark Comparison</h1>
    <p class="lede">Bars show absolute benchmark values for the selected count. Lower is better. If all implementations in a chart are within 2%, the bars are neutral blue; otherwise the best bar is green and the rest are red.</p>
    <div class="meta">
      <span class="pill">Generated: ${escapeHtml(result.generatedAt)}</span>
      <span class="pill">Results: ${escapeHtml(result.resultsDir)}</span>
    </div>
  </header>
  <main>
    <section class="summary" aria-label="Summary">
      <div class="summary-card"><strong>${result.speed.rows.length}</strong><span>speed comparison rows</span></div>
      <div class="summary-card"><strong>${result.memory.rows.length}</strong><span>memory phase rows</span></div>
      <div class="summary-card"><strong>${escapeHtml(
        getChartImplementations(result)
          .map(formatImplementationName)
          .join(', '),
      )}</strong><span>implementations</span></div>
    </section>
    <p class="note">Use the JSON output for exact automation. This chart report emphasizes the selected scenario and count for quick human inspection.</p>

    ${renderSpeedMetricSection({
      description: `Median ${escapeHtml(result.speed.unit)}. Lower is faster.`,
      idPrefix: 'speed-median',
      metric: 'median',
      rows: result.speed.rows,
      title: 'Speed Median',
      unit: result.speed.unit,
    })}

    ${renderSpeedMetricSection({
      description: `P95 ${escapeHtml(result.speed.unit)}. Lower is faster.`,
      idPrefix: 'speed-p95',
      metric: 'p95',
      rows: result.speed.rows,
      title: 'Speed P95',
      unit: result.speed.unit,
    })}

    ${renderMemoryMetricSection({
      description: `Median ${escapeHtml(result.memory.unit)} by lifecycle phase. Lower is smaller.`,
      idPrefix: 'memory-median',
      rows: result.memory.rows,
      title: 'Memory Median',
      unit: result.memory.unit,
    })}
  </main>
  <script>
    for (const select of document.querySelectorAll('[data-chart-select]')) {
      const panel = select.closest('[data-scenario-panel]')
      const sync = () => {
        for (const chart of panel.querySelectorAll('[data-chart-panel]')) {
          chart.hidden = chart.dataset.chartPanel !== select.value
        }
      }

      select.addEventListener('change', sync)
      sync()
    }
  </script>
</body>
</html>`
}

function renderSpeedMetricSection({
  description,
  idPrefix,
  metric,
  rows,
  title,
  unit,
}) {
  return `<section class="report-section">
  <div class="section-head">
    <h2>${escapeHtml(title)}</h2>
    <p>${description}</p>
  </div>
  <div class="scenario-grid">
    ${groupRows(rows, (row) => row.scenario)
      .map(([scenario, scenarioRows], index) =>
        renderScenarioPanel({
          id: `${idPrefix}-${index}-${toSlug(scenario)}`,
          title: scenario,
          description: 'Select a count to compare this scenario.',
          rows: scenarioRows,
          renderVariant: (variantRows) =>
            renderMetricBars({
              getMetric: (row) => row[metric],
              rows: variantRows,
              unit,
            }),
        }),
      )
      .join('\n')}
  </div>
</section>`
}

function renderMemoryMetricSection({
  description,
  idPrefix,
  rows,
  title,
  unit,
}) {
  return `<section class="report-section">
  <div class="section-head">
    <h2>${escapeHtml(title)}</h2>
    <p>${description}</p>
  </div>
  <div class="scenario-grid">
    ${groupRows(rows, (row) => row.scenario)
      .map(([scenario, scenarioRows], index) =>
        renderScenarioPanel({
          id: `${idPrefix}-${index}-${toSlug(scenario)}`,
          title: scenario,
          description: 'Select a count to inspect all memory phases.',
          rows: scenarioRows,
          renderVariant: (variantRows) =>
            renderMemoryVariant({
              rows: variantRows,
              unit,
            }),
        }),
      )
      .join('\n')}
  </div>
</section>`
}

function renderScenarioPanel({ description, id, renderVariant, rows, title }) {
  const variants = groupSizeVariants(rows)
  const defaultVariantIndex = variants.findIndex(
    (variant) => variant.size === 500,
  )
  const selectedVariantIndex =
    defaultVariantIndex === -1 ? 0 : defaultVariantIndex

  return `<article class="scenario-panel" data-scenario-panel>
  <div class="panel-head">
    <div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </div>
    <label class="size-control">
      <span>Count</span>
      <select data-chart-select aria-label="${escapeHtml(title)} count">
        ${variants
          .map(
            (variant, index) =>
              `<option value="${escapeHtml(`${id}-${index}`)}"${
                index === selectedVariantIndex ? ' selected' : ''
              }>${escapeHtml(variant.label)}</option>`,
          )
          .join('\n')}
      </select>
    </label>
  </div>
  ${variants
    .map(
      (variant, index) => `<section
    class="chart-variant"
    data-chart-panel="${escapeHtml(`${id}-${index}`)}"
    ${index === selectedVariantIndex ? '' : 'hidden'}
  >
    <p class="variant-label">${escapeHtml(variant.label)}</p>
    ${renderVariant(variant.rows)}
  </section>`,
    )
    .join('\n')}
</article>`
}

function renderMemoryVariant({ rows, unit }) {
  return memoryPhases
    .map((phase) => {
      const phaseRows = rows.filter((row) => row.phase === phase)
      if (phaseRows.length === 0) return ''

      return `<div class="phase-group">
  <h4>${escapeHtml(phase)}</h4>
  ${renderMetricBars({
    getMetric: (row) => row.median,
    rows: phaseRows,
    unit,
  })}
</div>`
    })
    .join('\n')
}

function renderMetricBars({ getMetric, rows, unit }) {
  if (rows.length === 0) {
    return '<p class="empty">No rows for this selection.</p>'
  }

  const bars = createMetricBars(rows, getMetric)
  const values = bars.map((bar) => bar.value)
  const scaleMax = Math.max(...values)
  const bestValue = Math.min(...values)
  const tones = getBarTones(values, bestValue)

  return `<div class="bar-list">
  ${bars
    .map((bar, index) =>
      renderBarRow({
        detail: getBarDetail({
          bestValue,
          tone: tones[index],
          value: bar.value,
        }),
        implementation: bar.implementation,
        scaleMax,
        tone: tones[index],
        value: bar.value,
        unit,
      }),
    )
    .join('\n')}
</div>`
}

function createMetricBars(rows, getMetric) {
  const baselineMetric = getMetric(rows[0])
  return [
    {
      implementation: rows[0].baseline.implementation,
      value: baselineMetric.baseline,
    },
    ...rows.map((row) => ({
      implementation: row.comparison.implementation,
      value: getMetric(row).comparison,
    })),
  ]
}

function renderBarRow({ detail, implementation, scaleMax, tone, value, unit }) {
  const width = getBarWidth(value, scaleMax)
  return `<div class="bar-row ${tone}">
  <div class="bar-name">
    <strong>${escapeHtml(formatImplementationName(implementation))}</strong>
    <span>${escapeHtml(detail)}</span>
  </div>
  <div class="bar-track" aria-hidden="true">
    <span class="bar-fill" style="--bar-width: ${width}%;"></span>
  </div>
  <div class="bar-value">
    <strong>${escapeHtml(formatMetricValue(value, unit))}</strong>
  </div>
</div>`
}

function groupSizeVariants(rows) {
  return groupRows(rows, formatSize)
    .map(([label, variantRows]) => ({
      label,
      rows: variantRows,
      size: variantRows[0].size,
      sizeKind: variantRows[0].sizeKind,
    }))
    .sort((a, b) => {
      const sizeKindOrder = a.sizeKind.localeCompare(b.sizeKind)
      return sizeKindOrder || a.size - b.size
    })
}

function groupRows(rows, getKey) {
  const groups = new Map()

  for (const row of rows) {
    const key = getKey(row)
    const group = groups.get(key)
    if (group) {
      group.push(row)
    } else {
      groups.set(key, [row])
    }
  }

  return [...groups.entries()]
}

function getBarTones(values, bestValue) {
  const worstValue = Math.max(...values)
  if (areValuesClose(bestValue, worstValue)) {
    return values.map(() => 'neutral')
  }

  return values.map((value) => (value === bestValue ? 'best' : 'worse'))
}

function areValuesClose(bestValue, worstValue) {
  if (bestValue === 0) return worstValue === 0
  return (worstValue - bestValue) / bestValue <= 0.02
}

function getBarDetail({ bestValue, tone, value }) {
  if (tone === 'neutral') return 'within 2%'
  if (tone === 'best') return 'best'
  if (bestValue === 0) return 'above best'
  return `${formatPercent((value / bestValue - 1) * 100)} vs best`
}

function getBarWidth(value, scaleMax) {
  if (value <= 0 || scaleMax <= 0) return 0
  return Math.min(100, Math.max(2, (value / scaleMax) * 100))
}

function formatMetricValue(value, unit) {
  if (unit === 'milliseconds') return `${formatNumber(value)} ms`
  if (unit === 'bytes') return `${formatBytes(value)} bytes`
  return `${formatNumber(value)} ${unit}`
}

function formatImplementationName(implementation) {
  if (implementation === 'tanstack') return 'TanStack Form'
  if (implementation === 'react-hook-form') return 'React Hook Form'
  return implementation
}

function toSlug(value) {
  return (
    String(value)
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-')
      .replaceAll(/^-|-$/g, '') || 'chart'
  )
}

function getChartImplementations(result) {
  return [
    ...new Set([result.baseline, ...getComparisonImplementations(result)]),
  ]
}

function getComparisonImplementations(result) {
  return [
    ...new Set([
      ...result.speed.rows.map((row) => row.comparison.implementation),
      ...result.memory.rows.map((row) => row.comparison.implementation),
    ]),
  ]
}

async function serveReport(filePath) {
  const reportPath = `/${basename(filePath)}`
  const server = await createServer({
    appType: 'mpa',
    configFile: false,
    root: dirname(filePath),
    server: {
      host: '127.0.0.1',
      open: reportPath,
      port: 4175,
      strictPort: false,
      watch: null,
    },
  })

  await server.listen()
  server.printUrls()
  console.log(`Serving chart report at ${reportPath}`)
  console.log('Press Ctrl+C to stop the report server.')
}

function variantKey(row) {
  return `${row.scenario}|${row.sizeKind}|${row.size}`
}

function formatVariant(row) {
  return `${row.scenario} ${row.sizeKind}=${row.size}`
}

function formatSize(row) {
  return `${row.sizeKind}=${row.size}`
}

function formatNumber(value) {
  return value.toFixed(2)
}

function formatBytes(value) {
  return Math.round(value).toLocaleString('en-US')
}

function formatPercent(value) {
  if (value === null) return 'n/a'
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
