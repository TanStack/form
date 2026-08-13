import { batch } from '@tanstack/store'
import {
  clearValidationSourceErrorsFromEvent,
  getValidationSourceErrors,
} from '../validation'
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
import type { AnyInternalValidationSourceInstance } from '../ValidationSourceInstance.lib'
import type { ValidationSourceErrorMap } from '../validation'

export interface FormErrorMeta {
  validationSourceErrors: ValidationSourceErrorMap | null
}

type FormValidatorFieldErrorScope =
  | { type: 'all' }
  | { type: 'field'; field: AnyInternalFieldApi }
  | { type: 'none' }

interface ClearFormValidationSourceErrorsFromEventArgs {
  formErrors: Atom<FormErrorMeta>
  errorFields: Atom<Set<AnyInternalFieldApi>>
  validationSources: ReadonlyArray<AnyInternalValidationSourceInstance>
  sourceEvent: string
  fieldScope: FormValidatorFieldErrorScope
  clearFieldEventErrors: (
    field: AnyInternalFieldApi,
    validationSources: ReadonlyArray<AnyInternalValidationSourceInstance>,
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
    formErrors = getValidationSourceErrors(
      baseFormErrors.validationSourceErrors,
    )
    formErrorsCache.set(baseFormErrors, formErrors)
  }
  return formErrors
}

function hasFormValidationSourceFieldEventError(
  field: AnyInternalFieldApi,
  validationSource: AnyInternalValidationSourceInstance,
  sourceEvent: string,
): boolean {
  return (
    field._getBaseMeta()._validationSourceErrors?.get(validationSource)
      ?.sourceEvent === sourceEvent
  )
}

function hasFieldErrors(field: AnyInternalFieldApi): boolean {
  const meta = field._getBaseMeta()

  if (meta._validationSourceErrors) return true
  if (meta.childContributionCounts.error > 0) return true

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

export function clearFormValidationSourceErrorsFromEvent({
  formErrors,
  errorFields,
  validationSources,
  sourceEvent,
  fieldScope,
  clearFieldEventErrors,
  reconcileErrorFields = false,
}: ClearFormValidationSourceErrorsFromEventArgs): void {
  const affectedFields = new Set<AnyInternalFieldApi>()

  batch(() => {
    formErrors.set((prev) => {
      const clearedErrors = clearValidationSourceErrorsFromEvent(
        prev.validationSourceErrors,
        validationSources,
        sourceEvent,
      )
      if (!clearedErrors) return prev

      return {
        ...prev,
        validationSourceErrors: clearedErrors.errorMap,
      }
    })

    const instancesByField = new Map<
      AnyInternalFieldApi,
      Array<AnyInternalValidationSourceInstance>
    >()

    if (fieldScope.type === 'all') {
      for (const validationSource of validationSources) {
        for (const field of validationSource.errorTargets ?? []) {
          if (
            !hasFormValidationSourceFieldEventError(
              field,
              validationSource,
              sourceEvent,
            )
          ) {
            continue
          }

          const fieldInstances = instancesByField.get(field) ?? []
          fieldInstances.push(validationSource)
          instancesByField.set(field, fieldInstances)
          affectedFields.add(field)
        }
      }
    } else if (fieldScope.type === 'field') {
      const { field } = fieldScope
      const fieldInstances = validationSources.filter(
        (validationSource) =>
          validationSource.errorTargets?.has(field) &&
          hasFormValidationSourceFieldEventError(
            field,
            validationSource,
            sourceEvent,
          ),
      )
      if (fieldInstances.length > 0) {
        instancesByField.set(field, fieldInstances)
        affectedFields.add(field)
      }
    }

    for (const [field, instances] of instancesByField) {
      clearFieldEventErrors(field, instances, sourceEvent)
      instances.forEach((validationSource) =>
        validationSource.deleteErrorTarget(field),
      )
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
