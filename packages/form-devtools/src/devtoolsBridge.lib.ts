import { installDevtoolsBridge, uuid } from '@tanstack/form-core/internals'
import { formDevtoolsEventClient } from './eventClient.lib'
import type {
  AnyInternalFormApi,
  FormDevtoolsBridge,
} from '@tanstack/form-core/internals'
import type { DevtoolsMountedForm } from './eventClientTypes'

const formInstanceIds = new WeakMap<AnyInternalFormApi, string>()
const mountedForms = new Set<AnyInternalFormApi>()
const mountedFormRefCounts = new WeakMap<AnyInternalFormApi, number>()
const mountedFormIds = new WeakMap<AnyInternalFormApi, string>()

export function getDevtoolsFormInstanceId(form: AnyInternalFormApi): string {
  const existing = formInstanceIds.get(form)
  if (existing) return existing

  const instanceId = uuid()
  formInstanceIds.set(form, instanceId)
  return instanceId
}

function getMountedFormsSnapshot(): Array<DevtoolsMountedForm> {
  return Array.from(mountedForms, (form) => ({
    label: form.formId,
    instanceId: getDevtoolsFormInstanceId(form),
  }))
}

function emitMountedFormsChanged(): void {
  formDevtoolsEventClient.emit('mounted-forms-changed', {
    forms: getMountedFormsSnapshot(),
  })
}

function mountDevtoolsForm(form: AnyInternalFormApi): void {
  const previousRefCount = mountedFormRefCounts.get(form) ?? 0
  mountedFormRefCounts.set(form, previousRefCount + 1)

  if (previousRefCount > 0) return

  mountedForms.add(form)
  mountedFormIds.set(form, form.formId)
  emitMountedFormsChanged()
}

function unmountDevtoolsForm(form: AnyInternalFormApi): void {
  const previousRefCount = mountedFormRefCounts.get(form)
  if (previousRefCount === undefined) return

  const nextRefCount = previousRefCount - 1

  if (nextRefCount > 0) {
    mountedFormRefCounts.set(form, nextRefCount)
    return
  }

  mountedFormRefCounts.delete(form)
  mountedForms.delete(form)
  mountedFormIds.delete(form)
  formInstanceIds.delete(form)
  emitMountedFormsChanged()
}

function updateDevtoolsForm(form: AnyInternalFormApi): void {
  if (!mountedForms.has(form)) return
  if (mountedFormIds.get(form) === form.formId) return

  mountedFormIds.set(form, form.formId)
  emitMountedFormsChanged()
}

export function createFormDevtoolsBridge(): FormDevtoolsBridge {
  return {
    mountForm: mountDevtoolsForm,
    unmountForm: unmountDevtoolsForm,
    updateForm: updateDevtoolsForm,
  }
}

formDevtoolsEventClient.on('request-mounted-forms', () => {
  emitMountedFormsChanged()
})

installDevtoolsBridge(createFormDevtoolsBridge())
