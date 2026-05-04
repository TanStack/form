import type { FieldApi } from './FieldApi.public'
import type { FormApi } from './FormApi.public'
import type { OneOrMany } from './types.public'

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
export type ValidationError = OneOrMany<ErrorWithMessage>

export interface ValidationAggregateError {
  form?: ErrorWithMessage | Array<ErrorWithMessage>
  // TODO: replace with DeepKeys and make it partial
  fields: Record<string, ValidationError>
}

interface BaseValidatorContext<TFormData> {
  event: ValidationEvent
  signal: AbortSignal
  formApi: FormApi<TFormData, Array<any>>
}

export interface FormValidatorContext<
  TFormData,
> extends BaseValidatorContext<TFormData> {
  fieldApi: FieldApi<any, any> | null
  value: TFormData
}

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

export interface FieldValidatorContext<
  TFormData,
  TFieldValue,
> extends BaseValidatorContext<TFormData> {
  fieldApi: FieldApi<TFormData, any>
  value: TFieldValue
}

export type FieldValidateResult = ValidationResult

export type FieldValidatorFn<TFormData, TFieldValue> = (
  context: FieldValidatorContext<TFormData, TFieldValue>,
) => FieldValidateResult | Promise<FieldValidateResult>

export interface FieldValidator<TFormData, TFieldValue> {
  /**
   * If `true`, this validator will only run when all previous validators have passed.
   * If `false`, validators run regardless of earlier validation results.
   *
   * @default false
   */
  runOnlyIfValid?: boolean
  /**
   * Whether this validator should be called during a submission attempt.
   *
   * @default true
   */
  runOnSubmit?: boolean | ValidationEnabledFn<any>
  /**
   * The debounce time in milliseconds for validation signals (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  signalDebounceMs?: number
  validate: FieldValidatorFn<TFormData, TFieldValue>
  signals?: Array<ValidationSignalOption<any>>
}
