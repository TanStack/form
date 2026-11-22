import { createAtom } from '@tanstack/store'
import { InternalRootFieldApi } from '../FieldApi/RootFieldApi.lib'
import { startFormMountValidation } from '../pipeline/validation/ownerValidation.lib'
import { createFormSubmissionHandler } from '../submissionHandler.lib'
import { OnSubmitErrorSource } from '../validation/errorStorage.lib'
import {
  compareFormStateSnapshots,
  getFormStateSnapshot,
} from './formState.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type { FormAtoms, FormMetaAtoms, InternalFormApi } from './FormApi.lib'
import type { InitialFormMeta } from './initialFormState.lib'
import type { ValidationRunTracker } from '../pipeline/runTracker.lib'
import type { SubmissionStateAtoms } from '../submissionHandler.lib'

function createInitialFormMetaAtoms(
  meta: InitialFormMeta,
  submission: SubmissionStateAtoms,
): FormMetaAtoms {
  return {
    isDirty: createAtom(meta.isDirty),
    touchedFieldCount: createAtom(meta.touchedFieldCount),
    errorFields: createAtom(new Set<AnyInternalFieldApi>()),
    fieldValidationCount: createAtom(meta.fieldValidationCount),
    validationCount: createAtom(meta.validationCount),
    ...submission,
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
    const submissionHandler = createFormSubmissionHandler(
      form,
      initialState.meta.submissionAttempts,
    )
    const atoms: FormAtoms<TFormData> = {
      values: createAtom(initialState.values),
      meta: createInitialFormMetaAtoms(
        initialState.meta,
        submissionHandler.atoms,
      ),
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
      submissionHandler,
      complete: () => mountValidation.complete(form),
    }
  } catch (error) {
    mountValidation.cancel()
    throw error
  }
}
