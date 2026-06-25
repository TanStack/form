import { uuid } from '@tanstack/form-core/internals'
import { emitFormEvent, onFormEvent } from './eventClient.lib'
import type {
  AnyInternalFormApi,
  FormDevtoolsBridge,
  FormDevtoolsCleanupReason,
} from '@tanstack/form-core/internals'

const formInstanceIds = new WeakMap<AnyInternalFormApi, string>()

export function getDevtoolsFormInstanceId(form: AnyInternalFormApi): string {
  const existing = formInstanceIds.get(form)
  if (existing) return existing

  const instanceId = uuid()
  formInstanceIds.set(form, instanceId)
  return instanceId
}

function emitDevtoolsFormRegistered(form: AnyInternalFormApi): void {
  emitFormEvent('form-registered', {
    id: form.formId,
    instanceId: getDevtoolsFormInstanceId(form),
  })
}

function emitDevtoolsFormUnregistered(form: AnyInternalFormApi): void {
  emitFormEvent('form-unregistered', {
    id: form.formId,
    instanceId: getDevtoolsFormInstanceId(form),
  })
}

function mountDevtoolsForm(form: AnyInternalFormApi) {
  const unsubscribeRegistry = onFormEvent('subscribe-form-registry', () => {
    emitDevtoolsFormRegistered(form)
  })

  emitDevtoolsFormRegistered(form)

  return (reason: FormDevtoolsCleanupReason) => {
    unsubscribeRegistry()

    if (reason === 'form-unmounted') {
      emitDevtoolsFormUnregistered(form)
      formInstanceIds.delete(form)
    }
  }
}

export function createFormDevtoolsBridge(): FormDevtoolsBridge {
  return {
    mountForm: mountDevtoolsForm,
  }
}
