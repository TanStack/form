import { batch } from '@tanstack/store'
import {
  clearIndexedErrorsFromSource,
  hasIndexedErrorFromSource,
  hasIndexedErrors,
} from '../validation.lib'
import type { FormState } from './FormApi.public'
import type { InternalFormApi } from './FormApi.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type {
  FormErrors,
  FormValidators,
  ToFormErrorTypes,
  ValidationIssue,
} from '../validation.public'
import type { Atom } from '@tanstack/store'

export interface FormErrorMeta {
  /**
   * @private
   * Dense 2-dimensional array of form-level errors where index corresponds to validatorIndex.
   * Each validator index contains an array of errors (normalized).
   */
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
}

type FormValidatorFieldErrorScope =
  | { type: 'all' }
  | { type: 'field'; field: AnyInternalFieldApi }
  | { type: 'none' }

interface ClearFormValidatorErrorsFromSourceArgs {
  formErrors: Atom<FormErrorMeta>
  fieldErrors: Atom<Array<Set<AnyInternalFieldApi>>>
  errorFields: Atom<Set<AnyInternalFieldApi>>
  indexes: Array<number>
  sourceEvent: string
  fieldScope: FormValidatorFieldErrorScope
  clearFieldEventErrors: (
    field: AnyInternalFieldApi,
    indexes: Array<number>,
    sourceEvent: string,
  ) => void
  reconcileErrorFields?: boolean
}

type OverridableFormState = Omit<FormState<any, any>, 'values' | 'errors'>

export type FormStateOverrides = {
  [TKey in keyof OverridableFormState]?: () => OverridableFormState[TKey]
}

const formErrorsCache = new WeakMap<FormErrorMeta, Array<ValidationIssue>>()
const formStateDefaultValuesVersionKey = Symbol(
  'tanstack-form-default-values-version',
)

const formStateKeys = [
  'values',
  'isTouched',
  'isDirty',
  'isPristine',
  'isDefaultValue',
  'errors',
  'isValid',
  'isInvalid',
  'canSubmit',
  'isSubmitting',
  'isSubmitSuccessful',
  'isValidating',
  'submissionAttempts',
] as const

const eagerFormStateKeys = [
  'values',
  'isTouched',
  'isDirty',
  'isPristine',
  'errors',
  'isValid',
  'isInvalid',
  'canSubmit',
  'isSubmitting',
  'isSubmitSuccessful',
  'isValidating',
  'submissionAttempts',
] as const

function getFormErrors(
  form: InternalFormApi<any, any, any>,
): Array<ValidationIssue> {
  const baseFormErrors = form._atoms.meta.formErrors.get()
  let formErrors = formErrorsCache.get(baseFormErrors)
  if (!formErrors) {
    formErrors = baseFormErrors.errors.flat()
    formErrorsCache.set(baseFormErrors, formErrors)
  }
  return formErrors
}

function hasFormValidatorFieldEventErrors(
  field: AnyInternalFieldApi,
  indexes: Array<number>,
  sourceEvent: string,
): boolean {
  for (const index of indexes) {
    if (hasFormValidatorFieldEventError(field, index, sourceEvent)) {
      return true
    }
  }

  return false
}

function hasFormValidatorFieldEventError(
  field: AnyInternalFieldApi,
  index: number,
  sourceEvent: string,
): boolean {
  const { _formValidatorErrors, _formValidatorErrorSourceEvents } =
    field._getBaseMeta()

  return hasIndexedErrorFromSource(
    _formValidatorErrors,
    _formValidatorErrorSourceEvents,
    index,
    sourceEvent,
  )
}

function hasFieldErrors(field: AnyInternalFieldApi): boolean {
  const meta = field._getBaseMeta()

  if (hasIndexedErrors(meta._fieldValidatorErrors)) return true
  if (hasIndexedErrors(meta._formValidatorErrors)) return true
  if (meta.childContributionCounts.error > 0) return true

  if (meta._formGroupValidatorErrors !== null) {
    if (hasIndexedErrors(meta._formGroupValidatorErrors.errors)) {
      return true
    }
  }

  return false
}

export function reconcileFormErrorFields(
  errorFields: Set<AnyInternalFieldApi>,
  fields: Iterable<AnyInternalFieldApi>,
): Set<AnyInternalFieldApi> {
  const nextErrorFields = new Set(errorFields)

  for (const field of fields) {
    if (hasFieldErrors(field)) {
      nextErrorFields.add(field)
    } else {
      nextErrorFields.delete(field)
    }
  }

  return nextErrorFields
}

export function clearFormValidatorErrorsFromSource({
  formErrors,
  fieldErrors,
  errorFields,
  indexes,
  sourceEvent,
  fieldScope,
  clearFieldEventErrors,
  reconcileErrorFields = false,
}: ClearFormValidatorErrorsFromSourceArgs): void {
  const affectedFields = new Set<AnyInternalFieldApi>()

  batch(() => {
    formErrors.set((prev) => {
      const clearedErrors = clearIndexedErrorsFromSource(
        prev.errors,
        prev.errorSourceEvents,
        indexes,
        sourceEvent,
      )
      if (!clearedErrors) return prev

      return {
        ...prev,
        errors: clearedErrors.errors,
        errorSourceEvents: clearedErrors.errorSourceEvents,
      }
    })

    if (fieldScope.type === 'all') {
      fieldErrors.set((prev) => {
        let nextFieldErrors: Array<Set<AnyInternalFieldApi>> | null = null

        for (const validatorIndex of indexes) {
          const fieldRefs = prev[validatorIndex]
          if (!fieldRefs || fieldRefs.size === 0) continue

          let nextFieldRefs: Set<AnyInternalFieldApi> | null = null
          for (const field of fieldRefs) {
            if (
              hasFormValidatorFieldEventError(
                field,
                validatorIndex,
                sourceEvent,
              )
            ) {
              nextFieldRefs ??= new Set(fieldRefs)
              nextFieldRefs.delete(field)
              affectedFields.add(field)
            }
          }

          if (nextFieldRefs) {
            nextFieldErrors ??= [...prev]
            nextFieldErrors[validatorIndex] = nextFieldRefs
          }
        }

        return nextFieldErrors ?? prev
      })
    } else if (fieldScope.type === 'field') {
      const { field } = fieldScope

      fieldErrors.set((prev) => {
        let nextFieldErrors: Array<Set<AnyInternalFieldApi>> | null = null

        for (const validatorIndex of indexes) {
          const fieldRefs = prev[validatorIndex]
          if (
            !fieldRefs?.has(field) ||
            !hasFormValidatorFieldEventError(field, validatorIndex, sourceEvent)
          ) {
            continue
          }

          const nextFieldRefs = new Set(fieldRefs)
          nextFieldRefs.delete(field)
          nextFieldErrors ??= [...prev]
          nextFieldErrors[validatorIndex] = nextFieldRefs
        }

        return nextFieldErrors ?? prev
      })

      if (hasFormValidatorFieldEventErrors(field, indexes, sourceEvent)) {
        affectedFields.add(field)
      }
    }

    for (const field of affectedFields) {
      clearFieldEventErrors(field, indexes, sourceEvent)
    }

    if (reconcileErrorFields && affectedFields.size > 0) {
      errorFields.set((prev) => reconcileFormErrorFields(prev, affectedFields))
    }
  })
}

function getFormStateValue<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TKey extends keyof FormState<
    TFormData,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>
  >,
>(
  form: InternalFormApi<TFormData, TFormValidators, TSubmitReturn>,
  key: TKey,
  overrides: FormStateOverrides = {},
): FormState<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>
>[TKey] {
  switch (key) {
    case 'values':
      return form._atoms.values.get() as never
    case 'isTouched':
      return (overrides.isTouched?.() ??
        form._atoms.meta.touchedFieldCount.get() > 0) as never
    case 'isDirty':
      return (overrides.isDirty?.() ?? form._atoms.meta.isDirty.get()) as never
    case 'isPristine':
      return (overrides.isPristine?.() ??
        !form._atoms.meta.isDirty.get()) as never
    case 'isDefaultValue':
      return (overrides.isDefaultValue?.() ??
        form._getIsDefaultValue()) as never
    case 'errors':
      return getFormErrors(form) as FormErrors<
        ToFormErrorTypes<TFormValidators, TSubmitReturn>
      > as never
    case 'isValid':
      return (overrides.isValid?.() ??
        (getFormErrors(form).length === 0 &&
          form._atoms.meta.errorFields.get().size === 0)) as never
    case 'isInvalid':
      return (overrides.isInvalid?.() ??
        (getFormErrors(form).length > 0 ||
          form._atoms.meta.errorFields.get().size > 0)) as never
    case 'canSubmit':
      return (overrides.canSubmit?.() ??
        (!form._atoms.meta.isSubmitting.get() &&
          getFormErrors(form).length === 0 &&
          form._atoms.meta.errorFields.get().size === 0)) as never
    case 'isSubmitting':
      return (overrides.isSubmitting?.() ??
        form._atoms.meta.isSubmitting.get()) as never
    case 'isSubmitSuccessful':
      return (overrides.isSubmitSuccessful?.() ??
        form._atoms.meta.isSubmitSuccessful.get()) as never
    case 'isValidating':
      return (overrides.isValidating?.() ??
        (form._atoms.meta.validationCount.get() > 0 ||
          form._atoms.meta.fieldValidationCount.get() > 0)) as never
    case 'submissionAttempts':
      return (overrides.submissionAttempts?.() ??
        form._atoms.meta.submissionAttempts.get()) as never
  }
}

export function getFormStateSnapshot<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  form: InternalFormApi<TFormData, TFormValidators, TSubmitReturn>,
  overrides: FormStateOverrides = {},
): FormState<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>> {
  const result = {} as FormState<
    TFormData,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>
  >
  for (const key of formStateKeys) {
    if (key === 'isDefaultValue') {
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        get: () => getFormStateValue(form, key, overrides),
      })
    } else {
      result[key] = getFormStateValue(form, key, overrides) as never
    }
  }
  Object.defineProperty(result, formStateDefaultValuesVersionKey, {
    value: form._atoms.defaultValuesVersion.get(),
  })
  return result
}

export function compareFormStateSnapshots(
  prev: FormState<any, any>,
  next: FormState<any, any>,
): boolean {
  if (
    (prev as any)[formStateDefaultValuesVersionKey] !==
    (next as any)[formStateDefaultValuesVersionKey]
  ) {
    return false
  }

  for (const key of eagerFormStateKeys) {
    if (!Object.is(prev[key], next[key])) return false
  }

  return true
}

export function createFormStateProxy(
  form: InternalFormApi<any, any, any>,
  overrides: FormStateOverrides = {},
): FormState<any, any> {
  return new Proxy({} as FormState<any, any>, {
    get(_target, property) {
      if (formStateKeys.includes(property as keyof FormState<any, any>)) {
        return getFormStateValue(
          form,
          property as keyof FormState<any, any>,
          overrides,
        )
      }
      return undefined
    },
    ownKeys: () => formStateKeys,
    getOwnPropertyDescriptor(_target, property) {
      if (formStateKeys.includes(property as keyof FormState<any, any>)) {
        return { configurable: true, enumerable: true }
      }
      return undefined
    },
  })
}
