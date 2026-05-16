import type { DeepKeys, DeepValue } from './deep-keys.public'
import type { FormApi } from './FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi.public'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './standardSchema.public'
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
  triggers: Array<ValidationTriggerOption<TFormData, TContextValue>>
}

export type ValidationTrigger = 'change' | 'blur' | 'submit'
export type ConfigurableValidationTrigger = Exclude<ValidationTrigger, 'submit'>

export type ErrorVisibility =
  | 'always'
  | 'touched'
  | 'blurred'
  | 'blurred-or-submit-attempted'
  | 'submit-attempted'

export interface ValidationPredicateContext<TFormData, TValue> {
  formApi: FormApi<TFormData, ReadonlyArray<any>>
  triggerFieldApi?: AnyFieldApi
  value: TValue
}

export type ValidationPredicateFn<TFormData, TValue> = (
  context: ValidationPredicateContext<TFormData, TValue>,
) => boolean

export type ValidationDebounceFn<TFormData, TValue> = (
  context: ValidationPredicateContext<TFormData, TValue>,
) => number

export interface ValidationTriggerConfig<TFormData, TValue> {
  trigger: ConfigurableValidationTrigger
  when?: boolean | ValidationPredicateFn<TFormData, TValue>
}

export type ValidationTriggerOption<TFormData, TValue> =
  | ConfigurableValidationTrigger
  | ValidationTriggerConfig<TFormData, TValue>

/**
 * A single validation error with a unique identifier.
 */
export interface ValidationIssue {
  message: string
}
export type ValidationErrorValue = ValidationIssue | string
export type ValidationError = OneOrMany<ValidationIssue>
export type ValidationErrorInput = OneOrMany<ValidationErrorValue>

export interface ValidationAggregateError<TFormData> {
  form?: ValidationErrorInput
  fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInput>>
}

interface BaseValidatorContext<TFormData> {
  event: ValidationTrigger
  signal: AbortSignal
  formApi: FormApi<TFormData, ReadonlyArray<any>>
}

export interface FormValidatorContext<
  TFormData,
> extends BaseValidatorContext<TFormData> {
  triggerFieldApi?: AnyFieldApi
  value: TFormData
}

export type ValidValidationResult = null | undefined | false

/**
 * Result of validation - can be null/undefined (valid), a single error, or multiple errors.
 */
export type ValidationResult = ValidValidationResult | ValidationErrorInput

export type FormValidationError<TFormData> =
  | ValidationErrorInput
  | ValidationAggregateError<TFormData>
export type FormValidateResult<TFormData> =
  | ValidationResult
  | ValidationAggregateError<TFormData>

export type ValidatorFn<TParameter, TReturn> = (
  ...args: Array<TParameter>
) => TReturn | Promise<TReturn>

export type FormValidatorFn<TFormData> = ValidatorFn<
  FormValidatorContext<TFormData>,
  FormValidateResult<TFormData>
>

export interface FormValidator<TFormData> extends Validator<
  TFormData,
  FormValidatorFn<TFormData> | StandardSchemaV1<TFormData, any>,
  TFormData
> {}

export type FormValidators<TFormData> = ReadonlyArray<FormValidator<TFormData>>

type TryInferSchemaOutput<T> = T extends {
  run: StandardSchemaV1<any, infer TOutput>
}
  ? T extends { runOnSubmit: false }
    ? undefined
    : TOutput
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
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends BaseValidatorContext<TFormData> {
  fieldApi: FieldApi<TFormData, any, TFieldName, TFieldValue, any>
  value: TFieldValue
}

export type FieldValidateResult = ValidationResult

export type FieldValidatorFn<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> = ValidatorFn<
  FieldValidatorContext<TFormData, TFieldName, TFieldValue>,
  FieldValidateResult
>

export interface FieldValidator<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends Validator<
  TFormData,
  | FieldValidatorFn<TFormData, TFieldName, TFieldValue>
  | StandardSchemaV1<TFieldValue, any>,
  TFieldValue
> {
  watchFields?: Array<string>
}

export type FieldValidators<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> = ReadonlyArray<FieldValidator<TFormData, TFieldName, TFieldValue>>

type NormalizeValidationError<TError> =
  TError extends ReadonlyArray<infer TItem>
    ? NormalizeValidationError<TItem>
    : TError extends string
      ? ValidationIssue
      : TError

type ExtractFormError<TFormValidator> = TFormValidator extends {
  run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TFormValidator extends { run: (...args: any) => infer TResult }
    ? Awaited<TResult> extends infer TAwaitedResult
      ? TAwaitedResult extends ValidationAggregateError<any>
        ? NormalizeValidationError<NonNullable<TAwaitedResult['form']>>
        : NormalizeValidationError<
            Extract<TAwaitedResult, ValidationErrorInput>
          >
      : never
    : never

type ExtractFormValidatorFieldError<TFormValidator> = TFormValidator extends {
  run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TFormValidator extends { run: (...args: any) => infer TResult }
    ? Awaited<TResult> extends infer TAwaitedResult
      ? TAwaitedResult extends ValidationAggregateError<any>
        ? TAwaitedResult['fields'] extends Record<
            PropertyKey,
            infer TFieldError
          >
          ? NormalizeValidationError<TFieldError>
          : never
        : never
      : never
    : never

type ExtractFieldValidatorError<TFieldValidator> = TFieldValidator extends {
  run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TFieldValidator extends { run: (...args: any) => infer TResult }
    ? Awaited<TResult> extends infer TAwaitedResult
      ? NormalizeValidationError<Extract<TAwaitedResult, ValidationErrorInput>>
      : never
    : never

type IsAny<T> = 0 extends 1 & T ? true : false
type IsBroadFormValidators<TFormValidators> =
  IsAny<TFormValidators> extends true
    ? true
    : TFormValidators extends ReadonlyArray<infer TFormValidator>
      ? FormValidator<any> extends TFormValidator
        ? true
        : false
      : true
type IsBroadFieldValidators<TFieldValidators> =
  IsAny<TFieldValidators> extends true
    ? true
    : TFieldValidators extends ReadonlyArray<infer TFieldValidator>
      ? FieldValidator<any, any, any> extends TFieldValidator
        ? true
        : false
      : true

export type FormErrors<
  TFormValidators extends ReadonlyArray<FormValidator<any>>,
> =
  IsBroadFormValidators<TFormValidators> extends true
    ? Array<ValidationIssue>
    : Array<ExtractFormError<TFormValidators[number]>>

export type FieldErrors<
  TFormValidators extends ReadonlyArray<FormValidator<any>>,
  TFieldValidators extends ReadonlyArray<FieldValidator<any, any, any>>,
> =
  IsBroadFormValidators<TFormValidators> extends true
    ? Array<ValidationIssue>
    : IsBroadFieldValidators<TFieldValidators> extends true
      ? Array<ValidationIssue>
      : Array<
          | ExtractFormValidatorFieldError<TFormValidators[number]>
          | ExtractFieldValidatorError<TFieldValidators[number]>
        >
