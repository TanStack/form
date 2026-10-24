import type { DeepKeys } from '../deep-keys.public'
import type { OnSubmitError } from '../FormApi/formSubmit.public'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from '../standardSchema.public'
import type { OneOrMany, ReadonlyOneOrMany } from '../types.public'
import type { VALIDATION_OUTPUT } from '../validationOutput.lib'
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

// ============================
// Error state

export interface ScopedErrorTypes<
  out TSelfError = ValidationIssue,
  out TSubfieldsError = ValidationIssue,
> {
  readonly selfError: TSelfError
  readonly subfieldError: TSubfieldsError
}

type ErrorTarget = 'self' | 'subfield'

type NormalizeFailure<TError> = unknown extends TError
  ? ValidationIssue
  : TError extends ValidationSuccess
    ? never
    : TError extends ReadonlyArray<infer TItem>
      ? NormalizeFailure<TItem>
      : TError extends string
        ? ValidationIssue
        : TError extends ValidationIssue
          ? TError
          : never

type GetDirectError<
  TError,
  TTarget extends ErrorTarget,
> = TTarget extends 'self' ? TError : never

type GetMappedResultError<
  TResult extends { fields: unknown },
  TTarget extends ErrorTarget,
> = TTarget extends 'self'
  ? TResult extends { form?: infer TFormError }
    ? NormalizeFailure<TFormError>
    : never
  : NormalizeFailure<TResult['fields'][keyof TResult['fields']]>

type GetFailureResultError<
  TResult,
  TTarget extends ErrorTarget,
> = TResult extends ValidationIssue
  ? GetDirectError<TResult, TTarget>
  : TResult extends { fields: unknown }
    ? GetMappedResultError<TResult, TTarget>
    : GetDirectError<NormalizeFailure<TResult>, TTarget>

type GetResultError<
  TResult,
  TTarget extends ErrorTarget,
> = unknown extends TResult
  ? ValidationIssue
  : TResult extends ValidationSuccess
    ? never
    : GetFailureResultError<TResult, TTarget>

type GetRunnerError<TRun, TTarget extends ErrorTarget> = unknown extends TRun
  ? ValidationIssue
  : TRun extends StandardSchemaV1<any, any>
    ? StandardSchemaV1Issue
    : TRun extends (...args: any) => infer TResult
      ? GetResultError<Awaited<TResult>, TTarget>
      : never

type GetValidatorError<
  TValidator,
  TTarget extends ErrorTarget,
> = unknown extends TValidator
  ? ValidationIssue
  : TValidator extends { run: infer TRun }
    ? GetRunnerError<TRun, TTarget>
    : never

type GetValidatorsError<TValidators, TTarget extends ErrorTarget> =
  // Unlike unknown (omitted validators), an explicit any keeps basic errors.
  0 extends 1 & TValidators
    ? ValidationIssue
    : TValidators extends ReadonlyArray<unknown>
      ? GetValidatorError<TValidators[number], TTarget>
      : never

type GetSubmitError<TSubmitReturn, TTarget extends ErrorTarget> = 0 extends 1 &
  TSubmitReturn
  ? any
  : unknown extends TSubmitReturn
    ? ValidationIssue
    : Awaited<TSubmitReturn> extends infer TResult
      ? TResult extends OnSubmitError<infer TError>
        ? GetResultError<TError, TTarget>
        : never
      : never

type GetSelfErrors<TValidators, TSubmitReturn> =
  | GetValidatorsError<TValidators, 'self'>
  | GetSubmitError<TSubmitReturn, 'self'>

type GetSubfieldErrors<TValidators, TSubmitReturn> =
  | GetValidatorsError<TValidators, 'subfield'>
  | GetSubmitError<TSubmitReturn, 'subfield'>

export type GetFormErrorTypes<TValidators, TSubmitReturn> = ScopedErrorTypes<
  GetSelfErrors<TValidators, TSubmitReturn>,
  GetSubfieldErrors<TValidators, TSubmitReturn>
>
