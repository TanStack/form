import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { createFieldsController } from '../src/bridge/fields'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type { FieldDebugReport } from '../src/eventClientTypes'

const schemaValidator = {
  triggers: ['change'] as const,
  run: {
    '~standard': {
      version: 1,
      vendor: 'field-debug-bridge-test',
      validate: () => ({ value: undefined }),
    },
  },
}

const emptyTriggerValidator = {
  triggers: [] as [],
  run: () => null,
}

describe('general field debug report bridge', () => {
  it('returns a correlated report built from the live field subtree', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({
      defaultValues: { parent: { child: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'parent' })
    const child = form._getOrCreateFieldApi({
      name: 'parent.child',
      validators: [schemaValidator] as never,
    })
    const unregisterParent = parent._register()
    const reports: Array<FieldDebugReport> = []
    const cleanupReports = formDevtoolsEventClient.on(
      'field-debug-report',
      (event) => reports.push(event.payload),
    )

    child._setMeta((meta) => ({
      ...meta,
      _fieldValidatorErrors: [[{ message: 'Child error' }]],
    }))

    try {
      mountedForms.mountForm(form)
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      const fieldId = fields
        .getFieldRowsSnapshot(form)
        .find(({ path }) => path === 'parent')!.fieldId

      formDevtoolsEventClient.emit('field-debug-report-request', {
        requestId: 'request-parent',
        formInstanceId,
        fieldId,
      })

      expect(reports).toEqual([
        {
          requestId: 'request-parent',
          suspicions: [
            {
              kind: 'schema-errors-on-unmounted-descendants',
              evidence: {
                fieldPath: 'parent',
                unmountedDescendantPaths: ['parent.child'],
              },
            },
          ],
        },
      ])

      parent._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[{ message: 'Parent error' }]],
      }))
      formDevtoolsEventClient.emit('field-debug-report-request', {
        requestId: 'parent-now-has-errors',
        formInstanceId,
        fieldId,
      })
      expect(reports.at(-1)).toEqual({
        requestId: 'parent-now-has-errors',
        suspicions: [],
      })
    } finally {
      cleanupReports()
      unregisterParent()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('reports empty-trigger validators from the live validation route', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [emptyTriggerValidator],
    })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [emptyTriggerValidator] as never,
    })
    const unregister = field._register()
    const reports: Array<FieldDebugReport> = []
    const cleanupReports = formDevtoolsEventClient.on(
      'field-debug-report',
      (event) => reports.push(event.payload),
    )

    try {
      mountedForms.mountForm(form)
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      const fieldId = fields.getFieldRowsSnapshot(form)[0]!.fieldId

      formDevtoolsEventClient.emit('field-debug-report-request', {
        requestId: 'request-empty-triggers',
        formInstanceId,
        fieldId,
      })

      expect(reports).toEqual([
        {
          requestId: 'request-empty-triggers',
          suspicions: [
            {
              kind: 'validators-without-triggers',
              evidence: {
                fieldPath: 'name',
                validators: [
                  { scope: 'field', validatorIndex: 0 },
                  { scope: 'form', validatorIndex: 0 },
                ],
              },
            },
          ],
        },
      ])
    } finally {
      cleanupReports()
      unregister()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('returns empty reports for invalid targets and stops after disposal', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    form._getOrCreateFieldApi({ name: 'name' })
    const reports: Array<FieldDebugReport> = []
    const cleanupReports = formDevtoolsEventClient.on(
      'field-debug-report',
      (event) => reports.push(event.payload),
    )

    mountedForms.mountForm(form)
    const formInstanceId = mountedForms.getMountedFormsSnapshot()[0]!.instanceId
    const fieldId = fields.getFieldRowsSnapshot(form)[0]!.fieldId

    formDevtoolsEventClient.emit('field-debug-report-request', {
      requestId: 'unknown-field',
      formInstanceId,
      fieldId: 'unknown',
    })
    formDevtoolsEventClient.emit('field-debug-report-request', {
      requestId: 'unknown-form',
      formInstanceId: 'unknown',
      fieldId,
    })

    expect(reports).toEqual([
      { requestId: 'unknown-field', suspicions: [] },
      { requestId: 'unknown-form', suspicions: [] },
    ])

    fields.dispose()
    formDevtoolsEventClient.emit('field-debug-report-request', {
      requestId: 'after-dispose',
      formInstanceId,
      fieldId,
    })
    expect(reports).toHaveLength(2)

    cleanupReports()
    mountedForms.dispose()
    disconnectEventBus()
  })
})
