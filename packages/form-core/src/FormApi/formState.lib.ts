import type { FormState } from './FormApi.public'
import type { AnyInternalFormApi, InternalFormApi } from './FormApi.lib'

type OverridableFormState = Omit<FormState<any, any>, 'values' | 'errors'>

export type FormStateOverrides = {
  [TKey in keyof OverridableFormState]?: () => OverridableFormState[TKey]
}

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

function getFormStateValue<
  TFormData,
  TKey extends keyof FormState<TFormData, any>,
>(
  form: InternalFormApi<TFormData>,
  key: TKey,
  overrides: FormStateOverrides = {},
): FormState<TFormData, any>[TKey] {
  switch (key) {
    case 'values':
      return form._atoms.values.get() as never
    case 'isTouched':
      return (overrides.isTouched?.() ??
        (form._atoms.meta.submissionAttempts.get() > 0 ||
          form._atoms.meta.touchedFieldCount.get() > 0)) as never
    case 'isDirty':
      return (overrides.isDirty?.() ?? form._atoms.meta.isDirty.get()) as never
    case 'isPristine':
      return (overrides.isPristine?.() ??
        !form._atoms.meta.isDirty.get()) as never
    case 'isDefaultValue':
      return (overrides.isDefaultValue?.() ??
        form._getIsDefaultValue()) as never
    case 'errors':
      return form._fieldRootNode._errorStore.errors as never
    case 'isValid':
      return (overrides.isValid?.() ??
        (form._fieldRootNode._errorStore.errors.length === 0 &&
          form._atoms.meta.errorFields.get().size === 0)) as never
    case 'isInvalid':
      return (overrides.isInvalid?.() ??
        (form._fieldRootNode._errorStore.errors.length > 0 ||
          form._atoms.meta.errorFields.get().size > 0)) as never
    case 'canSubmit':
      return (overrides.canSubmit?.() ??
        (!form._atoms.meta.isSubmitting.get() &&
          form._fieldRootNode._errorStore.errors.length === 0 &&
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

export function getFormStateSnapshot<TFormData>(
  form: InternalFormApi<TFormData>,
  overrides: FormStateOverrides = {},
): FormState<TFormData, any> {
  const result = {} as FormState<TFormData, any>
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
  form: AnyInternalFormApi,
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
