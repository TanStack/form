import { batch } from '@tanstack/store'
import { visitAllFormFields } from '../FieldApi/fieldTraversal.lib'
import { defaultInternalBaseFieldMeta } from '../FieldApi/fieldState.lib'
import { devtools } from '../devtoolsBridge.lib'
import type { AnyInternalFormApi, InternalFormApi } from './FormApi.lib'
import type { ServerFormState } from './formServerState.public'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'

function resetFieldMetaForServerState(form: AnyInternalFormApi) {
  visitAllFormFields(form._fieldRootNode, (field) => {
    field._resetValidation()
    field._defaultValueCache = null

    field._listenerInstances?.forEach((instance) => instance.resetRuntime())
    field._validatorInstances?.forEach((instance) => instance.resetRuntime())

    const metaAtom = field._atoms.meta
    if (metaAtom && metaAtom.get() !== defaultInternalBaseFieldMeta) {
      metaAtom.set(defaultInternalBaseFieldMeta)
      devtools().updateField?.(field)
    }
  })
}

// TODO We should lock down how server state can affect the form and when. Server state could be both
// present on construction as well as updates. However, if the component didn't unmount, then we still
// have perfectly reasonable state available to us, no? But validator results would still be newer on the server?
function resetToServerState<TFormData>(
  form: InternalFormApi<TFormData>,
  serverState: ServerFormState<TFormData>,
  defaultValues: TFormData,
): void {
  const values = serverState.values ?? defaultValues

  form._defaultValueCache = null

  batch(() => {
    form._resetSubmissions()
    form._cancelValidation()
    form._listenerInstances?.forEach((instance) => instance.resetRuntime())
    form._validatorInstances?.forEach((instance) => instance.resetRuntime())
    form._onSubmitSource.resetRuntime()
    resetFieldMetaForServerState(form)
    form._atoms.values.set(values)
    form._atoms.meta.isDirty.set(false)
    form._atoms.meta.touchedFieldCount.set(0)
    form._fieldRootNode._clearErrors()
    form._atoms.meta.errorFields.set(new Set<AnyInternalFieldApi>())
    form._atoms.meta.fieldValidationCount.set(0)
    form._atoms.meta.validationCount.set(0)
    form._atoms.meta.isSubmitting.set(false)
    form._atoms.meta.isSubmitSuccessful.set(false)
    form._atoms.meta.submissionAttempts.set(serverState.submissionAttempts)

    for (const result of serverState.validationResults) {
      form._applyValidationResult(
        result.validatorIndex,
        result.result,
        'server',
      )
    }
  })
}

export function applyServerState<TFormData>(
  form: InternalFormApi<TFormData>,
  serverState: ServerFormState<TFormData> | null,
  defaultValues: TFormData,
): void {
  if (serverState === form._lastServerState) return

  form._lastServerState = serverState

  if (!serverState) {
    form._clearFormValidationSource('server')
    return
  }

  resetToServerState(form, serverState, defaultValues)
}
