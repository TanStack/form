import type { FieldApi } from './FieldApi.public'
import type { FormApi } from './FormApi.public'
import type { StandardSchemaV1 } from './standardSchema.public'
import type { OneOrMany } from './types.public'

export interface Validator<
  TFormData,
  TValidator extends StandardSchemaV1 | ValidatorFn<any, any>,
> {
  run: TValidator
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
  runOnSubmit?: boolean | ValidationPredicateFn<TFormData>
  /**
   * The debounce time in milliseconds for validation triggers (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  triggerDebounceMs?: number
  triggers?: Array<ValidationTriggerOption<TFormData>>
}

export type ValidationTrigger = 'change' | 'blur' | 'submit'
export type ConfigurableValidationTrigger = Exclude<ValidationTrigger, 'submit'>

export interface ValidationPredicateContext<TFormData> {
  formApi: FormApi<TFormData, Array<any>>
  triggerFieldApi?: FieldApi<any, any>
  value: TFormData
}

export type ValidationPredicateFn<TFormData> = (
  context: ValidationPredicateContext<TFormData>,
) => boolean

export interface ValidationTriggerConfig<TFormData> {
  trigger: ConfigurableValidationTrigger
  when?: boolean | ValidationPredicateFn<TFormData>
}

export type ValidationTriggerOption<TFormData> =
  | ConfigurableValidationTrigger
  | ValidationTriggerConfig<TFormData>

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
  event: ValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, Array<any>>
}

export interface FormValidatorContext<
  TFormData,
> extends BaseValidatorContext<TFormData> {
  triggerFieldApi?: FieldApi<any, any>
  value: TFormData
}

export type ValidValidationResult = null | undefined | false

/**
 * Result of validation - can be null/undefined (valid), a single error, or multiple errors.
 */
export type ValidationResult = ValidValidationResult | ValidationError

export type FormValidationError = ValidationError | ValidationAggregateError
export type FormValidateResult = ValidationResult | ValidationAggregateError

export type ValidatorFn<TParameter, TReturn> = (
  ...args: Array<TParameter>
) => TReturn | Promise<TReturn>

export type FormValidatorFn<TFormData> = ValidatorFn<
  FormValidatorContext<TFormData>,
  FormValidateResult
>

export interface FormValidator<TFormData> extends Validator<
  TFormData,
  FormValidatorFn<TFormData> | StandardSchemaV1<TFormData, any>
> {}

export interface FieldValidatorContext<
  TFormData,
  TFieldValue,
> extends BaseValidatorContext<TFormData> {
  triggerFieldApi: FieldApi<TFormData, any>
  value: TFieldValue
}

export type FieldValidateResult = ValidationResult

export type FieldValidatorFn<TFormData, TFieldValue> = ValidatorFn<
  FieldValidatorContext<TFormData, TFieldValue>,
  FieldValidateResult
>

export interface FieldValidator<TFormData, TFieldValue> extends Validator<
  TFormData,
  FieldValidatorFn<TFormData, TFieldValue> | StandardSchemaV1<TFieldValue, any>
> {}
