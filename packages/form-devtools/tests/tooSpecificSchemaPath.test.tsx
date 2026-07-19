import { createRoot } from 'solid-js'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { tooSpecificSchemaPath } from '../src/components/fields/fieldDetails/fieldErrors/debugCases/tooSpecificSchemaPath'
import { createFormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { DevtoolsFieldError } from '../src/eventClientTypes'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { FieldId, FormId } from '../src/types/branded'

const formId = 'form-a' as FormId
const fieldId = 'field-child' as FieldId

const schemaError = {
  error: { message: 'Schema error' },
  source: {
    scope: 'formGroup',
    formGroupPath: 'grandparent',
    validatorIndex: 0,
    validatorType: 'schema',
  },
  sourceEvent: 'change',
} satisfies DevtoolsFieldError

const callbackError = {
  error: { message: 'Callback error' },
  source: {
    scope: 'field',
    validatorIndex: 0,
    validatorType: 'callback',
  },
  sourceEvent: 'change',
} satisfies DevtoolsFieldError

function getJsxText(value: unknown): string {
  if (Array.isArray(value)) return value.map(getJsxText).join('')
  if (value instanceof Node) return value.textContent ?? ''
  return value === null || value === undefined ? '' : String(value)
}

let store!: FormDevtoolsStore
let disposeStore!: () => void

beforeEach(() => {
  createRoot((dispose) => {
    store = createFormDevtoolsStore()
    disposeStore = dispose
  })
  store.fieldList.setSubscribedFormId(formId)
})

afterEach(() => {
  store.fieldList.setSubscribedFormId(null)
  store.fieldList.clearRows()
  disposeStore()
})

function evaluate(error: DevtoolsFieldError) {
  return createRoot((dispose) => {
    const result = tooSpecificSchemaPath.evaluate({ fieldId, error, store })
    dispose()
    return result
  })
}

describe('tooSpecificSchemaPath', () => {
  it('evaluates its error and uses the nearest mounted ancestor', () => {
    store.fieldList.applySnapshot({
      formInstanceId: formId,
      fields: [
        { fieldId: 'field-grandparent', path: 'grandparent' },
        {
          fieldId: 'field-parent',
          parentFieldId: 'field-grandparent',
          path: 'grandparent.parent',
          isMounted: false,
        },
        {
          fieldId,
          parentFieldId: 'field-parent',
          path: 'grandparent.parent.child',
          isMounted: false,
        },
      ],
    })

    const proposal = evaluate(schemaError)!
    expect(getJsxText(proposal.title)).toBe('Schema error in unmounted field')
    expect(getJsxText(proposal.commonCase)).toContain('dateRange')
    expect(getJsxText(proposal.commonCase)).toContain('dateRange.start')
    expect(proposal.fixes.map(getJsxText)).toEqual([
      expect.stringContaining('grandparent'),
      expect.stringContaining('grandparent.parent.child'),
    ])

    expect(evaluate(callbackError)).toBeUndefined()
  })

  it('accepts a mounted parent whose FormGroup parent row is omitted', () => {
    store.fieldList.applySnapshot({
      formInstanceId: formId,
      fields: [
        {
          fieldId: 'field-parent',
          parentFieldId: 'omitted-form-group-field',
          path: 'stayDates.dateRange',
        },
        {
          fieldId,
          parentFieldId: 'field-parent',
          path: 'stayDates.dateRange.to',
          isMounted: false,
        },
      ],
    })

    const proposal = evaluate(schemaError)!
    expect(proposal.fixes.map(getJsxText)).toEqual([
      expect.stringContaining('stayDates.dateRange'),
      expect.stringContaining('stayDates.dateRange.to'),
    ])
  })

  it('rejects mounted fields and incomplete or cyclic ancestor chains', () => {
    store.fieldList.applySnapshot({
      formInstanceId: formId,
      fields: [
        { fieldId: 'field-parent', path: 'parent' },
        { fieldId, parentFieldId: 'field-parent', path: 'parent.child' },
      ],
    })
    expect(evaluate(schemaError)).toBeUndefined()

    store.fieldList.applySnapshot({
      formInstanceId: formId,
      fields: [
        { fieldId: 'field-parent', path: 'parent', isMounted: false },
        {
          fieldId,
          parentFieldId: 'field-parent',
          path: 'parent.child',
          isMounted: false,
        },
      ],
    })
    expect(evaluate(schemaError)).toBeUndefined()

    store.fieldList.applySnapshot({
      formInstanceId: formId,
      fields: [
        {
          fieldId,
          parentFieldId: 'missing-parent',
          path: 'parent.child',
          isMounted: false,
        },
      ],
    })
    expect(evaluate(schemaError)).toBeUndefined()

    store.fieldList.applySnapshot({
      formInstanceId: formId,
      fields: [
        {
          fieldId: 'field-parent',
          parentFieldId: fieldId,
          path: 'parent',
          isMounted: false,
        },
        {
          fieldId,
          parentFieldId: 'field-parent',
          path: 'parent.child',
          isMounted: false,
        },
      ],
    })
    expect(evaluate(schemaError)).toBeUndefined()
  })
})
