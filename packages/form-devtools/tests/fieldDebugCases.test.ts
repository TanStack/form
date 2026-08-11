import {
  InternalFormApi,
  InternalFormGroupApi,
} from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getFieldDebugSuspicions } from '../src/bridge/fields/fieldDebug'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { FieldDebugCase } from '../src/bridge/fields/fieldDebug'

const callbackValidator = {
  triggers: ['change'] as const,
  run: () => null,
}

const emptyTriggerValidator = {
  triggers: [] as [],
  run: () => null,
}

const schemaValidator = {
  triggers: ['change'] as const,
  run: z.unknown(),
}

function setFieldError(field: AnyInternalFieldApi) {
  field._setMeta((meta) => ({
    ...meta,
    _fieldValidatorErrors: [[{ message: 'Invalid' }]],
  }))
}

describe('field debug cases', () => {
  it('reports empty-trigger field and form validators in pipeline order', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        emptyTriggerValidator,
        callbackValidator,
        emptyTriggerValidator,
      ] as never,
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        callbackValidator,
        emptyTriggerValidator,
        {
          ...emptyTriggerValidator,
          runOnMount: true,
          runOnSubmit: false,
        },
      ] as never,
    })
    const unregister = field._register()

    try {
      expect(getFieldDebugSuspicions({ field })).toEqual([
        {
          kind: 'validators-without-triggers',
          evidence: {
            fieldPath: 'name',
            validators: [
              { scope: 'field', validatorIndex: 1 },
              { scope: 'form', validatorIndex: 0 },
              { scope: 'form', validatorIndex: 2 },
            ],
          },
        },
      ])
    } finally {
      unregister()
    }
  })

  it('does not report mount-only validators as empty-trigger validators', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          ...emptyTriggerValidator,
          runOnMount: true,
          runOnSubmit: false,
        },
      ] as never,
    })
    const unregister = field._register()

    try {
      expect(getFieldDebugSuspicions({ field })).toEqual([])
    } finally {
      unregister()
    }
  })

  it('uses the containing form group instead of form validators', () => {
    const form = new InternalFormApi({
      defaultValues: { profile: { name: '' } },
      validators: [emptyTriggerValidator] as never,
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'profile',
      validators: [callbackValidator, emptyTriggerValidator] as never,
    })
    const field = form._getOrCreateFieldApi({
      name: 'profile.name',
      validators: [emptyTriggerValidator] as never,
    })
    const unregister = field._register()

    try {
      expect(getFieldDebugSuspicions({ field })).toEqual([
        {
          kind: 'validators-without-triggers',
          evidence: {
            fieldPath: 'profile.name',
            validators: [
              { scope: 'field', validatorIndex: 0 },
              {
                scope: 'formGroup',
                formGroupPath: 'profile',
                validatorIndex: 1,
              },
            ],
          },
        },
      ])
    } finally {
      unregister()
      group._cleanup()
    }
  })

  it('does not fall back to form validators when the group has none', () => {
    const form = new InternalFormApi({
      defaultValues: { profile: { contact: { email: '' } } },
      validators: [emptyTriggerValidator] as never,
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'profile.contact',
    })
    const field = form._getOrCreateFieldApi({
      name: 'profile.contact.email',
      validators: [callbackValidator] as never,
    })
    const unregister = field._register()

    try {
      expect(getFieldDebugSuspicions({ field })).toEqual([])
    } finally {
      unregister()
      group._cleanup()
    }
  })

  it('keeps aggregated schema errors ahead of the empty-trigger tip', () => {
    const form = new InternalFormApi({
      defaultValues: {
        parent: { first: '', nested: { second: '' }, callback: '' },
      },
    })
    const parent = form._getOrCreateFieldApi({
      name: 'parent',
      validators: [emptyTriggerValidator] as never,
    })
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
        {
          kind: 'validators-without-triggers',
          evidence: {
            fieldPath: 'parent',
            validators: [{ scope: 'field', validatorIndex: 0 }],
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
      validators: [schemaValidator, emptyTriggerValidator] as never,
    })
    const child = form._getOrCreateFieldApi({
      name: 'parent.child',
      validators: [schemaValidator] as never,
    })
    const other = form._getOrCreateFieldApi({
      name: 'other',
      validators: [emptyTriggerValidator] as never,
    })
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
        getFieldDebugSuspicions({ field }, cases).map(({ evidence }) =>
          'unmountedDescendantPaths' in evidence
            ? evidence.unmountedDescendantPaths[0]
            : undefined,
        ),
      ).toEqual(['first', 'second'])
    } finally {
      unregister()
    }
  })
})
