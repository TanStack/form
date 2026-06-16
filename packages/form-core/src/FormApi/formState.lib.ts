import type { FormState } from './FormApi.public'
import type { InternalFormApi } from './FormApi.lib'
import type {
  FormErrors,
  FormValidators,
  ToFormValidatorMetas,
  ToSubmitMeta,
  ValidationIssue,
} from '../validation.public'

export interface FormErrorMeta {
  /**
   * @private
   * Dense 2-dimensional array of form-level errors where index corresponds to validatorIndex.
   * Each validator index contains an array of errors (normalized).
   */
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
}

type OverridableFormState = Omit<FormState<any, any, any>, 'values' | 'errors'>

export type FormStateOverrides = {
  [TKey in keyof OverridableFormState]?: () => OverridableFormState[TKey]
}

const formErrorsCache = new WeakMap<FormErrorMeta, Array<ValidationIssue>>()

const formStateKeys = [
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

// @ts-expect-error - Unused type, checks if formStateKeys is exhaustive
type _IsExhaustiveKeys<
  T extends (typeof formStateKeys)[number] = keyof FormState<any, any, any>,
> = T

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

function getFormStateValue<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TKey extends keyof FormState<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    ToSubmitMeta<TSubmitReturn>
  >,
>(
  form: InternalFormApi<TFormData, TFormValidators, TSubmitReturn>,
  key: TKey,
  overrides: FormStateOverrides = {},
): FormState<
  TFormData,
  ToFormValidatorMetas<TFormValidators>,
  ToSubmitMeta<TSubmitReturn>
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
    case 'errors':
      return getFormErrors(form) as FormErrors<
        ToFormValidatorMetas<TFormValidators>,
        ToSubmitMeta<TSubmitReturn>
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
): FormState<
  TFormData,
  ToFormValidatorMetas<TFormValidators>,
  ToSubmitMeta<TSubmitReturn>
> {
  const result = {} as FormState<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    ToSubmitMeta<TSubmitReturn>
  >
  for (const key of formStateKeys) {
    result[key] = getFormStateValue(form, key, overrides) as never
  }
  return result
}

export function createFormStateProxy(
  form: InternalFormApi<any, any, any>,
  overrides: FormStateOverrides = {},
): FormState<any, any, any> {
  return new Proxy({} as FormState<any, any, any>, {
    get(_target, property) {
      if (formStateKeys.includes(property as keyof FormState<any, any, any>)) {
        return getFormStateValue(
          form,
          property as keyof FormState<any, any, any>,
          overrides,
        )
      }
      return undefined
    },
    ownKeys: () => formStateKeys,
    getOwnPropertyDescriptor(_target, property) {
      if (formStateKeys.includes(property as keyof FormState<any, any, any>)) {
        return { configurable: true, enumerable: true }
      }
      return undefined
    },
  })
}
