/**
 * Comprehensive benchmark: Measures full setValue + onChange validation performance
 */

import { FormApi } from './src/FormApi'
import { FieldApi } from './src/FieldApi'

const FIELD_COUNTS = [10, 50, 100, 500]
const ITERATIONS = 100

function createFormWithValidatedFields(fieldCount: number) {
  const defaultValues: Record<string, string> = {}
  for (let i = 0; i < fieldCount; i++) {
    defaultValues[`field_${i}`] = `value_${i}`
  }

  const form = new FormApi({ defaultValues })
  const fields: any[] = []

  for (let i = 0; i < fieldCount; i++) {
    const field = new FieldApi({
      form,
      name: `field_${i}`,
      validators: {
        onChange: ({ value }: any) => {
          if (!value) return 'Required'
          if (value.length < 3) return 'Too short'
          return undefined
        },
      },
    } as any)
    field.mount()
    fields.push(field)
  }

  return { form, fields }
}

function createFormNoValidation(fieldCount: number) {
  const defaultValues: Record<string, string> = {}
  for (let i = 0; i < fieldCount; i++) {
    defaultValues[`field_${i}`] = `value_${i}`
  }

  const form = new FormApi({ defaultValues })
  const fields: any[] = []

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

console.log('=== TanStack Form Performance Benchmark ===\n')
console.log('Fields | No Validation (ms/op) | With onChange (ms/op) | Sub calls/change')

for (const count of FIELD_COUNTS) {
  // No validation
  const { fields: nvFields } = createFormNoValidation(count)
  let nvSubs = 0
  const nvUnsubs = nvFields.map((f: any) => f.store.subscribe(() => { nvSubs++ }))
  nvSubs = 0
  const nvStart = performance.now()
  for (let i = 0; i < ITERATIONS; i++) {
    nvFields[0]!.setValue(`nv_${i}`)
  }
  const nvMs = (performance.now() - nvStart) / ITERATIONS
  nvUnsubs.forEach((u: any) => u.unsubscribe())

  // With onChange validation
  const { fields: vFields } = createFormWithValidatedFields(count)
  let vSubs = 0
  const vUnsubs = vFields.map((f: any) => f.store.subscribe(() => { vSubs++ }))

  // Count sub calls for one change
  vSubs = 0
  vFields[0]!.setValue('x')
  const subsPerChange = vSubs
  let other = 0
  const otherUnsubs = vFields.slice(1).map((f: any) => f.store.subscribe(() => { other++ }))
  other = 0
  vFields[0]!.setValue('y')
  otherUnsubs.forEach((u: any) => u.unsubscribe())

  // Timed run
  vSubs = 0
  const vStart = performance.now()
  for (let i = 0; i < ITERATIONS; i++) {
    vFields[0]!.setValue(`v_${i}`)
  }
  const vMs = (performance.now() - vStart) / ITERATIONS
  vUnsubs.forEach((u: any) => u.unsubscribe())

  console.log(`${count.toString().padStart(6)} | ${nvMs.toFixed(3).padStart(21)} | ${vMs.toFixed(3).padStart(20)} | ${subsPerChange} total, ${other} other-field`)
}

console.log('\n(BEFORE this refactor: 500 fields with onChange was ~0.615ms/op)')
console.log('(BEFORE validation opt: 500 fields with onChange was ~0.608ms/op, no-val was ~0.667ms/op)')
