import type { DeepKeys } from './deep-keys.public'
import type { FormApi, OnSubmitError } from './FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi/FieldApi.public'
import type { FormGroupApi } from './FormGroupApi/FormGroupApi.public'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from './standardSchema.public'
import type { OneOrMany } from './types.public'
import type { VALIDATION_OUTPUT } from './validationOutput.lib'

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
   * `true` to enable it for the current attempt.
   *
   * @default true
   */
  runOnSubmit?:
    boolean | ValidationPredicateFn<TFormData, TContextValue, TScope>
  /**
   * Whether this validator runs when the form is constructed or when its field
   * or form group first mounts.
   *
   * @default false
   */
  runOnMount?: boolean
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
   * Change and blur events that can run this validator, optionally with conditions.
   *
   * An empty array disables change and blur validation. Configure submission
   * separately with `runOnSubmit` and initial validation with `runOnMount`.
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
    : TValidator extends FormValidatorFn<infer TFormData>
      ? TFormData
      : TValidator extends ServerFormValidatorFn<infer TFormData>
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
/** Events configured through `triggers`. Submission is controlled by `runOnSubmit`. */
export type ConfigurableValidationTrigger = Exclude<ValidationTrigger, 'submit'>
/** Change and blur events accepted by shared validator configurations. */
export type ValidatorTrigger = ConfigurableValidationTrigger
/** The form, form group, or field whose value a validator checks. */
export type ValidatorScope = 'form' | 'group' | 'field'

/** Descendant field state available when deciding whether to show errors. */
export interface ErrorVisibilitySubfieldsMeta {
  /** `true` when no descendant field is marked as dirty. */
  isEveryPristine: boolean
  /** `true` when at least one descendant field is marked as dirty. */
  isSomeDirty: boolean
  /** `true` when at least one descendant field is marked as touched. */
  isSomeTouched: boolean
  /** `true` while at least one descendant field is validating. */
  isSomeValidating: boolean
}

/** Field state flags available to an error visibility policy. */
export interface ErrorVisibilityFieldMeta {
  /** `true` when this field or a descendant is marked as touched. */
  isTouched: boolean
  /** `true` when this field itself is marked as touched. */
  isSelfTouched: boolean
  /** `true` when this field or a descendant is marked as dirty. */
  isDirty: boolean
  /** `true` when this field itself is marked as dirty. */
  isSelfDirty: boolean
  /** `true` when neither this field nor its descendants are marked as dirty. */
  isPristine: boolean
  /** `true` when the current value equals the field's default value. */
  isDefaultValue: boolean
  /** `true` when this field is marked as blurred. */
  isBlurred: boolean
  /** `true` while this field or a descendant is validating. */
  isValidating: boolean
  /** `true` while this field itself is validating. */
  isSelfValidating: boolean
  /** State flags for this field's descendants. */
  subfields: ErrorVisibilitySubfieldsMeta
}

/** The field value and state flags available to an error visibility policy. */
export interface ErrorVisibilityFieldState {
  /** The current value of the field whose errors the policy controls. */
  value: any
  /** State flags before the visibility policy is applied. */
  meta: ErrorVisibilityFieldMeta
}

/**
 * Form and field state used to decide whether to show a field's errors.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface ErrorVisibilityContext<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /**
   * Current form state. For a field in a form group, flags and submission
   * counters describe that group. `values` and `errors` describe the whole form.
   */
  state: FormApi<TFormData, TFormErrorTypes>['state']
  /** The field whose errors the policy controls. */
  fieldState: ErrorVisibilityFieldState
}

/**
 * Returns `true` to show a field's validation errors in `field.errors`.
 *
 * Hidden errors remain available in `field.meta.original.errors`.
 *
 * For fields inside a form group, `state` properties such as `isTouched` and
 * `submissionAttempts` describe the containing group. `values` and `errors`
 * still describe the whole form.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type ErrorVisibility<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> = (context: ErrorVisibilityContext<TFormData, TFormErrorTypes>) => boolean

/**
 * Form or group state available to a reusable error visibility policy.
 *
 * `values` is `unknown` because the policy can be used with different form shapes.
 */
export type ReusableErrorVisibilityState = Omit<
  FormApi<any, any>['state'],
  'values'
> & {
  /** Current form values, without assuming a particular form shape. */
  values: unknown
}

/** State available to a visibility policy shared across different form shapes. */
export interface ReusableErrorVisibilityContext {
  /** Form state with group-scoped flags and counters for fields in a form group. */
  state: ReusableErrorVisibilityState
  /** The field whose errors the policy controls. */
  fieldState: ErrorVisibilityFieldState
}

/**
 * An error visibility policy that accepts forms with different value and error types.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type ReusableErrorVisibility = <
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
>(
  context: ErrorVisibilityContext<TFormData, TFormErrorTypes>,
) => boolean

/**
 * Creates an error visibility policy that can be shared across forms with different values.
 *
 * Use an inline `errorVisibility` callback instead when the policy needs
 * strongly typed access to the consuming form's `values`.
 *
 * @param visibility - Returns `true` to show the field's errors, or `false` to hide them.
 * @returns The policy to assign to a form or field's `errorVisibility` option.
 */
export function createErrorVisibility(
  visibility: (context: ReusableErrorVisibilityContext) => boolean,
): ReusableErrorVisibility {
  return visibility
}

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
  when?: boolean | ValidationPredicateFn<TFormData, TValue, TScope>
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
> = TTrigger | ValidationTriggerConfig<TFormData, TValue, TTrigger, TScope>

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
 * of `runOnSubmit`.
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
 * A validation error with a display message.
 */
export interface ValidationIssue {
  /** The text to display for this error. */
  message: string
}
/** An error supplied as an issue object or a string that becomes its `message`. */
export type ValidationErrorValue = ValidationIssue | string
/** One or more issue objects after string errors have been normalized. */
export type ValidationError = OneOrMany<ValidationIssue>
/** One or more errors accepted from a validator, including string messages. */
export type ValidationErrorInput = OneOrMany<ValidationErrorValue>

/**
 * Errors owned by a form or group and errors routed to its fields.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface ValidationErrorMap<in out TFormData> {
  /** Errors for the form or group that owns the validator. */
  form?: ValidationErrorInput
  /** Errors keyed by field path. Paths are relative to the group for group validators. */
  fields: Partial<Record<DeepKeys<TFormData>, ValidationErrorInput>>
}

/**
 * Creates a mutable map of form errors and errors for individual field paths.
 *
 * Pass the completed map back from a form or group validator to report the errors.
 *
 * @param initial - An existing map to reuse. A missing `fields` object is added to it.
 * @returns The initial map, if supplied, or a new map with an empty `fields` object.
 * @typeParam TFormData - The form or group value shape whose field paths are
 * accepted by the map. Specify it when calling this helper directly to restrict
 * `fields` to that shape's paths. Without a known value shape, field paths are
 * unrestricted. The validator context's `createErrorMap` already uses the form
 * or group shape and needs no type argument.
 */
export function createErrorMap<TFormData>(
  initial?: Partial<ValidationErrorMap<TFormData>>,
): ValidationErrorMap<TFormData> {
  if (!initial) return { fields: {} }

  initial.fields ??= {}
  return initial as ValidationErrorMap<TFormData>
}

/**
 * Creates a mutable error map with field paths inferred from the validator's value shape.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type CreateErrorMapFn<in out TFormData> =
  typeof createErrorMap<TFormData>

/**
 * Standard Schema issues reported at form or group scope and routed to field paths.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface ParsedStandardSchemaIssues<in out TFormData> {
  /** All supplied issues, including those with field paths. */
  form: Array<StandardSchemaV1Issue>
  /** Issues with paths, grouped by field path relative to the validator's value. */
  fields: Partial<Record<DeepKeys<TFormData>, Array<StandardSchemaV1Issue>>>
}

/**
 * Converts Standard Schema issues into errors owned by the field being validated.
 *
 * @returns A copy of the issue array. Issue paths do not route errors to other fields.
 */
export type ParseFieldIssuesFn = (
  issues: ReadonlyArray<StandardSchemaV1Issue>,
) => Array<StandardSchemaV1Issue>

/**
 * Converts Standard Schema issues into a form or group error map to return from a validator.
 *
 * @returns All issues in `form`, with issues that have paths also grouped in `fields`.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type ParseFormIssuesFn<TFormData> = (
  issues: ReadonlyArray<StandardSchemaV1Issue>,
) => ParsedStandardSchemaIssues<TFormData>

/**
 * A successful validation result that carries data for `validatorOutputs`.
 *
 * Return the result of the validator context's `createOutput` helper to provide
 * data during submission or server validation.
 *
 * @typeParam TOutput - Library-managed. Do not specify explicitly.
 */
export interface ValidationOutput<out TOutput> {
  readonly [VALIDATION_OUTPUT]: TOutput
}

/**
 * Creates a successful validation result with data for `validatorOutputs`.
 *
 * Return this result from a form or group validator. The payload appears at that
 * validator's index during submission or server validation and is forwarded
 * without mutation. Outputs from change, blur, and mount validation are **not**
 * retained for later submission.
 *
 * @param value - The payload to expose at this validator's index.
 * @returns A successful validator result containing the original payload.
 * @typeParam TOutput - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```ts
 * formOptions({
 *   defaultValues: { name: '' },
 *   validators: [{
 *     triggers: [],
 *     run: ({ value, createOutput }) => createOutput(value.name.trim()),
 *   }],
 *   onSubmit: ({ validatorOutputs }) => {
 *     const trimmedName = validatorOutputs[0]
 *     // ...
 *   },
 * })
 * ```
 */
export type CreateOutputFn = <TOutput>(
  value: TOutput,
) => ValidationOutput<TOutput>

/**
 * Values and helpers passed to a form validation function.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FormValidatorContext<in out TFormData> {
  /** The event that caused this validation run. */
  event: ValidationTrigger | ServerValidationTrigger
  /** Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`. */
  signal: AbortSignal
  /** The owning form on the client. `undefined` during server validation. */
  formApi: FormApi<TFormData, any> | undefined
  /** The field that caused validation, when available. */
  triggerFieldApi?: AnyFieldApi
  /** The complete form values being validated. */
  value: TFormData
  /** Converts Standard Schema issues into form and field errors to return from this validator. */
  parseIssues: ParseFormIssuesFn<TFormData>
  /** Creates an error map with field paths inferred from the form values. */
  createErrorMap: CreateErrorMapFn<TFormData>
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
  /** Converts Standard Schema issues into form and field errors to return from this validator. */
  parseIssues: ParseFormIssuesFn<TFormData>
  /** Creates an error map with field paths inferred from the form values. */
  createErrorMap: CreateErrorMapFn<TFormData>
  /** Creates a successful result to return data in this validator's server `validatorOutputs` entry. */
  createOutput: CreateOutputFn
}

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
 * Errors for a form, optionally including errors routed to individual fields.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type FormValidationError<TFormData> =
  ValidationErrorInput | ValidationErrorMap<TFormData>
/**
 * A form validator's success result, output data, or validation errors.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type FormValidateResult<TFormData> =
  SuccessfulValidationResult | FormValidationError<TFormData>

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
 * Validates complete form values and can return form errors, field errors, or output data.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type FormValidatorFn<TFormData> = ValidatorFn<
  FormValidatorContext<TFormData>,
  FormValidateResult<TFormData>
>

/**
 * Validates submitted form values on the server without a client form instance.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type ServerFormValidatorFn<TFormData> = ValidatorFn<
  ServerFormValidatorContext<TFormData>,
  FormValidateResult<TFormData>
>

/**
 * Configures validation of complete form values on the client or server.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FormValidator<in out TFormData> extends BaseValidator<
  FormValidatorFn<TFormData> | StandardSchemaV1<TFormData, any>
> {
  /**
   * Whether this validator runs during a client submission attempt, independently of `triggers`.
   *
   * Pass a boolean to enable or disable it, or pass a function that returns
   * `true` to enable it for the current attempt.
   *
   * @default true
   */
  runOnSubmit?: boolean | ValidationPredicateFn<TFormData, TFormData, 'form'>
  /**
   * Whether this validator runs when the form is constructed.
   *
   * @default false
   */
  runOnMount?: boolean
  /**
   * The delay in milliseconds before validation runs for change or blur events.
   *
   * Pass a number for a fixed delay, or pass a function that returns the delay
   * for the current event. Repeated events restart the delay.
   * Submission and server validation run immediately.
   *
   * @default 0
   */
  triggerDebounceMs?:
    number | ValidationDebounceFn<TFormData, TFormData, 'form'>
  /**
   * Change and blur events that can run this validator, optionally with conditions.
   * Add `'server'` to include it in `serverValidate`.
   *
   * An empty array disables change, blur, and server validation. Configure client
   * submission separately with `runOnSubmit` and initial validation with `runOnMount`.
   */
  triggers: Array<FormValidationTriggerOption<TFormData, TFormData, 'form'>>
}

/**
 * Form validators in configuration order, which also determines their `validatorOutputs` indexes.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type FormValidators<TFormData> = ReadonlyArray<FormValidator<TFormData>>

/**
 * Values and helpers passed to a form group validation function.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export interface FormGroupValidatorContext<in out TGroupValue> {
  /** The event that caused this validation run. */
  event: ClientValidationTrigger
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
  /** Converts Standard Schema issues into group errors and errors at group-relative field paths. */
  parseIssues: ParseFormIssuesFn<TGroupValue>
  /** Creates an error map whose field paths are relative to this group. */
  createErrorMap: CreateErrorMapFn<TGroupValue>
  /** Creates a successful result to return data in this validator's `validatorOutputs` entry. */
  createOutput: CreateOutputFn
}

/**
 * Errors for a form group, optionally including errors at group-relative field paths.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export type FormGroupValidationError<TGroupValue> =
  ValidationErrorInput | ValidationErrorMap<TGroupValue>
/**
 * A form group validator's success result, output data, or validation errors.
 *
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 */
export type FormGroupValidateResult<TGroupValue> =
  SuccessfulValidationResult | FormGroupValidationError<TGroupValue>

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
  event: ClientValidationTrigger
  /** Aborted when this run is cancelled. Pass it to asynchronous work such as `fetch`. */
  signal: AbortSignal
  /** The owning form. Read other field values here for cross-field validation. */
  formApi: FormApi<TFormData, any>
  /** The field being validated, including when a watched field caused the event. */
  fieldApi: FieldApi<TFieldName, TFieldValue, any, TFormData, any>
  /** The current value of the field being validated. */
  value: TFieldValue
  /** Converts Standard Schema issues into errors for this field, without routing their paths. */
  parseIssues: ParseFieldIssuesFn
}

/** A field validator's success result or errors. Field validators do not provide output data. */
export type FieldValidateResult = ValidationResult

/**
 * Validates a field's value and reports errors owned by that field.
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
  : TResult extends ValidationErrorMap<any>
    ? TTarget extends 'form'
      ? TResult extends { form?: infer TError }
        ? NormalizeValidationResult<TError>
        : never
      : TResult extends { fields: infer TFields }
        ? NormalizeValidationResult<TFields[keyof TFields]>
        : never
    : NormalizeValidationResult<TResult>

/**
 * Inferred issue types for errors owned by a form or group and errors routed to its fields.
 *
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 * @typeParam TFieldError - Library-managed. Do not specify explicitly.
 */
export interface FormErrorTypes<
  out TFormError = ValidationIssue,
  out TFieldError = ValidationIssue,
> {
  /** The issue type stored in the form or group's `state.errors`. */
  readonly formError: TFormError
  /** The issue type routed from form or group validation to individual fields. */
  readonly fieldError: TFieldError
}

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

type ExtractFormError<TFormErrorTypes extends FormErrorTypes> =
  unknown extends TFormErrorTypes['formError']
    ? ValidationIssue
    : TFormErrorTypes['formError']

type ExtractFormFieldError<TFormErrorTypes extends FormErrorTypes> =
  unknown extends TFormErrorTypes['fieldError']
    ? never
    : TFormErrorTypes['fieldError']

/**
 * The form or group's error array, with string messages normalized to issue objects.
 *
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type FormErrors<TFormErrorTypes extends FormErrorTypes> = Array<
  ExtractFormError<TFormErrorTypes>
>

/**
 * A field's error array, with string messages normalized to issue objects.
 *
 * @typeParam TFieldError - Library-managed. Do not specify explicitly.
 */
export type FieldErrors<TFieldError> = Array<
  unknown extends TFieldError ? ValidationIssue : TFieldError
>

type ValidationErrorValueFromType<TError> = unknown extends TError
  ? ValidationErrorValue
  : | Extract<TError, ValidationIssue>
    | (ValidationIssue extends TError ? string : never)

type ValidationErrorInputFromType<TError> = [TError] extends [never]
  ? never
  : OneOrMany<ValidationErrorValueFromType<TError>>

/**
 * Form validation results constrained to inferred issue types, as stored in server form state.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type FormValidateResultFromErrorTypes<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> =
  | ValidValidationResult
  | ValidationErrorInputFromType<TFormErrorTypes['formError']>
  | {
      form?: ValidationErrorInputFromType<TFormErrorTypes['formError']>
      fields: Partial<
        Record<
          DeepKeys<TFormData>,
          ValidationErrorInputFromType<TFormErrorTypes['fieldError']>
        >
      >
    }

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
        : TResult extends ValidationErrorMap<any>
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
    ? TValidator extends { readonly runOnSubmit: infer TRunOnSubmit }
      ? [TRunOnSubmit] extends [false]
        ? undefined // User explicitly set runOnSubmit: false -> guaranteed undefined
        : TRunOnSubmit extends (...args: Array<any>) => boolean
          ? TOutput | undefined // Callback could dynamically be true or false -> union
          : false extends TRunOnSubmit
            ? TOutput | undefined // the explicit variable is boolean, so also dynamic -> union
            : TOutput
      : TOutput // default, which is guaranteed present
    : never

type ValidatorTriggers<TValidator> = TValidator extends {
  readonly triggers: infer TTriggers
}
  ? TTriggers extends ReadonlyArray<unknown>
    ? TTriggers[number]
    : never
  : never

type HasServerTrigger<TValidator> =
  ServerValidationTrigger extends ValidatorTriggers<TValidator> ? true : false

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
 * Infers submission output slots from form validators in configuration order.
 *
 * Slots contain Standard Schema outputs or payloads returned through `createOutput`.
 * Validators disabled for submission have `undefined` slots. Conditional
 * submission or success without output can also make a slot `undefined`.
 *
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 */
export type ToFormOutputs<TFormValidators extends FormValidators<any>> =
  ToOutputs<TFormValidators, FormValidators<any>>

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

type ToValidatorErrorTypes<
  TValidators extends ReadonlyArray<unknown>,
  TBroadValidators extends ReadonlyArray<unknown>,
  TSubmitReturn,
> = FormErrorTypes<
  | ExtractValidatorFormError<TValidators, TBroadValidators>
  | ExtractSubmitFormError<TSubmitReturn>,
  | ExtractValidatorFieldError<TValidators, TBroadValidators>
  | ExtractSubmitFieldError<TSubmitReturn>
>

/**
 * Infers form and routed field issue types from validators and submission validation errors.
 *
 * String errors become `ValidationIssue` objects. Successful output payloads
 * are excluded from error types.
 *
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
 */
export type ToFormErrorTypes<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = ToValidatorErrorTypes<TFormValidators, FormValidators<any>, TSubmitReturn>

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
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type ToFieldError<
  TFieldValidators extends FieldValidators<any, any, any>,
  TGroupFieldError,
  TFormErrorTypes extends FormErrorTypes,
> = FallbackToValidationIssue<
  | ExtractValidatorFieldError<TFieldValidators, FieldValidators<any, any, any>>
  | (unknown extends TGroupFieldError ? never : TGroupFieldError)
  | ExtractFormFieldError<TFormErrorTypes>
>

type MappedServerFormValidators<
  in out TFormValidators extends FormValidators<any>,
> = {
  [K in keyof TFormValidators]: HasServerTrigger<
    TFormValidators[K]
  > extends true
    ? TFormValidators[K]
    : never
}

/**
 * Infers form and field issue types from validators with a `'server'` trigger.
 *
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 */
export type ToServerFormErrorTypes<
  TFormValidators extends FormValidators<any>,
> = unknown extends TFormValidators
  ? FormErrorTypes
  : FormValidators<any> extends TFormValidators
    ? FormErrorTypes
    : ToFormErrorTypes<MappedServerFormValidators<TFormValidators>, never>

type MappedServerOutputs<in out TFormValidators extends FormValidators<any>> = {
  [K in keyof TFormValidators]: HasServerTrigger<
    TFormValidators[K]
  > extends true
    ? TryGetOutput<TFormValidators[K]>
    : undefined
}

/**
 * Infers server validation output slots in form validator configuration order.
 *
 * Validators without a `'server'` trigger have `undefined` slots. Server
 * selection is independent of `runOnSubmit`.
 *
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 */
export type ToServerFormOutputs<TFormValidators extends FormValidators<any>> =
  unknown extends TFormValidators
    ? Array<unknown>
    : FormValidators<any> extends TFormValidators
      ? Array<unknown>
      : MappedServerOutputs<TFormValidators>
