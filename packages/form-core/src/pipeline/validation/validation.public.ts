import type { StandardSchemaV1 } from '../../validation/results/standardSchema.public'
import type { FormApi } from '../../FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from '../../FieldApi/FieldApi.public'
import type { FormGroupApi } from '../../FormGroupApi/FormGroupApi.public'
import type {
  CreateErrorMapFn,
  CreateOutputFn,
  FieldValidateResult,
  FormGroupValidateResult,
  ParseIssuesFn,
  SuccessfulValidationResult,
  ValidationErrorMap,
  ValidationIssue,
  ValidationOutput,
} from '../../validation/results/results.public'
import type { DeepKeys } from '../../deep-keys.public'

/**
 * A validation function or Standard Schema with an optional rule to stop after earlier failures.
 *
 * @typeParam TValidator - Library-managed. Do not specify explicitly.
 */
export interface BaseValidator<
  out TValidator extends StandardSchemaV1 | ValidatorFn<any, any>,
> {
  /** The function or Standard Schema that validates the value in this validator's scope. */
  run: TValidator
  /**
   * If `true`, skips this and subsequent validators when earlier validation has failed.
   *
   * If `false`, earlier failures do not prevent this validator from running.
   *
   * @default false
   */
  bailIfInvalid?: boolean
}

/**
 * Configures validation for a form, form group, or field.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidator - Library-managed. Do not specify explicitly.
 * @typeParam TContextValue - Library-managed. Do not specify explicitly.
 * @typeParam TTrigger - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export interface Validator<
  in out TFormData,
  out TValidator extends StandardSchemaV1 | ValidatorFn<any, any>,
  in out TContextValue,
  in out TTrigger extends ValidatorTrigger = ValidatorTrigger,
  in out TScope extends ValidatorScope = ValidatorScope,
> extends BaseValidator<TValidator> {
  /**
   * Whether this validator runs during a submission attempt, independently of `triggers`.
   *
   * Pass a boolean to enable or disable it, or pass a function that returns
   * `true` to skip it for the current attempt.
   *
   * @default false
   */
  skipOnSubmit?:
    boolean | ValidationPredicateFn<TFormData, TContextValue, TScope>
  /**
   * The delay in milliseconds before validation runs for change or blur events.
   *
   * Pass a number for a fixed delay, or pass a function that returns the delay
   * for the current event. Repeated events restart the delay.
   * Submission validation runs immediately.
   *
   * @default 0
   */
  triggerDebounceMs?:
    number | ValidationDebounceFn<TFormData, TContextValue, TScope>
  /**
   * Mount, change, and blur events that can run this validator, optionally with conditions.
   *
   * An empty array disables mount, change, and blur validation. Configure
   * submission separately with `skipOnSubmit`.
   */
  triggers: Array<
    ValidationTriggerOption<TFormData, TContextValue, TTrigger, TScope>
  >
}

/**
 * Reusable scheduling and failure-handling options for `createValidator` or `createValidators`.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TContextValue - Library-managed. Do not specify explicitly.
 * @typeParam TTrigger - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export type ValidatorOptions<
  TFormData,
  TContextValue,
  TTrigger extends ValidatorTrigger = ValidatorTrigger,
  TScope extends ValidatorScope = ValidatorScope,
> = Omit<
  Validator<
    TFormData,
    StandardSchemaV1<any, any> | ValidatorFn<any, any>,
    TContextValue,
    TTrigger,
    TScope
  >,
  'run' | 'triggers'
> & {
  triggers: Array<FormValidationTriggerOption<TFormData, TContextValue, TScope>>
}

type ValidatorRun = StandardSchemaV1<any, any> | ValidatorFn<any, any>

type ValidatorWithRun<
  TFormData,
  TContextValue,
  TOptions extends ValidatorOptions<TFormData, TContextValue, any>,
  TRun extends ValidatorRun,
> = TOptions & Pick<Validator<TFormData, TRun, TContextValue>, 'run'>

type InferFormDataFromValidator<TValidator extends ValidatorRun> =
  TValidator extends StandardSchemaV1<infer TFormData, any>
    ? TFormData
    : TValidator extends FormGroupValidatorFn<infer TGroupValue>
      ? TGroupValue
      : any

/**
 * A validator created by combining reusable options with a validation function
 * or Standard Schema through `createValidator`.
 *
 * @typeParam TOptions - Library-managed. Do not specify explicitly.
 * @typeParam TRun - Library-managed. Do not specify explicitly.
 */
export type CreatedValidator<
  TOptions extends ValidatorOptions<any, any>,
  TRun extends ValidatorRun,
> = ValidatorWithRun<
  InferFormDataFromValidator<TRun>,
  InferFormDataFromValidator<TRun>,
  TOptions,
  TRun
>

type ValidatorRunsFromOptions<
  in out TOptions extends readonly [
    ValidatorOptions<any, any, any>,
    ...Array<ValidatorOptions<any, any, any>>,
  ],
> = {
  readonly [TIndex in keyof TOptions]: ValidatorRun
}

type ValidatorsFromOptionsAndRuns<
  in out TFormData,
  in out TContextValue,
  in out TOptions extends readonly [
    ValidatorOptions<TFormData, TContextValue, any>,
    ...Array<ValidatorOptions<TFormData, TContextValue, any>>,
  ],
  in out TRuns extends ValidatorRunsFromOptions<TOptions>,
> = {
  readonly [TIndex in keyof TOptions]: ValidatorWithRun<
    TFormData,
    TContextValue,
    TOptions[TIndex],
    TRuns[TIndex]
  >
}

/**
 * Creates a reusable configuration to apply to validation functions or Standard Schemas.
 *
 * @returns A function that combines `options` with its `run` argument, preserving
 * the validator's inferred types. Its `TValidator` type argument is library-managed.
 * Do not specify it explicitly.
 * @typeParam TOptions - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```ts
 * const afterSubmit = createValidator({
 *   triggers: [{
 *     trigger: 'change',
 *     when: ({ formApi }) => formApi.state.submissionAttempts > 0,
 *   }],
 * })
 * const validators = [afterSubmit(schema)]
 * ```
 */
export function createValidator<
  const TOptions extends ValidatorOptions<any, any>,
>(
  options: TOptions,
): <const TValidator extends ValidatorRun>(
  run: TValidator,
) => CreatedValidator<TOptions, TValidator> {
  return (run: ValidatorRun) => ({ ...options, run }) as never
}

/**
 * Creates a reusable configuration for an ordered set of validators.
 *
 * @param options - A nonempty tuple of configurations, one per validator.
 * @returns A function that accepts one validation function or Standard Schema
 * per configuration, in the same order. Its `TRuns` type argument is library-managed.
 * Do not specify it explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TContextValue - Library-managed. Do not specify explicitly.
 * @typeParam TOptions - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```ts
 * const withChecks = createValidators([
 *   { triggers: ['change'] },
 *   { triggers: ['blur'], bailIfInvalid: true },
 * ])
 * const validators = withChecks(schema, () => 'Additional check failed')
 * ```
 */
export function createValidators<
  TFormData = any,
  TContextValue = TFormData,
  const TOptions extends readonly [
    ValidatorOptions<TFormData, TContextValue>,
    ...Array<ValidatorOptions<TFormData, TContextValue>>,
  ] = readonly [
    ValidatorOptions<TFormData, TContextValue>,
    ...Array<ValidatorOptions<TFormData, TContextValue>>,
  ],
>(
  options: TOptions,
): <const TRuns extends ValidatorRunsFromOptions<TOptions>>(
  ...runs: TRuns
) => ValidatorsFromOptionsAndRuns<TFormData, TContextValue, TOptions, TRuns> {
  return (...runs) =>
    runs.map((run, index) => ({
      ...options[index],
      run,
    })) as ValidatorsFromOptionsAndRuns<
      TFormData,
      TContextValue,
      TOptions,
      typeof runs
    >
}

/** Client validation events: value changes, field blur, and submission attempts. */
export type ValidationTrigger = 'change' | 'blur' | 'submit'
/** Selects a form validator for execution by `serverValidate`. */
export type ServerValidationTrigger = 'server'
/** Events reported to client-side validation callbacks. */
export type ClientValidationTrigger = ValidationTrigger
/** Events configured through `triggers`. Submission is controlled by `skipOnSubmit`. */
export type ConfigurableValidationTrigger =
  Exclude<ValidationTrigger, 'submit'> | 'mount'
/** Mount, change, and blur events accepted by shared validator configurations. */
export type ValidatorTrigger = ConfigurableValidationTrigger
/** The form, form group, or field whose value a validator checks. */
export type ValidatorScope = 'form' | 'group' | 'field'

interface BaseValidationPredicateContext<
  in out TFormData,
  out TValue,
  out TScope extends ValidatorScope,
> {
  /** Identifies whether `value` belongs to a form, form group, or field. */
  scope: TScope
  /** The owning form, including its complete values and state. */
  formApi: FormApi<TFormData, any>
  /**
   * The field associated with the validation event, when available.
   *
   * For form and group validators, this is the field that triggered the
   * validation. For field validators, this is the field being validated.
   */
  fieldApi?: AnyFieldApi
  /** The current value in this validator's scope when the callback is evaluated. */
  value: TValue
}

/**
 * Current form state available to validator conditions and delay callbacks.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FormValidationPredicateContext<
  in out TFormData,
> extends BaseValidationPredicateContext<TFormData, TFormData, 'form'> {
  groupApi?: never
}

/**
 * Current form group state available to validator conditions and delay callbacks.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export interface FormGroupValidationPredicateContext<
  in out TGroupValue,
> extends BaseValidationPredicateContext<any, TGroupValue, 'group'> {
  /** The form group whose value is being validated. */
  groupApi: FormGroupApi<any, any, TGroupValue, any, any>
}

/**
 * Current field state available to validator conditions and delay callbacks.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 */
export interface FieldValidationPredicateContext<
  in out TFormData,
  out TFieldValue,
> extends BaseValidationPredicateContext<TFormData, TFieldValue, 'field'> {
  groupApi?: never
  /** The field being validated. */
  fieldApi: AnyFieldApi
}

/**
 * Context for validator conditions and delay callbacks, narrowed by `scope`.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export type ValidationPredicateContext<
  TFormData,
  TValue,
  TScope extends ValidatorScope = ValidatorScope,
> = TScope extends 'form'
  ? FormValidationPredicateContext<TFormData>
  : TScope extends 'group'
    ? FormGroupValidationPredicateContext<TValue>
    : TScope extends 'field'
      ? FieldValidationPredicateContext<TFormData, TValue>
      : never

/**
 * Returns `true` to enable validation for the current event or submission attempt.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export type ValidationPredicateFn<
  in out TFormData,
  in out TValue,
  in TScope extends ValidatorScope = ValidatorScope,
> = (context: ValidationPredicateContext<TFormData, TValue, TScope>) => boolean

/**
 * Chooses the delay in milliseconds before change or blur validation runs.
 *
 * @returns The delay for the current event. Zero or a negative value runs validation immediately.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export type ValidationDebounceFn<
  in out TFormData,
  in out TValue,
  in TScope extends ValidatorScope = ValidatorScope,
> = (context: ValidationPredicateContext<TFormData, TValue, TScope>) => number

/**
 * A change or blur event with an optional condition for running validation.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TTrigger - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export interface ValidationTriggerConfig<
  in out TFormData,
  in out TValue,
  in out TTrigger extends ValidatorTrigger = ValidatorTrigger,
  in TScope extends ValidatorScope = ValidatorScope,
> {
  /** The event to match before evaluating `when`. */
  trigger: TTrigger
  /**
   * Whether this trigger enables validation when its event occurs.
   *
   * Pass a boolean to enable or disable it, or pass a function that returns
   * `true` to enable it for the current event.
   *
   * @default true
   */
  when?:
    | boolean
    | (TTrigger extends 'mount'
        ? never
        : ValidationPredicateFn<TFormData, TValue, TScope>)
}

/**
 * A validation event, either unconditional or configured with a `when` condition.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TTrigger - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export type ValidationTriggerOption<
  TFormData,
  TValue,
  TTrigger extends ValidatorTrigger = ValidatorTrigger,
  TScope extends ValidatorScope = ValidatorScope,
> = TTrigger extends ValidatorTrigger
  ? TTrigger | ValidationTriggerConfig<TFormData, TValue, TTrigger, TScope>
  : never

/**
 * A change or blur trigger, optionally enabled by a condition.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export type ClientValidationTriggerOption<
  TFormData,
  TValue,
  TScope extends ValidatorScope = ValidatorScope,
> = ValidationTriggerOption<
  TFormData,
  TValue,
  ConfigurableValidationTrigger,
  TScope
>

/**
 * A client event with an optional condition, or the `'server'` event for a form validator.
 *
 * Server validation selects validators with a `'server'` trigger independently
 * of `skipOnSubmit`.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TScope - Library-managed. Do not specify explicitly.
 */
export type FormValidationTriggerOption<
  TFormData,
  TValue,
  TScope extends ValidatorScope = ValidatorScope,
> =
  | ClientValidationTriggerOption<TFormData, TValue, TScope>
  | ServerValidationTrigger

/**
 * Values and helpers passed to a form validation function.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FormValidatorContext<in out TFormData> {
  /** The event that caused this validation run. */
  event: ValidationTrigger | ServerValidationTrigger | 'mount'
  /** Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`. */
  signal: AbortSignal
  /** The owning form on the client. `undefined` during server validation. */
  formApi: FormApi<TFormData, any> | undefined
  /** The field that caused validation, when available. */
  triggerFieldApi?: AnyFieldApi
  /** The complete form values being validated. */
  value: TFormData
  /** Builds a mutable error map from optional form and field errors. */
  createErrorMap: CreateErrorMapFn<TFormData>
  /** Converts Standard Schema issues into a mutable error map using the form values. */
  parseIssues: ParseIssuesFn<TFormData>
  /** Creates a successful result to return data in this validator's `validatorOutputs` entry. */
  createOutput: CreateOutputFn
}

/**
 * Values and helpers passed to a server form validation function.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface ServerFormValidatorContext<in out TFormData> {
  /** The validation event. `serverValidate` supplies `'server'`. */
  event: ValidationTrigger | ServerValidationTrigger
  /** Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`. */
  signal: AbortSignal
  /** `undefined` during server validation, where no client form instance exists. */
  formApi: FormApi<TFormData, any> | undefined
  /** Absent during server validation, which is not triggered by a client field. */
  triggerFieldApi?: AnyFieldApi
  /** The complete form values passed to server validation. */
  value: TFormData
  /** Builds a mutable error map from optional form and field errors. */
  createErrorMap: CreateErrorMapFn<TFormData>
  /** Converts Standard Schema issues into a mutable error map using the server values. */
  parseIssues: ParseIssuesFn<TFormData>
  /** Creates a successful result to return data in this validator's server `validatorOutputs` entry. */
  createOutput: CreateOutputFn
}

/**
 * A validation callback that can return a result immediately or asynchronously.
 *
 * @typeParam TParameter - Library-managed. Do not specify explicitly.
 * @typeParam TReturn - Library-managed. Do not specify explicitly.
 */
export type ValidatorFn<in TParameter, out TReturn> = (
  ...args: Array<TParameter>
) => TReturn | Promise<TReturn>

/**
 * Values and helpers passed to a form group validation function.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export interface FormGroupValidatorContext<in out TGroupValue> {
  /** The event that caused this validation run. */
  event: ClientValidationTrigger | 'mount'
  /** Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`. */
  signal: AbortSignal
  /** The owning form, including values outside this group. */
  formApi: FormApi<any, any>
  /** The group whose value is being validated. */
  groupApi: FormGroupApi<any, any, TGroupValue, any, any>
  /** The field that caused validation, when available. */
  triggerFieldApi?: AnyFieldApi
  /** The group's current value, without the surrounding form values. */
  value: TGroupValue
  /** Builds a mutable error map from optional group errors and errors at group-relative field paths. */
  createErrorMap: CreateErrorMapFn<TGroupValue>
  /** Converts Standard Schema issues into a mutable error map using the group's values and field paths. */
  parseIssues: ParseIssuesFn<TGroupValue>
  /** Creates a successful result to return data in this validator's `validatorOutputs` entry. */
  createOutput: CreateOutputFn
}

/**
 * Validates a group's value and can return group errors, field errors, or output data.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export type FormGroupValidatorFn<TGroupValue> = ValidatorFn<
  FormGroupValidatorContext<TGroupValue>,
  FormGroupValidateResult<TGroupValue>
>

/**
 * Configures validation of a form group's value.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export interface FormGroupValidator<in out TGroupValue> extends Validator<
  TGroupValue,
  FormGroupValidatorFn<TGroupValue> | StandardSchemaV1<TGroupValue, any>,
  TGroupValue,
  ConfigurableValidationTrigger,
  'group'
> {}

/**
 * Group validators in configuration order, which also determines their `validatorOutputs` indexes.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export type FormGroupValidators<TGroupValue> = ReadonlyArray<
  FormGroupValidator<TGroupValue>
>

/**
 * Values and helpers passed to a field validation function.
 *
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FieldValidatorContext<
  in out TFieldName,
  in out TFieldValue,
  in out TFormData,
> {
  /** The event that caused this validation run. */
  event: ClientValidationTrigger | 'mount'
  /** Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`. */
  signal: AbortSignal
  /** The owning form. Read other field values here for cross-field validation. */
  formApi: FormApi<TFormData, any>
  /** The field being validated, including when a watched field caused the event. */
  fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>
  /** The current value of the field being validated. */
  value: TFieldValue
}

/**
 * Validates a field's value and reports errors owned by that field.
 *
 * Standard Schema issue arrays can be returned directly, including readonly
 * arrays. Issue paths do not route errors to other fields.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 */
export type FieldValidatorFn<TFormData, TFieldName, TFieldValue> = ValidatorFn<
  FieldValidatorContext<TFieldName, TFieldValue, TFormData>,
  FieldValidateResult
>

/**
 * Configures validation of a field's value, optionally reacting to related fields.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 */
export interface FieldValidator<
  in out TFormData,
  in out TFieldName,
  in out TFieldValue,
> extends Validator<
  TFormData,
  | FieldValidatorFn<TFormData, TFieldName, TFieldValue>
  | StandardSchemaV1<TFieldValue, any>,
  TFieldValue,
  ConfigurableValidationTrigger,
  'field'
> {
  /**
   * Other field paths whose change or blur events can run this validator.
   *
   * Events must still match an enabled entry in `triggers`. The validator
   * receives its own field's value, even when a watched field caused the event.
   */
  watchFields?: Array<DeepKeys<TFormData>>
}

/**
 * Field validators in configuration order.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 */
export type FieldValidators<TFormData, TFieldName, TFieldValue> = ReadonlyArray<
  FieldValidator<TFormData, TFieldName, TFieldValue>
>

// Scalars and branded returns share the runtime success classification. Error
// collections additionally allow success when they contain no stored errors.
type SuccessWithoutOutput<TResult> =
  TResult extends SuccessfulValidationResult | void
    ? TResult extends ValidationOutput<unknown>
      ? never
      : undefined
    : TResult extends ReadonlyArray<unknown>
      ? [] extends TResult
        ? undefined
        : never
      : TResult extends ValidationIssue
        ? never
        : TResult extends ValidationErrorMap<any, any, any>
          ? TResult extends { form: infer TForm }
            ? [SuccessWithoutOutput<TForm>] extends [never]
              ? never
              : ErrorMapSuccess<TResult['fields']>
            : ErrorMapSuccess<TResult['fields']>
          : never

type RequiredErrorKeys<TFields> = {
  [K in keyof TFields]-?: {} extends Pick<TFields, K>
    ? never
    : [SuccessWithoutOutput<TFields[K]>] extends [never]
      ? K
      : never
}[keyof TFields]

type ErrorMapSuccess<TFields> = [RequiredErrorKeys<TFields>] extends [never]
  ? undefined
  : never

type OutputFromReturn<TReturn> = unknown extends TReturn
  ? unknown
  : [Extract<TReturn, ValidationOutput<unknown>>] extends [never]
    ? undefined
    : | (TReturn extends ValidationOutput<infer TOutput> ? TOutput : never)
      | SuccessWithoutOutput<TReturn>

type TryGetOutput<TValidator> = TValidator extends {
  readonly run: StandardSchemaV1<any, infer TOutput>
}
  ? TOutput
  : TValidator extends { readonly run: (...args: any) => infer TReturn }
    ? OutputFromReturn<Awaited<TReturn>>
    : undefined

type TryGetSubmitOutput<TValidator> =
  TryGetOutput<TValidator> extends infer TOutput
    ? TValidator extends { readonly skipOnSubmit: infer TSkipOnSubmit }
      ? [TSkipOnSubmit] extends [true]
        ? undefined // User explicitly set skipOnSubmit: true -> guaranteed undefined
        : TSkipOnSubmit extends (...args: Array<any>) => boolean
          ? TOutput | undefined // Callback could dynamically be true or false -> union
          : true extends TSkipOnSubmit
            ? TOutput | undefined // the explicit variable is boolean, so also dynamic -> union
            : TOutput
      : TOutput // default, which is guaranteed present
    : never

type MappedOutputs<in out TValidators extends ReadonlyArray<unknown>> = {
  [K in keyof TValidators]: TValidators[K] extends {
    readonly run: any
  }
    ? TryGetSubmitOutput<TValidators[K]>
    : never
}

type ToOutputs<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
> = unknown extends TValidators
  ? Array<unknown>
  : TBroadValidators extends TValidators
    ? Array<unknown>
    : MappedOutputs<TValidators>

/**
 * Infers submission output slots from group validators in configuration order.
 *
 * Slots contain Standard Schema outputs or payloads returned through `createOutput`.
 * Validators disabled for submission have `undefined` slots. Conditional
 * submission or success without output can also make a slot `undefined`.
 *
 * @typeParam TGroupValidators - Library-managed. Do not specify explicitly.
 */
export type ToFormGroupOutputs<
  TGroupValidators extends FormGroupValidators<any>,
> = ToOutputs<TGroupValidators, FormGroupValidators<any>>
