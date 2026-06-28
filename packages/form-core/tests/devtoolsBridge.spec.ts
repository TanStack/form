import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../src/FormApi/FormApi.lib'
import { devtools } from '../src/devtoolsBridge.lib'
import type {
  FieldLifecycleReference,
  FieldStateChangeScope,
  FormDevtoolsBridge,
  FormDevtoolsCleanupReason,
} from '../src/devtoolsBridge.lib'
import type { AnyInternalFieldApi } from '../src/FieldApi/FieldApi.lib'
import type { AnyInternalFormApi } from '../src/FormApi/FormApi.lib'

function createRecordingBridge() {
  const mountedForms: Array<AnyInternalFormApi> = []
  const cleanups: Array<{
    form: AnyInternalFormApi
    reason: FormDevtoolsCleanupReason
  }> = []
  const mountedFields: Array<AnyInternalFieldApi> = []
  const unmountedFields: Array<{
    field: AnyInternalFieldApi
    path?: string
  }> = []
  const unmountedFieldGroups: Array<{
    form: AnyInternalFormApi
    fields: ReadonlyArray<FieldLifecycleReference>
  }> = []
  const summaryFields: Array<AnyInternalFieldApi> = []
  const detailFields: Array<AnyInternalFieldApi> = []
  const stateChanges: Array<{
    field: AnyInternalFieldApi
    scope: FieldStateChangeScope
  }> = []
  const pathChanges: Array<{
    form: AnyInternalFormApi
    changes: ReadonlyArray<FieldLifecycleReference>
  }> = []

  const bridge: FormDevtoolsBridge = {
    mountForm: (form) => {
      mountedForms.push(form)

      return (reason) => {
        cleanups.push({ form, reason })
      }
    },
    fieldMounted: (field) => {
      mountedFields.push(field)
    },
    fieldUnmounted: (field, path) => {
      unmountedFields.push({ field, path })
    },
    fieldSubtreeUnmounted: (form, fields) => {
      unmountedFieldGroups.push({ form, fields })
    },
    fieldPathsChanged: (form, changes) => {
      pathChanges.push({ form, changes })
    },
    fieldStateChanged: (field, scope) => {
      stateChanges.push({ field, scope })
      if (scope.summary) {
        summaryFields.push(field)
      }
      if (scope.detail) {
        detailFields.push(field)
      }
    },
  }

  return {
    bridge,
    cleanups,
    detailFields,
    mountedFields,
    mountedForms,
    pathChanges,
    summaryFields,
    stateChanges,
    unmountedFieldGroups,
    unmountedFields,
  }
}

describe('devtools bridge', () => {
  it('is a no-op when no bridge is installed', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unmountForm = form.mount()
    const unregisterField = field._register()

    devtools.onFieldStateChange(field, { summary: true })
    devtools.onFieldStateChange(field, { detail: true })

    unregisterField()
    unmountForm()
  })

  it('mounts already mounted forms when a bridge is installed', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const unmountForm = form.mount()
    const cleanupForm = vi.fn()
    const mountForm = vi.fn(() => cleanupForm)

    const uninstallBridge = devtools.installBridge({ mountForm })

    expect(mountForm).toHaveBeenCalledWith(form)

    uninstallBridge()

    expect(cleanupForm).toHaveBeenCalledWith('bridge-uninstalled')

    unmountForm()
  })

  it('cleans up a mounted form after its final unmount', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const cleanupForm = vi.fn()
    const mountForm = vi.fn(() => cleanupForm)
    const uninstallBridge = devtools.installBridge({ mountForm })

    const unmountFirstRef = form.mount()
    const unmountSecondRef = form.mount()

    expect(mountForm).toHaveBeenCalledOnce()

    unmountFirstRef()

    expect(cleanupForm).not.toHaveBeenCalled()

    unmountSecondRef()

    expect(cleanupForm).toHaveBeenCalledWith('form-unmounted')

    uninstallBridge()
  })

  it('forwards field lifecycle and path change events to the installed bridge', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [{ name: '' }] },
    })
    const recording = createRecordingBridge()
    const uninstall = devtools.installBridge(recording.bridge)
    const unmountForm = form.mount()
    const field = form._getOrCreateFieldApi({ name: 'items[0]' })
    const unregisterField = field._register()

    field._setMeta((prev) => ({
      ...prev,
      isDirty: true,
      isTouched: true,
    }))
    field._moveTo(1)
    form.deleteField('items[1]', { fieldApiOverride: field })

    expect(recording.mountedFields).toEqual([field])
    expect(recording.summaryFields).toContain(field)
    expect(recording.stateChanges).toContainEqual({
      field,
      scope: { summary: true },
    })
    expect(recording.pathChanges).toHaveLength(1)
    expect(recording.pathChanges[0]?.changes[0]).toMatchObject({
      previousPath: 'items[0]',
      field,
    })
    expect(recording.unmountedFieldGroups[0]?.fields).toEqual([
      {
        previousPath: 'items[1]',
        field,
      },
    ])

    unregisterField()
    unmountForm()
    uninstall()
  })

  it('forwards linked field dependency detail changes', () => {
    const form = new InternalFormApi({
      defaultValues: { source: '', other: '', target: '', users: ['first'] },
    })
    const recording = createRecordingBridge()
    const uninstall = devtools.installBridge(recording.bridge)
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })
    const otherField = form._getOrCreateFieldApi({ name: 'other' })
    const targetField = form._getOrCreateFieldApi({ name: 'target' })
    const unregisterSourceField = sourceField._register()

    recording.detailFields.length = 0

    targetField._update({
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: () => {} },
      ],
      validators: [
        { triggers: ['change'], watchFields: ['other'], run: () => null },
      ],
    })

    expect(recording.detailFields).toContain(sourceField)
    expect(recording.detailFields).toContain(otherField)
    expect(recording.detailFields).toContain(targetField)

    recording.detailFields.length = 0
    targetField._update({ listeners: [] })

    expect(recording.detailFields).toContain(sourceField)
    expect(recording.detailFields).toContain(targetField)

    const arraySourceField = form._getOrCreateFieldApi({ name: 'users[0]' })
    targetField._update({
      listeners: [
        { triggers: ['change'], watchFields: ['source'], run: () => {} },
      ],
      validators: [
        { triggers: ['change'], watchFields: ['users[0]'], run: () => null },
      ],
    })

    recording.detailFields.length = 0
    arraySourceField._moveTo(1)

    expect(recording.detailFields).toContain(arraySourceField)
    expect(recording.detailFields).toContain(targetField)

    recording.detailFields.length = 0
    targetField._kill()

    expect(recording.detailFields).toContain(sourceField)
    expect(recording.detailFields).toContain(arraySourceField)

    unregisterSourceField()
    uninstall()
  })
})
