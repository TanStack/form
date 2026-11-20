import { batch } from '@tanstack/store'
import { visitAllFormFields } from '../FieldApi/fieldTraversal.lib'
import {
  defaultInternalBaseFieldMeta,
  resetFieldMeta,
} from '../FieldApi/fieldState.lib'
import type { AnyInternalFormApi, InternalFormApi } from './FormApi.lib'
import type { ServerFormState } from './formServerState.public'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'

// TODO not pretty, but we're reworking how SSR hydration works anyways.
function resetFieldMetaForServerState(form: AnyInternalFormApi) {
  const fields: Array<AnyInternalFieldApi> = []
  visitAllFormFields(form._fieldRootNode, (field) => {
    fields.push(field)
  })

  for (let index = fields.length - 1; index >= 0; index--) {
    const field = fields[index]!
    field._resetValidation()
    field._defaultValueCache = null

    field._listenerInstances?.forEach((instance) => instance.resetRuntime())
    field._validatorInstances?.forEach((instance) => instance.resetRuntime())

    const metaAtom = field._atoms.meta
    if (metaAtom && metaAtom.get() !== defaultInternalBaseFieldMeta) {
      const groupSubmitAttempts =
        field._formGroup?._submissionAttempts.get() ?? 0

      field._setMeta((meta) => resetFieldMeta(meta, groupSubmitAttempts > 0))
    }
  }
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
    form._fieldRootNode._clearErrors()
    form._atoms.meta.errorFields.set(new Set<AnyInternalFieldApi>())
    form._atoms.meta.fieldValidationCount.set(0)
    form._atoms.meta.validationCount.set(0)
    form._submissionHandler.setSubmissionAttempts(
      serverState.submissionAttempts,
    )

    for (const result of serverState.validationResults) {
      form._applyValidationResult({
        sourceOrIndex: result.validatorIndex,
        result: result.result,
        sourceEvent: 'server',
      })
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
