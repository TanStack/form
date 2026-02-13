/**
 * Benchmark: Measures how FormApi + FieldApi perform under load
 *
 * Scenarios:
 * 1. Many fields, single field change: Create N fields, change one field, measure recomputations
 * 2. Many fields, sequential field changes: Create N fields, change each sequentially
 * 3. Subscription count: How many subscribers fire when a single field changes
 */

import { FormApi } from './src/FormApi'
import { FieldApi } from './src/FieldApi'

const FIELD_COUNTS = [10, 50, 100, 500]
const ITERATIONS = 100

interface BenchResult {
  scenario: string
  fieldCount: number
  totalMs: number
  avgMs: number
  subscriberCallCount: number
}

function createFormWithFields(fieldCount: number) {
  const defaultValues: Record<string, string> = {}
  for (let i = 0; i < fieldCount; i++) {
    defaultValues[`field_${i}`] = `value_${i}`
  }

  const form = new FormApi({
    defaultValues,
  })

  const fields: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>[] = []

  for (let i = 0; i < fieldCount; i++) {
    const field = new FieldApi({
      form,
      name: `field_${i}`,
    } as any)
    field.mount()
    fields.push(field)
  }

  return { form, fields }
}

// Scenario 1: Single field change with N fields registered
function benchSingleFieldChange(fieldCount: number): BenchResult {
  const { form, fields } = createFormWithFields(fieldCount)

  let subscriberCallCount = 0
  // Subscribe to all fields to mimic real UI
  const unsubs = fields.map((field) =>
    field.store.subscribe(() => {
      subscriberCallCount++
    }),
  )

  // Warmup
  for (let i = 0; i < 5; i++) {
    fields[0]!.setValue(`warmup_${i}`)
  }
  subscriberCallCount = 0

  const start = performance.now()
  for (let i = 0; i < ITERATIONS; i++) {
    fields[0]!.setValue(`new_value_${i}`)
  }
  const totalMs = performance.now() - start

  unsubs.forEach((u) => u.unsubscribe())

  return {
    scenario: 'single_field_change',
    fieldCount,
    totalMs,
    avgMs: totalMs / ITERATIONS,
    subscriberCallCount,
  }
}

// Scenario 2: Change each field once sequentially
function benchSequentialFieldChanges(fieldCount: number): BenchResult {
  const { form, fields } = createFormWithFields(fieldCount)

  let subscriberCallCount = 0
  const unsubs = fields.map((field) =>
    field.store.subscribe(() => {
      subscriberCallCount++
    }),
  )

  // Warmup
  fields[0]!.setValue('warmup')
  subscriberCallCount = 0

  const start = performance.now()
  for (let i = 0; i < fieldCount; i++) {
    fields[i]!.setValue(`updated_${i}`)
  }
  const totalMs = performance.now() - start

  unsubs.forEach((u) => u.unsubscribe())

  return {
    scenario: 'sequential_field_changes',
    fieldCount,
    totalMs,
    avgMs: totalMs / fieldCount,
    subscriberCallCount,
  }
}

// Scenario 3: Measure store recomputations per single change
function benchStoreRecomputations(fieldCount: number): BenchResult {
  const { form, fields } = createFormWithFields(fieldCount)

  let subscriberCallCount = 0
  const unsubs = fields.map((field) =>
    field.store.subscribe(() => {
      subscriberCallCount++
    }),
  )

  // Single field change - measure how many subscribers fire
  subscriberCallCount = 0
  fields[0]!.setValue('trigger_change')

  const fireCount = subscriberCallCount

  unsubs.forEach((u) => u.unsubscribe())

  return {
    scenario: 'store_recomputations_per_change',
    fieldCount,
    totalMs: 0,
    avgMs: 0,
    subscriberCallCount: fireCount,
  }
}

// Scenario 4: Form store subscription count per field change
function benchFormStoreSubscriptions(fieldCount: number): BenchResult {
  const { form, fields } = createFormWithFields(fieldCount)

  let formStoreCallCount = 0
  const formUnsub = form.store.subscribe(() => {
    formStoreCallCount++
  })

  // Single field change
  formStoreCallCount = 0
  fields[0]!.setValue('trigger_change')

  formUnsub.unsubscribe()

  return {
    scenario: 'form_store_subs_per_change',
    fieldCount,
    totalMs: 0,
    avgMs: 0,
    subscriberCallCount: formStoreCallCount,
  }
}

// Run all benchmarks
console.log('=== TanStack Form Performance Benchmark ===\n')

const results: BenchResult[] = []

for (const count of FIELD_COUNTS) {
  console.log(`--- ${count} fields ---`)

  const r1 = benchSingleFieldChange(count)
  console.log(
    `  Single field change (${ITERATIONS}x): ${r1.totalMs.toFixed(2)}ms total, ${r1.avgMs.toFixed(3)}ms avg, ${r1.subscriberCallCount} subscriber calls`,
  )
  results.push(r1)

  const r2 = benchSequentialFieldChanges(count)
  console.log(
    `  Sequential changes: ${r2.totalMs.toFixed(2)}ms total, ${r2.avgMs.toFixed(3)}ms avg per field, ${r2.subscriberCallCount} subscriber calls`,
  )
  results.push(r2)

  const r3 = benchStoreRecomputations(count)
  console.log(
    `  Subscriber fires per single change: ${r3.subscriberCallCount} (of ${count} fields)`,
  )
  results.push(r3)

  const r4 = benchFormStoreSubscriptions(count)
  console.log(
    `  Form store fires per field change: ${r4.subscriberCallCount}`,
  )
  results.push(r4)

  console.log()
}

// Summary table
console.log('\n=== Summary: Subscriber calls per single field change ===')
console.log('Fields | Subscribers Fired | Expected (ideal)')
for (const count of FIELD_COUNTS) {
  const r = results.find(
    (r) =>
      r.scenario === 'store_recomputations_per_change' &&
      r.fieldCount === count,
  )
  // Ideal: only 1 subscriber should fire (the changed field)
  console.log(`${count.toString().padStart(6)} | ${r!.subscriberCallCount.toString().padStart(17)} | 1`)
}

console.log('\n=== Summary: Time for single field change (ms avg) ===')
console.log('Fields | Avg time (ms)')
for (const count of FIELD_COUNTS) {
  const r = results.find(
    (r) =>
      r.scenario === 'single_field_change' && r.fieldCount === count,
  )
  console.log(`${count.toString().padStart(6)} | ${r!.avgMs.toFixed(3)}`)
}
