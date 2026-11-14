import { createAtom } from '@tanstack/store'
import { InternalRootFieldApi } from '../FieldApi/RootFieldApi.lib'
import { startFormMountValidation } from '../pipeline/validation/ownerValidation.lib'
import { OnSubmitErrorSource } from '../validation/errorStorage.lib'
import {
  compareFormStateSnapshots,
  getFormStateSnapshot,
} from './formState.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type { FormAtoms, FormMetaAtoms, InternalFormApi } from './FormApi.lib'
import type { InitialFormMeta } from './initialFormState.lib'
import type { ValidationRunTracker } from '../pipeline/runTracker.lib'

function createInitialFormMetaAtoms(meta: InitialFormMeta): FormMetaAtoms {
  return {
    isDirty: createAtom(meta.isDirty),
    touchedFieldCount: createAtom(meta.touchedFieldCount),
    errorFields: createAtom(new Set<AnyInternalFieldApi>()),
    fieldValidationCount: createAtom(meta.fieldValidationCount),
    validationCount: createAtom(meta.validationCount),
    isSubmitting: createAtom(meta.isSubmitting),
    isSubmitSuccessful: createAtom(meta.isSubmitSuccessful),
    submissionAttempts: createAtom(meta.submissionAttempts),
  }
}

export function initializeForm<TFormData>(
  form: InternalFormApi<TFormData>,
  tracker: ValidationRunTracker,
) {
  const mountValidation = startFormMountValidation({
    defaultValues: form.defaultValues,
    serverState: form._lastServerState,
    validators: form._validatorInstances,
    tracker,
  })

  try {
    const initialState = mountValidation.initialState
    const atoms: FormAtoms<TFormData> = {
      values: createAtom(initialState.values),
      meta: createInitialFormMetaAtoms(initialState.meta),
      resetVersion: createAtom(initialState.resetVersion),
      defaultValuesVersion: createAtom(initialState.defaultValuesVersion),
    }
    const fieldRootNode = new InternalRootFieldApi(form)
    const onSubmitSource = new OnSubmitErrorSource()
    // The constructor assigns these objects before the state atom is read.
    const atom = createAtom(() => getFormStateSnapshot(form), {
      compare: compareFormStateSnapshots,
    })

    return {
      atoms,
      atom,
      fieldRootNode,
      onSubmitSource,
      complete: () => mountValidation.complete(form),
    }
  } catch (error) {
    mountValidation.cancel()
    throw error
  }
}
