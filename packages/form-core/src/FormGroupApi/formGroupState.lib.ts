import { createAtom, shallow } from '@tanstack/store'
import {
  deriveFromBaseFieldMeta,
  hasFieldMetaErrors,
} from '../FieldApi/fieldState.lib'
import { getBy } from '../utils.lib'
import type {
  AnyInternalFormGroupApi,
  InternalFormGroupApi,
} from './FormGroupApi.lib'
import type { FormGroupState } from './FormGroupApi.public'
import type {
  DerivedMetaMarkers,
  InternalFieldMeta,
} from '../FieldApi/fieldState.lib'
import type { FormStateOverrides } from '../FormApi/formState.lib'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { FormGroupValidators } from '../pipeline/validation/validation.public'
import type { ValidationErrorStoreState } from '../validation/errorStorage.lib'
import type { ValidationIssue } from '../validation/results/results.public'
import type {
  ScopedErrorTypes,
  ToFormGroupErrorTypes,
} from '../validation/state.public'

export function createFormGroupStateAtom<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormError extends ScopedErrorTypes,
  TSubmitReturn,
>(
  group: InternalFormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError,
    TSubmitReturn
  >,
) {
  const groupMetaMarkers: DerivedMetaMarkers = {
    source: undefined,
    canDisplayErrors: undefined,
  }

  let cachedErrorMap: ValidationErrorStoreState | undefined
  let cachedGroupErrors: Array<ValidationIssue> = []
  return createAtom<
    FormGroupState<
      TGroupValue,
      ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn>
    >
  >(
    (prev) => {
      void group._groupFieldVersion.get()

      const groupField = group._groupField
      const groupBaseMeta = groupField._getBaseMeta()
      const groupValue = group.value
      const previousGroupMeta = prev?.meta as InternalFieldMeta | undefined
      const groupMeta = deriveFromBaseFieldMeta(
        groupBaseMeta,
        previousGroupMeta,
        groupField,
        groupValue,
        groupMetaMarkers,
      )
      const errorMap = groupField._errorStore.atom.get()
      if (cachedErrorMap !== errorMap) {
        cachedErrorMap = errorMap
        cachedGroupErrors =
          group._validatorInstances?.flatMap(
            (source) => errorMap?.get(source) ?? [],
          ) ?? []
        cachedGroupErrors.push(...(errorMap?.get(group._onSubmitSource) ?? []))
      }
      const groupErrors = cachedGroupErrors as Array<
        ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn>['selfError']
      >
      const isInvalid = hasFieldMetaErrors(
        groupBaseMeta,
        groupField._errorStore.hasErrors,
      )
      const isTouched = groupMeta.isTouched
      const isDirty = groupMeta.isDirty

      return {
        values: groupValue,
        meta: groupMeta,
        errors: groupErrors,
        isTouched,
        isDirty,
        isPristine: !isDirty,
        isValid: !isInvalid,
        isInvalid,
        canSubmit: !group._isSubmitting.get() && !isInvalid,
        isSubmitting: group._isSubmitting.get(),
        isSubmitSuccessful: group._isSubmitSuccessful.get(),
        isValidating: groupMeta.isValidating,
        submissionAttempts: group._submissionAttempts.get(),
      }
    },
    { compare: shallow },
  )
}

export function getFormGroupStateOverrides(
  group: AnyInternalFormGroupApi,
): FormStateOverrides {
  return {
    isTouched: () => {
      const meta = group._groupField._getBaseMeta()
      return meta.isTouched || meta.childMetaCounts.touched > 0
    },
    isDirty: () => {
      const meta = group._groupField._getBaseMeta()
      return meta.isDirty || meta.childMetaCounts.dirty > 0
    },
    isPristine: () => {
      const meta = group._groupField._getBaseMeta()
      return !meta.isDirty && meta.childMetaCounts.dirty === 0
    },
    isDefaultValue: () => {
      const value = getBy(group.form._atoms.values.get(), group.name)
      return group._groupField._getIsDefaultValue(value)
    },
    isValid: () => {
      return !hasFieldMetaErrors(
        group._groupField._getBaseMeta(),
        group._groupField._errorStore.hasErrors,
      )
    },
    isInvalid: () => {
      return hasFieldMetaErrors(
        group._groupField._getBaseMeta(),
        group._groupField._errorStore.hasErrors,
      )
    },
    canSubmit: () => {
      return (
        !group._isSubmitting.get() &&
        !hasFieldMetaErrors(
          group._groupField._getBaseMeta(),
          group._groupField._errorStore.hasErrors,
        )
      )
    },
    isSubmitting: () => group._isSubmitting.get(),
    isSubmitSuccessful: () => group._isSubmitSuccessful.get(),
    isValidating: () => {
      const meta = group._groupField._getBaseMeta()
      return meta.isValidating || meta.childMetaCounts.validating > 0
    },
    submissionAttempts: () => group._submissionAttempts.get(),
  }
}
