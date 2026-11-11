import type { StandardSchemaV1 } from '../standardSchema.public'
import type { PARSED_ISSUES } from '../validation/parseIssues.lib'
import type {
  FormValidationFailure,
  InferredErrorMapItem,
  ParseIssuesFn,
  ScopedErrorTypes,
  ValidationErrorMap,
  ValidationFailure,
  ValidationFailureItem,
  ValidationFieldMap,
  ValidationOutput,
} from '../validation/state.public'
import type { FormApi } from './FormApi.public'
import type { ParseValidatorCondition } from '../validation/formValidators.public'
import type { Awaitable } from '../types.public'
import type { submitErrorSymbol } from './handleSubmit.lib'

type UnwrapValidatorFunction<TOutput> = TOutput extends {
  readonly [PARSED_ISSUES]: true
}
  ? never
  : TOutput extends ValidationOutput<infer T>
    ? T
    : undefined

// Make sure TSkipOnSubmit is distributed so that we get boolean -> possibly undefined
type GetValidatorRunOutput<TRun, TSkipOnSubmit> = TSkipOnSubmit extends true
  ? undefined
  : TRun extends StandardSchemaV1<any, infer TOutput>
    ? TOutput
    : TRun extends (...args: any) => infer TOutput
      ? UnwrapValidatorFunction<Awaited<TOutput>>
      : undefined

type GetValidatorOutput<TValidator> = TValidator extends { run: infer TRun }
  ? GetValidatorRunOutput<
      TRun,
      TValidator extends { skipOnSubmit: infer TCondition }
        ? ParseValidatorCondition<TCondition>
        : false
    >
  : undefined

/**
 * Infers form validators' submission output types in configuration order.
 *
 * Standard Schemas contribute their parsed output types. Validator functions
 * contribute the payload types of their `createOutput` results, including
 * results returned in promises. Successful returns without an output contribute
 * `undefined`.
 *
 * `skipOnSubmit: true` makes an entry `undefined`. A callback or `boolean`
 * condition allows `undefined` alongside the validator's output type.
 *
 * @typeParam TValidators - Library-managed. Do not specify explicitly.
 */
export type GetValidatorOutputs<TValidators extends ReadonlyArray<unknown>> = {
  [K in keyof TValidators]: GetValidatorOutput<TValidators[K]>
}

export type OnSubmitError<T> = {
  readonly [submitErrorSymbol]: T
}

export type CreateValidationErrorFn<TFormData> = <
  TError extends FormValidationFailure<TFormData>,
>(
  error: TError,
) => OnSubmitError<TError>

type ParsedSubmitIssues<TFormData> = ReturnType<ParseIssuesFn<TFormData>>

export type CreatedSubmitErrorMap<
  TFormData,
  TFormError extends ValidationFailure,
  TFieldError extends ValidationFailure,
> = Required<ValidationErrorMap<TFormData, TFormError, TFieldError>> &
  OnSubmitError<
    Required<ValidationErrorMap<TFormData, TFormError, TFieldError>>
  >

/**
 * Builds a mutable error map to return from `onSubmit` and report validation errors.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type CreateSubmitErrorMapFn<TFormData> = (
  initial?: Partial<
    ValidationErrorMap<TFormData, ValidationFailure, ValidationFailure>
  >,
) => CreatedSubmitErrorMap<
  TFormData,
  Array<ValidationFailureItem>,
  ValidationFailure
>

/**
 * Converts Standard Schema issues into a mutable error map to return from `onSubmit`.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type ParseSubmitIssuesFn<TFormData> = (
  issues: Parameters<ParseIssuesFn<TFormData>>[0],
) => ParsedSubmitIssues<TFormData> &
  OnSubmitError<ParsedSubmitIssues<TFormData>>

/**
 * Form values, validator outputs, and error helpers passed to `onSubmit` after
 * submission validation succeeds.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorOutputs - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FormSubmitContext<
  TFormData,
  TValidatorOutputs extends readonly unknown[],
> {
  /** The form values for this submission, without schema transformations applied. */
  value: TFormData
  /** The form instance handling this submission. */
  formApi: FormApi<TFormData, ScopedErrorTypes<never, never>>
  /**
   * The validator outputs from this submission.
   *
   * Standard Schemas provide their output data automatically. Callback
   * validators must return a `createOutput` result to provide output data.
   *
   * Outputs follow the same order as the validators array.
   *
   * Skipped validators and successful returns without output contribute
   * `undefined`.
   *
   * Outputs from earlier change, blur, or mount validation are not reused.
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
  validatorOutputs: TValidatorOutputs
  /**
   * Creates a validation error recognized as a submission failure when returned
   * from a submission handler. Creating the error alone does not update form or
   * field validation state.
   */
  createValidationError: CreateValidationErrorFn<TFormData>
  /**
   * Builds a mutable submission error map from optional initial errors. Return
   * the map to apply its form and field errors. An empty map indicates success.
   */
  createErrorMap: CreateSubmitErrorMapFn<TFormData>
  /**
   * Converts Standard Schema issues into a mutable submission error map using
   * the submitted values. Return the map to report its form and field errors.
   */
  parseIssues: ParseSubmitIssuesFn<TFormData>
}

/**
 * Handles a form submission after submission validation succeeds.
 *
 * Return a result from `createValidationError`, `createErrorMap`, or `parseIssues`
 * to report validation errors from the submission handler.
 *
 * A returned promise is awaited before submission finishes.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorOutputs - Library-managed. Do not specify explicitly.
 */
export type FormOptionsOnSubmitFn<
  TFormData,
  TValidatorOutputs extends readonly unknown[],
  TSubmitReturn,
> = (context: FormSubmitContext<TFormData, TValidatorOutputs>) => TSubmitReturn

/**
 * The form values and form instance passed to `onSubmitInvalid` after a failed
 * submission.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 */
export interface FormSubmitInvalidContext<
  in out TFormData,
  TFormError extends ScopedErrorTypes,
> {
  /** The form values for the failed submission, without schema transformations applied. */
  value: TFormData
  /** The form instance handling the failed submission. */
  formApi: FormApi<TFormData, TFormError>
}

/**
 * Handles a failed form submission.
 *
 * Runs for submission validation failures, errors returned from `onSubmit`, and
 * exceptions thrown during validation or `onSubmit`.
 *
 * A returned promise is awaited before submission finishes. If this callback
 * throws or rejects, `handleSubmit()` rejects.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 */
export type FormOptionsOnSubmitInvalidFn<
  in out TFormData,
  TFormError extends ScopedErrorTypes,
> = (
  context: FormSubmitInvalidContext<TFormData, TFormError>,
) => Awaitable<void>
