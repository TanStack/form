import { uuid } from '@tanstack/form-core/internals'
import { formDevtoolsEventClient } from '../../eventClient.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { DevtoolsMountedForm } from '../../eventClientTypes'
import type { FormId } from '../../types/branded'

export interface MountedFormsController {
  dispose: () => void
  getFormInstanceId: (form: AnyInternalFormApi) => FormId
  getMountedForm: (formInstanceId: FormId) => AnyInternalFormApi | undefined
  getMountedFormsSnapshot: () => Array<DevtoolsMountedForm>
  isMounted: (form: AnyInternalFormApi) => boolean
  mountForm: (form: AnyInternalFormApi) => boolean
  unmountForm: (
    form: AnyInternalFormApi,
    onFinalUnmount: (formInstanceId: FormId) => void,
  ) => boolean
  updateForm: (form: AnyInternalFormApi) => void
}

export function createMountedFormsController(): MountedFormsController {
  const formInstanceIds = new WeakMap<AnyInternalFormApi, FormId>()
  const mountedForms = new Set<AnyInternalFormApi>()
  const mountedFormRefCounts = new WeakMap<AnyInternalFormApi, number>()
  const mountedFormIds = new WeakMap<AnyInternalFormApi, string>()
  const mountedFormInstances = new Map<FormId, AnyInternalFormApi>()

  const getFormInstanceId = (form: AnyInternalFormApi): FormId => {
    const existing = formInstanceIds.get(form)
    if (existing) return existing

    const instanceId = uuid() as FormId
    formInstanceIds.set(form, instanceId)
    return instanceId
  }

  const getMountedFormsSnapshot = (): Array<DevtoolsMountedForm> =>
    Array.from(mountedForms, (form) => ({
      label: form.formId,
      instanceId: getFormInstanceId(form),
    }))

  const emitMountedFormsChanged = (): void => {
    formDevtoolsEventClient.emit('mounted-forms-changed', {
      forms: getMountedFormsSnapshot(),
    })
  }

  const mountForm = (form: AnyInternalFormApi): boolean => {
    const previousRefCount = mountedFormRefCounts.get(form) ?? 0
    mountedFormRefCounts.set(form, previousRefCount + 1)

    if (previousRefCount > 0) return false

    mountedForms.add(form)
    mountedFormInstances.set(getFormInstanceId(form), form)
    mountedFormIds.set(form, form.formId)
    emitMountedFormsChanged()
    return true
  }

  const unmountForm = (
    form: AnyInternalFormApi,
    onFinalUnmount: (formInstanceId: FormId) => void,
  ): boolean => {
    const previousRefCount = mountedFormRefCounts.get(form)
    if (previousRefCount === undefined) return false

    const nextRefCount = previousRefCount - 1

    if (nextRefCount > 0) {
      mountedFormRefCounts.set(form, nextRefCount)
      return false
    }

    const formInstanceId = formInstanceIds.get(form)

    mountedFormRefCounts.delete(form)
    mountedForms.delete(form)
    mountedFormIds.delete(form)
    formInstanceIds.delete(form)

    if (formInstanceId) {
      onFinalUnmount(formInstanceId)
      mountedFormInstances.delete(formInstanceId)
    }

    emitMountedFormsChanged()
    return true
  }

  const updateForm = (form: AnyInternalFormApi): void => {
    if (!mountedForms.has(form)) return
    if (mountedFormIds.get(form) === form.formId) return

    mountedFormIds.set(form, form.formId)
    emitMountedFormsChanged()
  }

  const cleanupRequestListener = formDevtoolsEventClient.on(
    'request-mounted-forms',
    emitMountedFormsChanged,
  )

  return {
    dispose: cleanupRequestListener,
    getFormInstanceId,
    getMountedForm: (formInstanceId) =>
      mountedFormInstances.get(formInstanceId),
    getMountedFormsSnapshot,
    isMounted: (form) => mountedForms.has(form),
    mountForm,
    unmountForm,
    updateForm,
  }
}
