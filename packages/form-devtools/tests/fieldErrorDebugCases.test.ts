import {
  InternalFormApi,
  InternalFormGroupApi,
} from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { getFieldErrorDebugSuspicions } from '../src/bridge/fields/debug'
import type { FieldErrorDebugCase } from '../src/bridge/fields/debug'
import type { DevtoolsFieldError } from '../src/eventClientTypes'

const schemaError = {
  error: { message: 'Schema error' },
  source: {
    scope: 'form',
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

const serverError = {
  error: { message: 'Server error' },
  source: {
    scope: 'form',
    validatorIndex: 0,
    validatorType: 'callback',
  },
  sourceEvent: 'server',
} satisfies DevtoolsFieldError

describe('field error debug cases', () => {
  it('recognizes errors hidden by the field error visibility policy', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      errorVisibility: () => false,
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()

    try {
      field._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[{ message: 'Hidden error' }]],
      }))

      expect(field.state.meta.errors).toEqual([])
      expect(field.state.meta.original.errors).toHaveLength(1)
      expect(
        getFieldErrorDebugSuspicions({ field, error: callbackError }),
      ).toEqual([
        {
          kind: 'errors-hidden',
          evidence: { fieldPath: 'name' },
        },
      ])
    } finally {
      unregister()
    }
  })

  it('rejects visible errors and fields without errors for the hidden-errors check', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()

    try {
      expect(
        getFieldErrorDebugSuspicions({ field, error: callbackError }),
      ).toEqual([])

      field._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[{ message: 'Visible error' }]],
      }))

      expect(field.state.meta.errors).toHaveLength(1)
      expect(
        getFieldErrorDebugSuspicions({ field, error: callbackError }),
      ).toEqual([])
    } finally {
      unregister()
    }
  })

  it('recognizes server errors on unmounted fields', () => {
    const form = new InternalFormApi({
      defaultValues: { firstName: '' },
      validators: [
        {
          triggers: ['server'],
          run: () => undefined,
        },
      ],
    })
    const field = form._getOrCreateFieldApi({ name: 'firstName' })

    for (const validatorType of ['callback', 'schema'] as const) {
      const error = {
        ...serverError,
        source: { ...serverError.source, validatorType },
      }

      expect(getFieldErrorDebugSuspicions({ field, error })).toEqual([
        {
          kind: 'server-error-on-unmounted-field',
          evidence: { fieldPath: 'firstName' },
        },
      ])
    }
  })

  it('requires an unmounted field, a server source event, and the matching server validator', () => {
    const serverForm = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['server'],
          run: () => undefined,
        },
      ],
    })
    const serverField = serverForm._getOrCreateFieldApi({ name: 'name' })
    const unregister = serverField._register()
    const changeError = { ...serverError, sourceEvent: 'change' }

    const changeForm = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change'],
          run: () => undefined,
        },
      ],
    })
    const changeField = changeForm._getOrCreateFieldApi({ name: 'name' })

    try {
      expect(
        getFieldErrorDebugSuspicions({
          field: serverField,
          error: serverError,
        }),
      ).toEqual([])
      unregister()
      expect(
        getFieldErrorDebugSuspicions({
          field: serverField,
          error: changeError,
        }),
      ).toEqual([])
      expect(
        getFieldErrorDebugSuspicions({
          field: changeField,
          error: serverError,
        }),
      ).toEqual([])
    } finally {
      if (serverField._isMounted) unregister()
    }
  })

  it('uses the live trie to find the nearest mounted ancestor', () => {
    const form = new InternalFormApi({
      defaultValues: { grandparent: { parent: { child: '' } } },
    })
    const grandparent = form._getOrCreateFieldApi({ name: 'grandparent' })
    form._getOrCreateFieldApi({ name: 'grandparent.parent' })
    const child = form._getOrCreateFieldApi({
      name: 'grandparent.parent.child',
    })
    const unregisterGrandparent = grandparent._register()

    try {
      expect(
        getFieldErrorDebugSuspicions({ field: child, error: schemaError }),
      ).toEqual([
        {
          kind: 'schema-error-on-unmounted-field',
          evidence: {
            fieldPath: 'grandparent.parent.child',
            mountedAncestorPath: 'grandparent',
          },
        },
      ])
      expect(
        getFieldErrorDebugSuspicions({ field: child, error: callbackError }),
      ).toEqual([])
    } finally {
      unregisterGrandparent()
    }
  })

  it('walks through an unmounted FormGroup backing field', () => {
    const form = new InternalFormApi({
      defaultValues: { stayDates: { dateRange: { to: '' } } },
    })
    const group = new InternalFormGroupApi({ form, name: 'stayDates' })
    const dateRange = form._getOrCreateFieldApi({
      name: 'stayDates.dateRange',
    })
    const child = form._getOrCreateFieldApi({
      name: 'stayDates.dateRange.to',
    })
    const unregisterDateRange = dateRange._register()

    try {
      expect(
        getFieldErrorDebugSuspicions({ field: child, error: schemaError }),
      ).toEqual([
        {
          kind: 'schema-error-on-unmounted-field',
          evidence: {
            fieldPath: 'stayDates.dateRange.to',
            mountedAncestorPath: 'stayDates.dateRange',
          },
        },
      ])
    } finally {
      unregisterDateRange()
      group._cleanup()
    }
  })

  it('rejects mounted fields and fields without a mounted ancestor', () => {
    const form = new InternalFormApi({
      defaultValues: { parent: { child: '' }, standalone: '' },
    })
    const parent = form._getOrCreateFieldApi({ name: 'parent' })
    const child = form._getOrCreateFieldApi({ name: 'parent.child' })
    const standalone = form._getOrCreateFieldApi({ name: 'standalone' })
    const unregisterChild = child._register()

    try {
      expect(
        getFieldErrorDebugSuspicions({ field: child, error: schemaError }),
      ).toEqual([])
      expect(
        getFieldErrorDebugSuspicions({
          field: standalone,
          error: schemaError,
        }),
      ).toEqual([])
      expect(parent._isMounted).toBe(false)
    } finally {
      unregisterChild()
    }
  })

  it('preserves evaluator registry order', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const cases: Array<FieldErrorDebugCase> = ['first', 'second'].map(
      (fieldPath) => ({
        evaluate: () => ({
          kind: 'schema-error-on-unmounted-field',
          evidence: { fieldPath, mountedAncestorPath: 'ancestor' },
        }),
      }),
    )

    expect(
      getFieldErrorDebugSuspicions({ field, error: schemaError }, cases).map(
        ({ evidence }) => evidence.fieldPath,
      ),
    ).toEqual(['first', 'second'])
  })
})
