import type { ReadonlyAtom } from '@tanstack/store'
import type {
  ConfigurableValidationTrigger,
  ErrorVisibility,
  FormErrors,
  FormStandardSchemaValidatorOutputs,
  FormValidationError,
  FormValidatorMetas,
  FormValidators,
  ToFormValidatorMetas,
} from '../validation.public'
import type { FormListeners } from '../listeners.public'
import type { ArrayFieldMethods } from './array-methods.lib'
import type { FormApiArrayMethods } from './FormApiArrayMethods.types.public'
import type { FormApiFieldMethods } from './FormApiFieldMethods.types.public'

declare const onSubmitErrorBrand: unique symbol

export type OnSubmitError<
  TFormValidationError extends FormValidationError<any>,
> = TFormValidationError & {
  [onSubmitErrorBrand]: true
}

export type CreateValidationErrorFn<TFormData> = <
  TError extends FormValidationError<TFormData>,
>(
  error: TError,
) => OnSubmitError<TError>

export interface FormSubmitContext<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
> {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidatorMetas, any>
  schemaOutputs: FormStandardSchemaValidatorOutputs<TFormValidatorMetas>
  createValidationError: CreateValidationErrorFn<TFormData>
}

export type AnyFormOptions = FormOptions<any, any, any>

export interface FormOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  formId?: string
  defaultValues: TFormData
  errorVisibility?: ErrorVisibility<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    TSubmitReturn
  >
  validators?: TFormValidators
  listeners?: FormListeners<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    TSubmitReturn
  >
  onSubmit?: (
    context: FormSubmitContext<
      TFormData,
      ToFormValidatorMetas<TFormValidators>
    >,
  ) => TSubmitReturn
}

export interface FormState<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> {
  /**
   * The current values of the form.
   */
  values: TFormData
  /**
   * Whether the form has been touched.
   */
  isTouched: boolean
  /**
   * Whether the form has been dirtied. The opposite of `isPristine`.
   *
   * TODO add link to persistent dirty model? Or maybe a reference to isDefaultValue?
   */
  isDirty: boolean
  /**
   * Whether the form has not yet been dirtied. The opposite of `isDirty`.
   */
  isPristine: boolean
  /**
   * Array of form-level validation errors.
   */
  errors: FormErrors<TFormValidatorMetas, TSubmitReturn>
  /**
   * Whether the form currently has no form-level or field-level errors.
   */
  isValid: boolean
  /**
   * Whether the form currently has form-level or field-level errors.
   */
  isInvalid: boolean
  /**
   * Whether the form can currently be submitted.
   *
   * This is an optimistic button affordance: `true` until validation has found
   * errors, then `false` while errors are known or the form is submitting.
   */
  canSubmit: boolean
  /**
   * Whether the form is currently in the process of submitting.
   *
   */
  isSubmitting: boolean
  /**
   * Whether the latest submission completed without validation or submit errors.
   */
  isSubmitSuccessful: boolean
  /**
   * Whether the form or any field is currently validating.
   */
  isValidating: boolean
  /**
   * The number of times a submission has been attempted, regardless of its success.
   *
   * If the form is reset, this will revert back to 0.
   */
  submissionAttempts: number
}

// Array field methods resolve to `never` if there is no array value, so we need
// to remove them to keep AnyFormApi truly compatible with all forms
export type AnyFormApi = Omit<FormApi<any, any, any>, ArrayFieldMethods>

export interface FormApi<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
>
  extends FormApiFieldMethods<TFormData>, FormApiArrayMethods<TFormData> {
  store: ReadonlyAtom<FormState<TFormData, TFormValidatorMetas, TSubmitReturn>>
  readonly state: FormState<TFormData, TFormValidatorMetas, TSubmitReturn>
  readonly options: FormOptions<
    TFormData,
    FormValidators<TFormData>,
    TSubmitReturn
  >
  readonly formId: string

  /**
   * TODO expand on it
   *
   * Validates with the given validation signal and returns
   * errors if they appeared. It will automatically populate the
   * form's error state.
   */
  validate: (
    signal: ConfigurableValidationTrigger,
  ) => Promise<Array<FormValidationError<TFormData>>>

  /**
   * TODO for later: submit meta
   *
   */
  handleSubmit: () => Promise<Array<FormValidationError<TFormData>>>
  /**
   * TODO
   */
  reset: (values?: TFormData) => void
}
