import type { FieldApi } from './FieldApi.public'
import type { FormApi } from './FormApi.public'
import type { StandardSchemaV1 } from './standardSchema.public'
import type { OneOrMany } from './types.public'

export interface Validator<
  TFormData,
  TValidator extends StandardSchemaV1 | ValidatorFn<any, any>,
  TContextValue,
> {
  run: TValidator
  /**
   * If `true`, this validator and all subsequent validators will be skipped if any previous validator has failed.
   * If `false`, validators run regardless of earlier validation results.
   *
   * @default false
   */
  bailIfInvalid?: boolean
  /**
   * TODO docs
   *
   * Whether this validator should be called during a submission attempt.
   *
   * @default true
   */
  runOnSubmit?: boolean | ValidationPredicateFn<TFormData, TContextValue>
  /**
   * The debounce time in milliseconds for validation triggers (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  triggerDebounceMs?: number | ValidationDebounceFn<TFormData, TContextValue>
  triggers?: Array<ValidationTriggerOption<TFormData, TContextValue>>
}

export type ValidationTrigger = 'change' | 'blur' | 'submit'
export type ConfigurableValidationTrigger = Exclude<ValidationTrigger, 'submit'>

export interface ValidationPredicateContext<TFormData, TValue = TFormData> {
  formApi: FormApi<TFormData, ReadonlyArray<any>>
  triggerFieldApi?: FieldApi<any, any>
  value: TValue
}

export type ValidationPredicateFn<TFormData, TValue = TFormData> = (
  context: ValidationPredicateContext<TFormData, TValue>,
) => boolean

export type ValidationDebounceFn<TFormData, TValue = TFormData> = (
  context: ValidationPredicateContext<TFormData, TValue>,
) => number

export interface ValidationTriggerConfig<TFormData, TValue = TFormData> {
  trigger: ConfigurableValidationTrigger
  when?: boolean | ValidationPredicateFn<TFormData, TValue>
}

export type ValidationTriggerOption<TFormData, TValue = TFormData> =
  | ConfigurableValidationTrigger
  | ValidationTriggerConfig<TFormData, TValue>

/**
 * A single validation error with a unique identifier.
 */
export interface ErrorWithMessage {
  message: string
}
export type ValidationErrorValue = ErrorWithMessage | string
export type ValidationError = OneOrMany<ErrorWithMessage>
export type ValidationErrorInput = OneOrMany<ValidationErrorValue>

export interface ValidationAggregateError {
  form?: ValidationErrorInput
  // TODO: replace with DeepKeys and make it partial
  fields: Record<string, ValidationErrorInput>
}

interface BaseValidatorContext<TFormData> {
  event: ValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, ReadonlyArray<any>>
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
export type ValidationResult = ValidValidationResult | ValidationErrorInput

export type FormValidationError =
  | ValidationErrorInput
  | ValidationAggregateError
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
  FormValidatorFn<TFormData> | StandardSchemaV1<TFormData, any>,
  TFormData
> {}

type TryInferSchemaOutput<T> = T extends {
  run: StandardSchemaV1<any, infer TOutput>
}
  ? TOutput
  : undefined

export type FormStandardSchemaValidatorOutputs<
  TFormValidators extends ReadonlyArray<FormValidator<any>>,
> = TFormValidators extends readonly [infer TFirst, ...infer TRest]
  ? TFirst extends FormValidator<any>
    ? TRest extends ReadonlyArray<FormValidator<any>>
      ? [
          TryInferSchemaOutput<TFirst>,
          ...FormStandardSchemaValidatorOutputs<TRest>,
        ]
      : []
    : []
  : []

export interface FieldValidatorContext<
  TFormData,
  TFieldValue,
> extends BaseValidatorContext<TFormData> {
  fieldApi: FieldApi<TFormData, any>
  value: TFieldValue
}

export type FieldValidateResult = ValidationResult

export type FieldValidatorFn<TFormData, TFieldValue> = ValidatorFn<
  FieldValidatorContext<TFormData, TFieldValue>,
  FieldValidateResult
>

export interface FieldValidator<TFormData, TFieldValue> extends Validator<
  TFormData,
  FieldValidatorFn<TFormData, TFieldValue> | StandardSchemaV1<TFieldValue, any>,
  TFieldValue
> {}
