import type { FieldApi } from './FieldApi.public'
import type { FormApi } from './FormApi.public'

/**
 * TODO should we stick to "Signal"? It sounds very tech-y.
 *
 * I'd be fine with chaging it to `Event` and have 'submit' just be excluded from it.
 * The other type could be called `ValidationEventOrSubmit. Can't be an internal naming because
 * it's passed to `validate` contexts.
 * - Luca
 */
export type ValidationSignal = 'change' | 'blur'
export type ValidationEvent = ValidationSignal | 'submit'

export interface ValidationEnabledContext<TFormData> {
  formApi: FormApi<TFormData, Array<any>>
  fieldApi: FieldApi<any, any> | null
  value: TFormData
}

export type ValidationEnabledFn<TFormData> = (
  context: ValidationEnabledContext<TFormData>,
) => boolean

export interface ValidationSignalConfig<TFormData> {
  signal: ValidationSignal
  enabled?: boolean | ValidationEnabledFn<TFormData>
}

export type ValidationSignalOption<TFormData> =
  | ValidationSignal
  | ValidationSignalConfig<TFormData>

/**
 * A single validation error with a unique identifier.
 */
export interface ErrorWithMessage {
  message: string
}

export interface ValidationAggregateError {
  form?: ErrorWithMessage | Array<ErrorWithMessage>
  // TODO: replace with DeepKeys and make it partial
  fields: Record<string, ErrorWithMessage | Array<ErrorWithMessage>>
}

export interface FormValidatorContext<TFormData> {
  event: ValidationEvent
  formApi: FormApi<TFormData, Array<any>>
  fieldApi: FieldApi<any, any> | null
  value: TFormData
  signal: AbortSignal
}

export type ValidationError = ErrorWithMessage | Array<ErrorWithMessage>
/**
 * Result of validation - can be null/undefined (valid), a single error, or multiple errors.
 */
export type ValidationResult = null | undefined | false | ValidationError

export type FormValidationError = ValidationError | ValidationAggregateError
export type FormValidateResult = ValidationResult | ValidationAggregateError

export type FormValidatorFn<TFormData> = (
  context: FormValidatorContext<TFormData>,
) => FormValidateResult | Promise<FormValidateResult>

/**
 * A validator function that produces validation results.
 */
export interface Validator {
  validate: (
    ...args: Array<any>
  ) => ValidationResult | Promise<ValidationResult>
}

export type FormValidatorErrorScope =
  | 'form-level'
  | 'field-level'
  | 'all'
  | 'source-field'

export interface FormValidator<TFormData> {
  /**
   * If `true`, this validator will only run when all previous validators have passed.
   * If `false`, validators run regardless of earlier validation results.
   *
   * @default false
   */
  runOnlyIfValid?: boolean
  /**
   * TODO docs
   *
   * NOTE: source-field: The field that emitted the validation. Errors for emitted fields
   * aren't discarded on change, but kept, even if the source field has changed since then.
   * Only if the error for that field still persists, of course
   */
  errorScope?: FormValidatorErrorScope
  /**
   * TODO docs
   *
   * Whether this validator should be called during a submission attempt.
   *
   * @default true
   */
  runOnSubmit?: boolean | ValidationEnabledFn<TFormData>
  /**
   * The debounce time in milliseconds for validation signals (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  signalDebounceMs?: number
  validate: FormValidatorFn<TFormData>
  signals?: Array<ValidationSignalOption<TFormData>>
}
