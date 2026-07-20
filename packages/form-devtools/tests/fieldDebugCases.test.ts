import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { getFieldDebugSuspicions } from '../src/bridge/fields/fieldDebug'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { FieldDebugCase } from '../src/bridge/fields/fieldDebug'

const callbackValidator = {
  triggers: ['change'] as const,
  run: () => null,
}

const schemaValidator = {
  triggers: ['change'] as const,
  run: {
    '~standard': {
      version: 1,
      vendor: 'field-debug-test',
      validate: () => ({ value: undefined }),
    },
  },
}

function setFieldError(field: AnyInternalFieldApi) {
  field._setMeta((meta) => ({
    ...meta,
    _fieldValidatorErrors: [[{ message: 'Invalid' }]],
  }))
}

describe('field debug cases', () => {
  it('aggregates schema errors on unmounted descendants in trie order', () => {
    const form = new InternalFormApi({
      defaultValues: {
        parent: { first: '', nested: { second: '' }, callback: '' },
      },
    })
    const parent = form._getOrCreateFieldApi({ name: 'parent' })
    const first = form._getOrCreateFieldApi({
      name: 'parent.first',
      validators: [schemaValidator] as never,
    })
    form._getOrCreateFieldApi({ name: 'parent.nested' })
    const second = form._getOrCreateFieldApi({
      name: 'parent.nested.second',
      validators: [schemaValidator] as never,
    })
    const callback = form._getOrCreateFieldApi({
      name: 'parent.callback',
      validators: [callbackValidator] as never,
    })
    const unregisterParent = parent._register()

    setFieldError(first)
    setFieldError(second)
    setFieldError(callback)

    try {
      expect(getFieldDebugSuspicions({ field: parent })).toEqual([
        {
          kind: 'schema-errors-on-unmounted-descendants',
          evidence: {
            fieldPath: 'parent',
            unmountedDescendantPaths: ['parent.first', 'parent.nested.second'],
          },
        },
      ])
    } finally {
      unregisterParent()
    }
  })

  it('ignores mounted, killed, and callback-only descendants', () => {
    const form = new InternalFormApi({
      defaultValues: { parent: { mounted: '', killed: '', callback: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'parent' })
    const mounted = form._getOrCreateFieldApi({
      name: 'parent.mounted',
      validators: [schemaValidator] as never,
    })
    const killed = form._getOrCreateFieldApi({
      name: 'parent.killed',
      validators: [schemaValidator] as never,
    })
    const callback = form._getOrCreateFieldApi({
      name: 'parent.callback',
      validators: [callbackValidator] as never,
    })
    const unregisterParent = parent._register()
    const unregisterMounted = mounted._register()

    setFieldError(mounted)
    setFieldError(killed)
    setFieldError(callback)
    killed._isKilled = true

    try {
      expect(getFieldDebugSuspicions({ field: parent })).toEqual([])
    } finally {
      unregisterMounted()
      unregisterParent()
    }
  })

  it('rejects unmounted fields and fields with errors of their own', () => {
    const form = new InternalFormApi({
      defaultValues: { parent: { child: '' }, other: { child: '' } },
    })
    const parent = form._getOrCreateFieldApi({
      name: 'parent',
      validators: [schemaValidator] as never,
    })
    const child = form._getOrCreateFieldApi({
      name: 'parent.child',
      validators: [schemaValidator] as never,
    })
    const other = form._getOrCreateFieldApi({ name: 'other' })
    const otherChild = form._getOrCreateFieldApi({
      name: 'other.child',
      validators: [schemaValidator] as never,
    })
    const unregisterParent = parent._register()

    setFieldError(parent)
    setFieldError(child)
    setFieldError(otherChild)

    try {
      expect(getFieldDebugSuspicions({ field: parent })).toEqual([])
      expect(getFieldDebugSuspicions({ field: other })).toEqual([])
    } finally {
      unregisterParent()
    }
  })

  it('preserves evaluator registry order', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()
    const cases: Array<FieldDebugCase> = ['first', 'second'].map(
      (descendantPath) => ({
        evaluate: ({ field: target }) => ({
          kind: 'schema-errors-on-unmounted-descendants',
          evidence: {
            fieldPath: target.name,
            unmountedDescendantPaths: [descendantPath],
          },
        }),
      }),
    )

    try {
      expect(
        getFieldDebugSuspicions({ field }, cases).map(
          ({ evidence }) => evidence.unmountedDescendantPaths[0],
        ),
      ).toEqual(['first', 'second'])
    } finally {
      unregister()
    }
  })
})
