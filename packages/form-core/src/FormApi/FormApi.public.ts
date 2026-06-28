import type { ReadonlyAtom } from '@tanstack/store'
import type {
  ConfigurableValidationTrigger,
  ErrorVisibility,
  FormErrors,
  FormStandardSchemaValidatorOutputs,
  FormValidationError,
  FormValidatorMetas,
  FormValidators,
  ParsedStandardSchemaIssues,
  SubmitMeta,
  ToFormValidatorMetas,
  ValidationIssue,
} from '../validation.public'
import type { StandardSchemaV1Issue } from '../standardSchema.public'
import type { FormListeners } from '../listeners.public'
import type { FormApiArrayMethods } from './FormApiArrayMethods.types.public'
import type { FormApiFieldMethods } from './FormApiFieldMethods.types.public'
import type { ServerFormState } from '../serverValidate.public'

declare const onSubmitErrorBrand: unique symbol

export type OnSubmitError<
  TFormValidationError extends FormValidationError<any>,
> = TFormValidationError & {
  [onSubmitErrorBrand]: true
}

export type CreateValidationErrorFn<in out TFormData> = <
  TError extends FormValidationError<TFormData>,
>(
  error: TError,
) => OnSubmitError<TError>

export type ParseSubmitIssuesFn<in out TFormData> = (
  issues: ReadonlyArray<StandardSchemaV1Issue>,
) => OnSubmitError<ParsedStandardSchemaIssues<TFormData>>

export interface FormSubmitContext<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
> {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidatorMetas, any>
  schemaOutputs: FormStandardSchemaValidatorOutputs<TFormValidatorMetas>
  createValidationError: CreateValidationErrorFn<TFormData>
  parseIssues: ParseSubmitIssuesFn<TFormData>
}

export type AnyFormOptions = FormOptions<any, any, any>

export interface FormOptions<
  in out TFormData,
  in out TFormValidators extends FormValidators<TFormData>,
  in out TSubmitReturn,
> {
  formId?: string
  defaultValues: TFormData
  errorVisibility?: ErrorVisibility<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    SubmitMeta<ValidationIssue, ValidationIssue>
  >
  validators?: TFormValidators
  listeners?: FormListeners<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    SubmitMeta<ValidationIssue, ValidationIssue>
  >
  serverState?: ServerFormState<TFormData, TFormValidators> | null
  onSubmit?: (
    context: FormSubmitContext<
      TFormData,
      ToFormValidatorMetas<TFormValidators>
    >,
  ) => TSubmitReturn
}

export interface FormApiOptions<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitMeta,
> {
  formId?: string
  defaultValues: TFormData
  errorVisibility?: ErrorVisibility<TFormData, TFormValidatorMetas, TSubmitMeta>
  validators?: FormValidators<TFormData>
  listeners?: FormListeners<TFormData, TFormValidatorMetas, TSubmitMeta>
  serverState?: ServerFormState<TFormData, any> | null
  onSubmit?: (
    context: FormSubmitContext<TFormData, TFormValidatorMetas>,
  ) => unknown
}

export interface FormState<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitMeta,
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
   * Whether the current form values are deeply equal to the default values.
   */
  isDefaultValue: boolean
  /**
   * Array of form-level validation errors.
   */
  errors: FormErrors<TFormValidatorMetas, TSubmitMeta>
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

export type AnyFormApi = FormApi<any, any, any>

export interface FormResetOptions {
  /**
   * Whether `reset(values)` should also update the form's `defaultValues`
   * baseline.
   *
   * By default, passing values to `reset` treats those values as the new reset
   * baseline. Future `reset()` calls will return to those values, and
   * `state.isDefaultValue` will compare against them.
   *
   * Set this to `false` when you want reset semantics for form state
   * (clearing touched, dirty, validation, submission state, and mounted fields)
   * but want to keep comparing against the previous `defaultValues`.
   *
   * With `updateDefaultValues: false`, `state.isDirty` is reset to `false`,
   * but `state.isDefaultValue` may be `false` if the provided reset values do
   * not deeply equal the preserved defaults.
   *
   * This option is ignored when no reset values are provided.
   */
  updateDefaultValues?: boolean
}

export interface FormApi<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitMeta,
>
  extends FormApiFieldMethods<TFormData>, FormApiArrayMethods<TFormData> {
  atom: ReadonlyAtom<FormState<TFormData, TFormValidatorMetas, TSubmitMeta>>
  readonly state: FormState<TFormData, TFormValidatorMetas, TSubmitMeta>
  readonly options: FormApiOptions<TFormData, TFormValidatorMetas, TSubmitMeta>
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
   * Reset form values, metadata, validation state, and mounted fields.
   *
   * `reset()` restores the current `defaultValues`.
   *
   * `reset(values)` sets the current values and also updates `defaultValues`
   * to those values.
   *
   * `reset(values, { updateDefaultValues: false })` sets the current values
   * while preserving the previous `defaultValues` baseline.
   */
  reset: (values?: TFormData, opts?: FormResetOptions) => void
}
