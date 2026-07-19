import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { createFieldsController } from '../src/bridge/fields'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type {
  DevtoolsFieldError,
  FieldErrorDebugReport,
} from '../src/eventClientTypes'

const schemaError = {
  error: { message: 'Schema error' },
  source: {
    scope: 'form',
    validatorIndex: 0,
    validatorType: 'schema',
  },
  sourceEvent: 'change',
} satisfies DevtoolsFieldError

describe('field debug report bridge', () => {
  it('returns a correlated report built from the live field trie', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({
      defaultValues: { parent: { child: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'parent' })
    form._getOrCreateFieldApi({ name: 'parent.child' })
    const unregisterParent = parent._register()
    const reports: Array<FieldErrorDebugReport> = []
    const cleanupReports = formDevtoolsEventClient.on(
      'field-error-debug-report',
      (event) => reports.push(event.payload),
    )

    try {
      mountedForms.mountForm(form)
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      const fieldId = fields
        .getFieldRowsSnapshot(form)
        .find(({ path }) => path === 'parent.child')!.fieldId

      formDevtoolsEventClient.emit('field-error-debug-report-request', {
        requestId: 'request-child',
        formInstanceId,
        fieldId,
        error: schemaError,
      })

      expect(reports).toEqual([
        {
          requestId: 'request-child',
          suspicions: [
            {
              kind: 'schema-error-on-unmounted-field',
              evidence: {
                fieldPath: 'parent.child',
                mountedAncestorPath: 'parent',
              },
            },
          ],
        },
      ])
    } finally {
      cleanupReports()
      unregisterParent()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('returns empty reports for invalid targets and keeps requests isolated', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const firstForm = new InternalFormApi({ defaultValues: { first: '' } })
    const secondForm = new InternalFormApi({ defaultValues: { second: '' } })
    const firstField = firstForm._getOrCreateFieldApi({ name: 'first' })
    const secondField = secondForm._getOrCreateFieldApi({ name: 'second' })
    const reports: Array<FieldErrorDebugReport> = []
    const cleanupReports = formDevtoolsEventClient.on(
      'field-error-debug-report',
      (event) => reports.push(event.payload),
    )

    try {
      mountedForms.mountForm(firstForm)
      mountedForms.mountForm(secondForm)
      const mounted = mountedForms.getMountedFormsSnapshot()
      const firstFormId = mounted[0]!.instanceId
      const secondFieldId = fields.getFieldRowsSnapshot(secondForm)[0]!.fieldId
      const firstFieldId = fields.getFieldRowsSnapshot(firstForm)[0]!.fieldId

      formDevtoolsEventClient.emit('field-error-debug-report-request', {
        requestId: 'wrong-form',
        formInstanceId: firstFormId,
        fieldId: secondFieldId,
        error: schemaError,
      })
      formDevtoolsEventClient.emit('field-error-debug-report-request', {
        requestId: 'unknown-field',
        formInstanceId: firstFormId,
        fieldId: 'unknown',
        error: schemaError,
      })
      formDevtoolsEventClient.emit('field-error-debug-report-request', {
        requestId: 'unknown-form',
        formInstanceId: 'unknown',
        fieldId: firstFieldId,
        error: schemaError,
      })

      expect(reports).toEqual([
        { requestId: 'wrong-form', suspicions: [] },
        { requestId: 'unknown-field', suspicions: [] },
        { requestId: 'unknown-form', suspicions: [] },
      ])

      firstField._isKilled = true
      formDevtoolsEventClient.emit('field-error-debug-report-request', {
        requestId: 'killed-field',
        formInstanceId: firstFormId,
        fieldId: firstFieldId,
        error: schemaError,
      })
      expect(reports.at(-1)).toEqual({
        requestId: 'killed-field',
        suspicions: [],
      })
      firstField._isKilled = false
      expect(secondField._isKilled).toBe(false)
    } finally {
      cleanupReports()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('stops responding after disposal', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const reports: Array<FieldErrorDebugReport> = []
    const cleanupReports = formDevtoolsEventClient.on(
      'field-error-debug-report',
      (event) => reports.push(event.payload),
    )

    fields.dispose()
    formDevtoolsEventClient.emit('field-error-debug-report-request', {
      requestId: 'after-dispose',
      formInstanceId: 'form',
      fieldId: 'field',
      error: schemaError,
    })

    expect(reports).toEqual([])
    cleanupReports()
    mountedForms.dispose()
    disconnectEventBus()
  })
})
