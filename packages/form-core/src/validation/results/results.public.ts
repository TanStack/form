import type { VALIDATION_OUTPUT } from './validationOutput.lib'
import type { OneOrMany, ReadonlyOneOrMany } from '../../types.public'
import type { DeepKeys } from '../../deep-keys.public'
import type { StandardSchemaV1Issue } from './standardSchema.public'
import type { PARSED_ISSUES } from './parseIssues.lib'

export interface ValidationIssue {
  message: string
}

export type FieldErrorTarget = 'field' | 'field-and-self' | 'self'

/**
 * The result of `createOutput`. Return it from a validator to store its data
 * during submission.
 *
 * @typeParam TOutput - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```ts
 * formOptions({
 *   defaultValues: { name: '' },
 *   validators: [
 *     {
 *       run: ({ createOutput, value }) => {
 *         return createOutput({ displayName: value.name.trim() })
 *       },
 *     },
 *     {
 *       // Schemas pass their output data by default.
 *       run: mySchema,
 *     },
 *   ],
 *   onSubmit: ({ validatorOutputs }) => {
 *     // Outputs follow the same order as the validators array.
 *     const [customData, schemaOutput] = validatorOutputs
 *     console.log(customData.displayName)
 *   },
 * })
 * ```
 */
export interface ValidationOutput<out TOutput> {
  readonly [VALIDATION_OUTPUT]: TOutput
}

export type ValidationFailureItem = ValidationIssue | string
export type ValidationFailure<
  TItem extends ValidationFailureItem = ValidationFailureItem,
> = ReadonlyOneOrMany<TItem>
export type ValidationSuccess =
  null | undefined | false | void | ValidationOutput<unknown>

export type ValidationFieldMap<TFormData, TError> = Partial<
  Record<DeepKeys<TFormData>, TError>
>

export interface ValidationErrorMap<
  TFormData,
  TFormError extends ValidationFailure,
  TFieldError extends ValidationFailure,
> {
  form?: TFormError
  fields: ValidationFieldMap<TFormData, TFieldError>
}

export interface ValidationErrorMapHelper<TFormData> extends Required<
  ValidationErrorMap<
    TFormData,
    ValidationFailureItem[],
    ValidationFailureItem[]
  >
> {
  addFormError: (error: ValidationFailure) => void
  addFieldError: (name: DeepKeys<TFormData>, error: ValidationFailure) => void
}

export type FormValidationFailure<TFormData> =
  | ValidationFailure
  | ValidationErrorMap<TFormData, ValidationFailure, ValidationFailure>

export type FormValidationResult<TFormData> =
  FormValidationFailure<TFormData> | ValidationSuccess

/**
 * Form and field errors after strings have been converted to issue objects.
 * Contains error data without the methods supplied by error-map helpers.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FormattedValidationErrorMap<TFormData> {
  form: Array<ValidationIssue>
  fields: ValidationFieldMap<TFormData, Array<ValidationIssue>>
}

/**
 * One entry in the flat errors returned by validation or submission.
 * Field paths remain attached to errors supplied as an error map.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type FormattedValidationError<TFormData> =
  ValidationIssue | FormattedValidationErrorMap<TFormData>

/**
 * A validator result with formatted error contents. Successful results retain
 * their original value; ordinary errors are arrays of issue objects.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type FormattedValidationResult<TFormData> =
  | Array<ValidationIssue>
  | FormattedValidationErrorMap<TFormData>
  | ValidationSuccess

export interface ParsedStandardSchemaIssues<TFormData> extends Required<
  ValidationErrorMap<
    TFormData,
    Array<StandardSchemaV1Issue>,
    Array<StandardSchemaV1Issue>
  >
> {
  readonly [PARSED_ISSUES]: true
}

type ErrorMapItem<TError> = unknown extends TError
  ? ValidationFailureItem
  : TError extends ReadonlyArray<infer TItem>
    ? ErrorMapItem<TItem>
    : TError extends string
      ? string
      : TError

export type InferredErrorMapItem<TError> = [ErrorMapItem<TError>] extends [
  never,
]
  ? ValidationFailureItem
  : ErrorMapItem<TError>

export type CreateErrorMapFn<TFormData> = (
  initial?: Partial<
    ValidationErrorMap<TFormData, ValidationFailure, ValidationFailure>
  >,
) => ValidationErrorMapHelper<TFormData>

export type ParseIssuesFn<TFormData> = (
  issues: ReadonlyArray<StandardSchemaV1Issue>,
) => ParsedStandardSchemaIssues<TFormData>

export type CreateOutputFn = <TOutput>(
  value: TOutput,
) => ValidationOutput<TOutput>

/** An error supplied as an issue object or a string that becomes its `message`. */
export type ValidationErrorValue = ValidationIssue | string
/** One or more issue objects after string errors have been normalized. */
export type ValidationError = OneOrMany<ValidationIssue>
/** One or more errors accepted from a validator, including string messages. */
export type ValidationErrorInput = ReadonlyOneOrMany<ValidationErrorValue>

/** A validator return value that indicates success without providing output data. */
export type ValidValidationResult = null | undefined | false

/** A validator return value that indicates success, with or without output data. */
export type SuccessfulValidationResult =
  ValidValidationResult | ValidationOutput<unknown>

/**
 * One or more validation errors, or `null`, `undefined`, or `false` for success.
 */
export type ValidationResult = ValidValidationResult | ValidationErrorInput

/**
 * Errors for a form group, optionally including errors at group-relative field paths.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export type FormGroupValidationError<TGroupValue> =
  | ValidationErrorInput
  | ValidationErrorMap<TGroupValue, ValidationErrorInput, ValidationErrorInput>
/**
 * A form group validator's success result, output data, or validation errors.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export type FormGroupValidateResult<TGroupValue> =
  SuccessfulValidationResult | FormGroupValidationError<TGroupValue>

/** A field validator's success result or errors. Field validators do not provide output data. */
export type FieldValidateResult = ValidationResult
