import type { DeepKeys } from '../deep-keys.public'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from '../standardSchema.public'
import type { OneOrMany, ReadonlyOneOrMany } from '../types.public'
import type { VALIDATION_OUTPUT } from '../validationOutput.lib'

export interface ValidationIssue {
  message: string
}

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
  TFormError,
  TFieldError = TFormError,
> {
  form?: TFormError
  fields: ValidationFieldMap<TFormData, TFieldError>
}

export interface CreatedErrorMap<TFormData, TItem> {
  form: Array<TItem>
  fields: ValidationFieldMap<TFormData, OneOrMany<TItem>>
}

export type ParsedStandardSchemaIssues<TFormData> = CreatedErrorMap<
  TFormData,
  StandardSchemaV1Issue
>

type ErrorMapItem<TError> = unknown extends TError
  ? ValidationFailureItem
  : TError extends ReadonlyArray<infer TItem>
    ? ErrorMapItem<TItem>
    : TError extends string
      ? string
      : TError

type InferredErrorMapItem<TError> = [ErrorMapItem<TError>] extends [never]
  ? ValidationFailureItem
  : ErrorMapItem<TError>

export interface CreateErrorMapFn<TFormData> {
  <
    TFormError extends ValidationFailure = never,
    TFieldErrors extends ValidationFieldMap<TFormData, ValidationFailure> = {},
  >(initial?: {
    form?: TFormError
    fields?: {
      [TName in keyof TFieldErrors]: TName extends DeepKeys<TFormData>
        ? TFieldErrors[TName]
        : never
    }
  }): CreatedErrorMap<
    TFormData,
    InferredErrorMapItem<TFormError | TFieldErrors[keyof TFieldErrors]>
  >
  (
    issues: ReadonlyArray<StandardSchemaV1Issue>,
  ): ParsedStandardSchemaIssues<TFormData>
}

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

type BroadValidators = Array<{
  run: StandardSchemaV1<any, any> | ((...args: any) => unknown)
}>

type GetValidatorsError<TValidators, TTarget extends ErrorTarget> =
  // Unlike unknown (omitted validators), an explicit any keeps basic errors.
  0 extends 1 & TValidators
    ? ValidationIssue
    : TValidators extends ReadonlyArray<unknown>
      ? BroadValidators extends TValidators
        ? ValidationIssue
        : GetValidatorError<TValidators[number], TTarget>
      : never

export type GetFormErrorTypes<TValidators> = ScopedErrorTypes<
  GetValidatorsError<TValidators, 'self'>,
  GetValidatorsError<TValidators, 'subfield'>
>
