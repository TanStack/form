import type {
  SuccessfulValidationResult,
  ValidationErrorMap,
  ValidationIssue,
  ValidationSuccess,
} from './results/results.public'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './results/standardSchema.public'
import type { OnSubmitError } from '../FormApi/formSubmit.public'
import type {
  FieldValidators,
  FormGroupValidators,
} from '../pipeline/validation/validation.public'

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

// Shared form types must accept submission handlers supplied later. Leave their
// error types open when onSubmit is omitted; concrete forms use GetFormErrorTypes.
export type GetSharedFormErrorTypes<TValidators, TSubmitReturn> =
  unknown extends TSubmitReturn
    ? any
    : GetFormErrorTypes<TValidators, TSubmitReturn>

type NormalizeValidationResult<TResult> = NormalizeValidationError<
  Exclude<TResult, SuccessfulValidationResult>
>

type NormalizeValidationError<TError> =
  TError extends ReadonlyArray<infer TItem>
    ? NormalizeValidationError<TItem>
    : TError extends string
      ? ValidationIssue
      : TError extends ValidationIssue
        ? TError
        : ValidationIssue

type ValidationErrorTarget = 'form' | 'field'

type ExtractErrorMap<
  TResult,
  TTarget extends ValidationErrorTarget,
> = TResult extends ValidationIssue
  ? NormalizeValidationResult<TResult>
  : TResult extends ValidationErrorMap<any, any, any>
    ? TTarget extends 'form'
      ? TResult extends { form?: infer TError }
        ? NormalizeValidationResult<TError>
        : never
      : TResult extends { fields: infer TFields }
        ? NormalizeValidationResult<TFields[keyof TFields]>
        : never
    : NormalizeValidationResult<TResult>

type ExtractSubmitValidationError<TSubmitReturn> =
  Awaited<TSubmitReturn> extends infer TResolved
    ? TResolved extends OnSubmitError<infer TError>
      ? TError
      : never
    : never

type ParseSubmitFormError<TSubmitReturn> = ExtractErrorMap<
  ExtractSubmitValidationError<TSubmitReturn>,
  'form'
>

type ParseSubmitFieldError<TSubmitReturn> = ExtractErrorMap<
  ExtractSubmitValidationError<TSubmitReturn>,
  'field'
>

type ExtractSubmitFormError<TSubmitReturn> = unknown extends TSubmitReturn
  ? ValidationIssue
  : ParseSubmitFormError<TSubmitReturn>

type ExtractSubmitFieldError<TSubmitReturn> = unknown extends TSubmitReturn
  ? ValidationIssue
  : ParseSubmitFieldError<TSubmitReturn>

type ExtractFormFieldError<TFormError extends ScopedErrorTypes> =
  unknown extends TFormError['subfieldError']
    ? never
    : TFormError['subfieldError']

/**
 * A field's error array, with string messages normalized to issue objects.
 *
 * @typeParam TFieldError - Library-managed. Do not specify explicitly.
 */
export type FieldErrors<TFieldError> = Array<
  unknown extends TFieldError ? ValidationIssue : TFieldError
>

type TryGetFormError<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TValidator extends { readonly run: (...args: any) => infer TReturn }
    ? ExtractErrorMap<Awaited<TReturn>, 'form'>
    : never

type TryGetFieldError<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, any>
}
  ? StandardSchemaV1Issue
  : TValidator extends { readonly run: (...args: any) => infer TReturn }
    ? ExtractErrorMap<Awaited<TReturn>, 'field'>
    : never

type ExtractValidatorFormError<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
> = unknown extends TValidators
  ? never
  : TBroadValidators extends TValidators
    ? never
    : TryGetFormError<TValidators[number]>

type ExtractValidatorFieldError<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
> = unknown extends TValidators
  ? never
  : TBroadValidators extends TValidators
    ? never
    : TryGetFieldError<TValidators[number]>

type GetValidatorSelfErrors<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
  TSubmitReturn,
> =
  | ExtractValidatorFormError<TValidators, TBroadValidators>
  | ExtractSubmitFormError<TSubmitReturn>

type GetValidatorSubfieldErrors<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
  TSubmitReturn,
> =
  | ExtractValidatorFieldError<TValidators, TBroadValidators>
  | ExtractSubmitFieldError<TSubmitReturn>

type ToValidatorErrorTypes<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
  TSubmitReturn,
> = ScopedErrorTypes<
  GetValidatorSelfErrors<TValidators, TBroadValidators, TSubmitReturn>,
  GetValidatorSubfieldErrors<TValidators, TBroadValidators, TSubmitReturn>
>

/**
 * Infers group and routed field issue types from group validators.
 *
 * @typeParam TGroupValidators - Library-managed. Do not specify explicitly.
 */
export type ToFormGroupErrorTypes<
  TGroupValidators extends FormGroupValidators<any>,
> = ToValidatorErrorTypes<TGroupValidators, FormGroupValidators<any>, never>

type FallbackToValidationIssue<TFieldError> = [TFieldError] extends [never]
  ? ValidationIssue
  : TFieldError

/**
 * Combines a field's own issue types with errors routed from its group and form.
 *
 * Falls back to `ValidationIssue` when no specific error type is inferred.
 *
 * @typeParam TFieldValidators - Library-managed. Do not specify explicitly.
 * @typeParam TGroupFieldError - Library-managed. Do not specify explicitly.
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 */
export type ToFieldError<
  TFieldValidators extends FieldValidators<any, any, any>,
  TGroupFieldError,
  TFormError extends ScopedErrorTypes,
> = FallbackToValidationIssue<
  | ExtractValidatorFieldError<TFieldValidators, FieldValidators<any, any, any>>
  | (unknown extends TGroupFieldError ? never : TGroupFieldError)
  | ExtractFormFieldError<TFormError>
>
