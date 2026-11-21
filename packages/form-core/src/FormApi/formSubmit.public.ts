import type { PARSED_ISSUES } from '../validation/results/parseIssues.lib'
import type {
  FormValidationFailure,
  ParseIssuesFn,
  ValidationErrorMap,
  ValidationFailure,
  ValidationFailureItem,
  ValidationOutput,
} from '../validation/results/results.public'
import type { StandardSchemaV1 } from '../validation/results/standardSchema.public'
import type { ParseValidatorCondition } from '../pipeline/validation/formValidators.public'
import type { submitErrorSymbol } from '../submissionError.lib'
import type { FormApi } from './FormApi.public'
import type { ScopedErrorTypes } from '../validation/state.public'
import type { Awaitable } from '../types.public'

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
  /** The values captured when this submission started, without schema transformations. */
  value: TFormData
  /**
   * Aborted when a newer submission, reset, unmount, or server-state replacement
   * invalidates this attempt. Later field edits do not abort it.
   *
   * Shared with this attempt's `onSubmitInvalid` context. Aborting stops results
   * from updating form state; callbacks already started are still awaited and
   * their exceptions retain normal handling. It does not undo external work.
   */
  signal: AbortSignal
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
 * Identifies why a form or form-group submission failed and lets
 * `onSubmitInvalid` suppress its exception.
 */
export interface SubmitInvalidContext {
  /**
   * The same signal passed to this attempt's `onSubmit`, if it ran.
   *
   * Aborted when the attempt is superseded or invalidated by reset, unmount, or
   * server-state replacement. A running callback is still awaited. An aborted
   * signal does not change `reason` or automatically suppress exceptions.
   */
  signal: AbortSignal
  /**
   * How submission failed:
   * - `validation` for reported validation errors
   * - `exception` for a thrown value or rejected promise
   */
  reason: 'validation' | 'exception'
  /**
   * Where submission failed:
   * - `validators` failed during field and form or form-group validation
   * - `onSubmit` failed during the `onSubmit` handler
   */
  source: 'validators' | 'onSubmit'
  /**
   * The exception from validation or `onSubmit`. Always `undefined` when
   * `reason` is `validation`.
   *
   * An exception can also be `undefined`; check `reason` to distinguish the cases.
   */
  error: unknown
  /**
   * Prevents this submission's exception from rejecting `handleSubmit()`.
   *
   * Call during `onSubmitInvalid`, before it returns or its returned promise
   * settles. Has no effect when `reason` is `validation`.
   *
   * The submission remains unsuccessful. `handleSubmit()` resolves with any
   * collected validation errors, or an empty array.
   *
   * @remarks
   * **Important:** This does not suppress exceptions thrown or rejected by
   * `onSubmitInvalid` itself.
   */
  preventThrow: () => void
}

/**
 * Gives `onSubmitInvalid` the submitted values, form instance, and details of a
 * validation failure or exception.
 *
 * @remarks
 * **Important:** Handling an exception in `onSubmitInvalid` does not prevent
 * `handleSubmit()` from rejecting. Call `preventThrow()` during the callback
 * to suppress the submission's exception.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 */
export interface FormSubmitInvalidContext<
  in out TFormData,
  TFormError extends ScopedErrorTypes,
> extends SubmitInvalidContext {
  /**
   * The form values captured when this submission started, without schema
   * transformations applied.
   *
   * Field edits made while submission is pending do not replace these values.
   */
  value: TFormData
  /**
   * The form whose submission failed. Use `formApi.state` to inspect current
   * values and validation state, including edits made since submission started.
   */
  formApi: FormApi<TFormData, TFormError>
}

/**
 * Handles validation failures and exceptions during a form submission.
 *
 * Runs for errors reported by field or form validators, validation errors
 * returned from `onSubmit` using its error helpers, and exceptions thrown or
 * rejected during either stage. A returned promise is awaited before
 * `handleSubmit()` settles.
 *
 * If `onSubmit` fails after cancellation, this callback still runs with the
 * attempt's captured values and aborted signal.
 *
 * @remarks
 * **Important:** Setting this callback does not suppress exceptions.
 * Call `preventThrow()` to prevent the submission's exception from rejecting
 * `handleSubmit()`. Exceptions caused in this callback are not caught.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```ts
 * formOptions({
 *   defaultValues: { name: '' },
 *   onSubmit: async ({ value }) => {
 *     await saveProfile(value)
 *   },
 *   onSubmitInvalid: async ({ reason, error, preventThrow }) => {
 *     if (reason === 'exception') {
 *       // Show an error toast
 *       await reportSubmissionError(error)
 *       preventThrow()
 *     }
 *   },
 * })
 *
 *  formOptions({
 *   defaultValues: { name: '' },
 *   onSubmitInvalid: ({ preventThrow }) => {
 *     preventThrow()
 *     // Focus the first element marked as invalid.
 *     document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
 *   },
 * })
 * ```
 */
export type FormOptionsOnSubmitInvalidFn<
  in out TFormData,
  TFormError extends ScopedErrorTypes,
> = (
  context: FormSubmitInvalidContext<TFormData, TFormError>,
) => Awaitable<void>
