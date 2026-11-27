import type { PARSED_ISSUES } from '../validation/results/parseIssues.lib'
import type {
  FormValidationFailure,
  ParseIssuesFn,
  ValidationErrorMap,
  ValidationErrorMapHelper,
  ValidationFailure,
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

export type CreatedSubmitErrorMap<TFormData> =
  ValidationErrorMapHelper<TFormData> &
    OnSubmitError<ValidationErrorMapHelper<TFormData>>

/**
 * Builds a mutable error map to return from `onSubmit` and report validation errors.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type CreateSubmitErrorMapFn<TFormData> = (
  initial?: Partial<
    ValidationErrorMap<TFormData, ValidationFailure, ValidationFailure>
  >,
) => CreatedSubmitErrorMap<TFormData>

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
 * Provides the cancellation signal and error helpers for form and form group
 * `onSubmit` callbacks.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface BaseSubmitContext<TFormData> {
  /**
   * Signals when this submission attempt is invalidated.
   *
   * - A newer submission of the same form or group aborts the signal.
   * - A reset or unmount also aborts it.
   * - Field edits during a submission do not abort the signal.
   * - The same signal is passed to this attempt's `onSubmitInvalid`, if it runs.
   *
   * @remarks
   * **Important:** Aborting prevents submission results from updating form or
   * group state. Callbacks already started are still awaited, and their
   * exceptions retain normal handling. Use the signal to stop external work
   * that supports cancellation.
   */
  signal: AbortSignal
  /**
   * Wraps existing errors so `onSubmit` can return them as validation errors.
   * Calling this helper alone does not update validation state.
   *
   * Accepts error messages, issue objects, arrays of errors, or an error map.
   * For a group, field paths in an error map are relative to the group.
   *
   * - If you want to build or edit errors by field, use
   *   {@link BaseSubmitContext.createErrorMap | createErrorMap}.
   * - If you want to return Standard Schema errors, use
   *   {@link BaseSubmitContext.parseIssues | parseIssues}.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   onSubmit: async ({ value, createValidationError }) => {
   *     if (await nameIsTaken(value.name)) {
   *       return createValidationError('Name is already taken')
   *     }
   *     await saveProfile(value)
   *   },
   * })
   * ```
   */
  createValidationError: CreateValidationErrorFn<TFormData>
  /**
   * Builds a mutable map of submission errors from optional initial errors.
   *
   * - If you already have errors ready to return, use
   *   {@link BaseSubmitContext.createValidationError | createValidationError}.
   * - If you want to return Standard Schema errors, use
   *   {@link BaseSubmitContext.parseIssues | parseIssues}.
   * - Add errors with `addFormError` and `addFieldError`.
   * - Return the map from `onSubmit` to report its errors.
   * - The `form` entry targets the submitting form or group.
   * - Field paths are relative to the submitting form or group.
   * - An empty map indicates success.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   onSubmit: async ({ value, createErrorMap }) => {
   *     const errors = createErrorMap()
   *     if (await nameIsTaken(value.name)) {
   *       errors.addFieldError('name', 'Name is already taken')
   *     }
   *     return errors
   *   },
   * })
   * ```
   */
  createErrorMap: CreateSubmitErrorMapFn<TFormData>
  /**
   * Converts Standard Schema issues into a mutable error map to return from
   * `onSubmit`.
   *
   * - If you want to return your own error messages or an existing error map, use
   *   {@link BaseSubmitContext.createValidationError | createValidationError}.
   * - If you want to build or edit errors by field, use
   *   {@link BaseSubmitContext.createErrorMap | createErrorMap}.
   * - Uses the captured submission values to resolve field paths.
   * - Issues without a field path become form or group errors.
   * - For a group, issue paths are relative to the group.
   * - Return the map to report its errors. An empty map indicates success.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   onSubmit: async ({ value, parseIssues }) => {
   *     const result = parseSchema(mySchema, value)
   *     if (!result.success) {
   *       return parseIssues(result.issues)
   *     }
   *     await saveProfile(result.data)
   *   },
   * })
   * ```
   */
  parseIssues: ParseSubmitIssuesFn<TFormData>
}

/**
 * Gives the form's `onSubmit` callback its submitted values, validator outputs,
 * form API, and error helpers after submission validation succeeds.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorOutputs - Library-managed. Do not specify explicitly.
 */
export interface FormSubmitContext<
  TFormData,
  TValidatorOutputs extends readonly unknown[],
> extends BaseSubmitContext<TFormData> {
  /**
   * The form values captured when this submission started, without schema
   * transformations applied.
   *
   * Field edits made while submission is pending do not replace these values.
   * Read transformed validator results from `validatorOutputs`.
   */
  value: TFormData
  /**
   * The form handling this submission.
   *
   * @remarks
   * **Important:** A user may edit fields during submission. `value` and `formApi.state.values` may not
   * be equal.
   */
  formApi: FormApi<TFormData, ScopedErrorTypes<never, never>>
  /**
   * Outputs from this submission's form validators, in validators array order.
   *
   * - Standard Schemas provide their parsed output data automatically.
   * - Callback validators provide the payload returned with `createOutput`.
   * - Skipped validators contribute `undefined`.
   * - Outputs from earlier change, blur, or mount validation are not reused.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   validators: [
   *     {
   *       triggers: [],
   *       run: ({ createOutput, value }) =>
   *         createOutput({ displayName: value.name.trim() }),
   *     },
   *     { triggers: [], run: mySchema },
   *   ],
   *   onSubmit: async ({ validatorOutputs }) => {
   *     const [customData, schemaOutput] = validatorOutputs
   *     await saveProfile(customData.displayName, schemaOutput)
   *   },
   * })
   * ```
   */
  validatorOutputs: TValidatorOutputs
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
