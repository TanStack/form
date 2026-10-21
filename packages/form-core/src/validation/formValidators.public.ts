import type { AnyFieldApi } from '../FieldApi/FieldApi.public'
import type {
  ClientSideEvents,
  DynamicValidatorTriggers,
  PreprocessEvents,
  ServerSideEvents,
  StaticValidatorTriggers,
  ValidatorEvents,
  ValidatorTriggers,
} from '../events.public'
import type { StandardSchemaV1 } from '../standardSchema.public'
import type {
  CreateErrorMapFn,
  CreateOutputFn,
  FormValidationResult,
  ParseIssuesFn,
} from './state.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type { Awaitable } from '../types.public'

// ===================================
// `run: () => {}` Context data

/**
 * Shared helpers for returning form validation errors or successful output data.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
interface BaseFormValidatorContext<TFormData> {
  /**
   * Builds a mutable error map for the form and its field paths from optional
   * initial errors. Return the created map to report its errors.
   *
   * Returning an empty error map is considered successful validation.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '', email: '' },
   *   validators: [
   *     {
   *       run: ({ createErrorMap, value }) => {
   *         // Return a map directly.
   *         if (value.name.trim().length > 0) return;
   *         return createErrorMap({
   *           form: 'Please check your details',
   *           fields: { name: 'Name is required' },
   *         });
   *       },
   *     },
   *     {
   *       run: ({ createErrorMap, value }) => {
   *         // Collect errors before returning the map.
   *         const errors = createErrorMap()
   *
   *         if (value.name.trim().length === 0) {
   *           errors.fields.name = 'Name is required'
   *         }
   *         if (value.email.trim().length === 0) {
   *           errors.fields.email = 'Email is required'
   *         }
   *
   *         return errors
   *       },
   *     },
   *   ],
   * })
   * ```
   */
  createErrorMap: CreateErrorMapFn<TFormData>
  /**
   * Converts Standard Schema issues into a mutable error map. All issues appear
   * in `form`, and issues with paths are also grouped in `fields` using the
   * values being validated. Return the map to report its errors.
   *
   * @example
   * ```ts
   * run: ({ value, parseIssues }) => {
   *   const result = schema.safeParse(value)
   *   if (!result.success) {
   *     return parseIssues(result.error.issues)
   *   }
   * }
   * ```
   */
  parseIssues: ParseIssuesFn<TFormData>
  /**
   * Use this to return custom data when validation succeeds. The data is
   * available in `validatorOutputs` during submission or server validation.
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
   *       run: mySchema
   *     }
   *   ],
   *   onSubmit: ({ validatorOutputs }) => {
   *     // Outputs follow the same order as the validators array.
   *     const [customData, schemaOutput] = validatorOutputs
   *     console.log(customData.displayName)
   *   },
   * })
   * ```
   */
  createOutput: CreateOutputFn
}

/**
 * Form values and result helpers passed to a validator during server validation.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TEvents - Library-managed. Do not specify explicitly.
 */
export interface FormValidatorServerContext<
  TFormData,
  TEvents extends ServerSideEvents,
> extends BaseFormValidatorContext<TFormData> {
  /** The complete form values decoded from `FormData` for server validation. */
  value: TFormData
  /**
   * The event that caused this validation run.
   *
   * - `'server'`: Form values are being validated on the server.
   */
  event: TEvents
}

/**
 * Form values and result helpers passed to a validator during initial validation.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TEvents - Library-managed. Do not specify explicitly.
 */
export interface FormValidatorPreprocessContext<
  TFormData,
  TEvents extends PreprocessEvents,
> extends BaseFormValidatorContext<TFormData> {
  /** The complete form values being validated during initialization. */
  value: TFormData
  /**
   * The event that caused this validation run.
   *
   * - `'mount'`: The form is being constructed.
   */
  event: TEvents
}

/**
 * Form values, result helpers, and form access passed to a validator for change,
 * blur, or submission events.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TEvents - Library-managed. Do not specify explicitly.
 */
export interface FormValidatorClientContext<
  TFormData,
  TEvents extends ClientSideEvents,
> extends BaseFormValidatorContext<TFormData> {
  /** The complete form values being validated in this run. */
  value: TFormData
  /**
   * The event that caused this validation run.
   *
   * - `'change'`: A form value changed.
   * - `'blur'`: A field was blurred.
   * - `'submit'`: A form submission was attempted.
   */
  event: TEvents
  /** The form instance that owns this validator. */
  formApi: FormApi<TFormData, any>
  /**
   * Aborted when this validation run is cancelled. Pass it to asynchronous work
   * such as `fetch` to cancel that work too.
   */
  signal: AbortSignal
  /**
   * The field whose change or blur triggered validation. `undefined` when no
   * field triggered the run.
   */
  triggerFieldApi?: AnyFieldApi
}

type GetValidatorContext<
  TFormData,
  TEvents extends ValidatorEvents,
> = TEvents extends infer T
  ? T extends ServerSideEvents
    ? FormValidatorServerContext<TFormData, T>
    : T extends ClientSideEvents
      ? FormValidatorClientContext<TFormData, T>
      : T extends PreprocessEvents
        ? FormValidatorPreprocessContext<TFormData, T>
        : never
  : never

/**
 * Validates the complete form values with a context selected from its configured events.
 *
 * @returns Form or field errors, a successful result from `createOutput`, or
 * `null`, `undefined`, or `false` for success without output data. The result
 * can also be returned in a promise.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TEvents - Library-managed. Do not specify explicitly.
 */
export type FormValidatorFn<TFormData, TEvents extends ValidatorEvents> = (
  context: GetValidatorContext<TFormData, TEvents>,
) => Awaitable<FormValidationResult<TFormData>>

// ==================================
// Other contexts and functions

/**
 * Current form state passed to `when` and `skipOnSubmit` callbacks.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export interface ValidatorPredicateContext<TFormData, TValue> {
  /** The owning form calling this function. */
  formApi: FormApi<TFormData, any>
  /**
   * The field that triggered validation. `undefined` when no field triggered
   * the run.
   */
  fieldApi?: AnyFieldApi
  /**
   * The current value when the condition is evaluated.
   */
  value: TValue
}

// TODO this should be merged into all validators. This doesn't change for field, group and form.
/**
 * Synchronously decides whether a trigger is enabled or submission validation
 * is skipped.
 *
 * @returns For `when`, `true` enables the trigger and `false` disables it. For
 * `skipOnSubmit`, `true` skips validation for the submission attempt and
 * `false` allows it. Promises are not supported.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
type ValidatorPredicateFn<TFormData, TValue> = (
  context: ValidatorPredicateContext<TFormData, TValue>,
) => boolean

/**
 * Treats callback conditions as variable booleans when inferring validator
 * events and submission outputs.
 *
 * A callback with a literal `true` or `false` return type still becomes
 * `boolean`. Other condition types are preserved.
 *
 * @typeParam TCondition - Library-managed. Do not specify explicitly.
 */
export type ParseValidatorCondition<TCondition> = TCondition extends (
  ...args: any
) => boolean
  ? boolean
  : TCondition

// TODO: When wiring up validation, apply fieldErrorTarget to schema issues;
// default to 'field' and always keep root issues in the form, including paths
// normalized to empty. Warn once during configuration in development if a
// callback supplies the option; ignore it for callbacks in every build.
/**
 * Provides the function or Standard Schema used to validate complete form values.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormEvents - Library-managed. Do not specify explicitly.
 */
interface FormValidatorRunner<TFormData, TFormEvents extends ValidatorEvents> {
  /**
   * Validates the complete form values with a function or Standard Schema.
   *
   * A function receives the context for the current event and may return a
   * promise. A schema validates the form values and provides its parsed data
   * as output on success.
   */
  run:
    StandardSchemaV1<TFormData, any> | FormValidatorFn<TFormData, TFormEvents>

  /**
   * Selects where this schema's issues with field paths are reported.
   * This setting does nothing for callback validators.
   *
   * - `'field'`: Report issues on their corresponding fields.
   * - `'field-and-self'`: Report issues on their fields and the form.
   * - `'self'`: Report issues only on the form.
   *
   * Issues without a path, including paths that normalize to empty, always
   * go to the form. This option affects runtime routing only; inferred self
   * and subfield error types stay unchanged.
   *
   * @default 'field'
   */
  fieldErrorTarget?: 'field' | 'field-and-self' | 'self'
  /**
   * If `true`, skips this validator and all later validators when earlier
   * validation in the current run has failed.
   *
   * Waits for earlier asynchronous validators to finish before checking for
   * failures. If `false`, earlier failures do not prevent this validator from
   * running.
   *
   * @default false
   */
  bailIfInvalid?: boolean
}

/**
 * Enables or disables a mount or server trigger with a boolean condition.
 *
 * @typeParam TTrigger - Library-managed. Do not specify explicitly.
 */
type StaticTriggerConfig<TTrigger> = {
  /** `'mount'` for initial validation, or `'server'` for server validation. */
  trigger: TTrigger & StaticValidatorTriggers
  /** `true` enables validation for this trigger; `false` disables it. */
  when: boolean
}

/**
 * Enables a change or blur trigger with a boolean or a callback evaluated for
 * each matching event.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TTrigger - Library-managed. Do not specify explicitly.
 */
type DynamicTriggerConfig<TFormData, TTrigger> = {
  /** The change or blur event to match before evaluating `when`. */
  trigger: TTrigger & DynamicValidatorTriggers
  /**
   * Whether validation runs for this trigger. A callback reads the current
   * form values and state; return `true` to run validation or `false` to skip it.
   */
  when: boolean | ValidatorPredicateFn<TFormData, TFormData>
}

// Constraining the TTrigger + Extracting early would kill autocomplete.
// This looks cursed, but it'll have to do.
/**
 * Selects an event to run validation, either unconditionally or with a `when`
 * condition.
 *
 * Use a string for an unconditional trigger or an object to add a condition.
 * Submission is controlled separately by `skipOnSubmit`.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TTrigger - Library-managed. Do not specify explicitly.
 */
type TriggerConfig<TFormData, TTrigger> =
  // Hejlsberg, forgive them; for they know not what they do.
  | `${TTrigger & ValidatorTriggers}`
  | StaticTriggerConfig<TTrigger>
  | DynamicTriggerConfig<TFormData, TTrigger>

// ===================================
// Full validator objects

/**
 * Controls which events run a form validator and how long change and blur
 * validation waits.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormTriggers - Library-managed. Do not specify explicitly.
 */
interface BaseFormValidator<TFormData, TFormTriggers> {
  /**
   * Events that run this validator in addition to submission, optionally with
   * a `when` condition.
   *
   * - `'change'`: A form value changed.
   * - `'blur'`: A field was blurred.
   * - `'mount'`: The form is being constructed.
   * - `'server'`: Form values are being validated on the server.
   *
   * Use a string to enable an event unconditionally, or an object with
   * `trigger` and `when` to add a condition.
   *
   * Submission is controlled separately by `skipOnSubmit`.
   * @default []
   *
   * @example
   * ```ts
   * triggers: [
   *    'blur', // Always run on blur
   *    {
   *      // Only run on change after a submission attempt
   *      trigger: 'change',
   *      when: ({ formApi }) => formApi.state.submissionAttempts > 0
   *    },
   * ]
   * ```
   */
  triggers?: TriggerConfig<TFormData, TFormTriggers>[]
  /**
   * How long change and blur validation waits after the latest matching event
   * before it runs.
   *
   * The delay is measured in milliseconds. Repeated events restart the delay
   * for this validator.
   *
   * @important Mount, server, and submission validation are not delayed.
   *
   * @default 0
   */
  triggerDebounceMs?: number
}

type MaybeSubmitEvent<TValidatorConfig> = false extends TValidatorConfig
  ? 'submit'
  : true extends TValidatorConfig
    ? never
    : 'submit'

type GetValidatorEvents<TValidatorConfig> =
  | Extract<TValidatorConfig, ValidatorTriggers>
  | MaybeSubmitEvent<ParseValidatorCondition<TValidatorConfig>>

type SkipOnSubmitConfig<TFormData, TValidatorConfig> =
  (TValidatorConfig & boolean) | ValidatorPredicateFn<TFormData, TFormData>

interface FormValidatorConfig<
  TFormData,
  TValidatorConfig,
> extends BaseFormValidator<TFormData, TValidatorConfig> {
  /**
   * Whether to skip this validator during a client submission attempt,
   * independently of its configured triggers.
   *
   * Pass `true` to skip it, or a synchronous callback that returns `true` to
   * skip it for the current attempt. `false` or an omitted option allows
   * submission validation. Configured triggers still use their own conditions.
   *
   * A skipped validator's entry in submission `validatorOutputs` is `undefined`.
   *
   * @example
   * ```ts
   * const isDraft = false
   *
   * formOptions({
   *   defaultValues: { email: '' },
   *   validators: [
   *     {
   *       skipOnSubmit: isDraft,
   *       run: ({ value }) => {
   *          if (!value.email.includes('@)) {
   *            return 'Enter a valid email'
   *          }
   *       }
   *     },
   *   ],
   * })
   * ```
   */
  skipOnSubmit?: SkipOnSubmitConfig<TFormData, TValidatorConfig>
}

// Intersecting a schema with StandardSchemaV1 can rebind its polymorphic
// `this` and recursively compare its methods. Keep compatible schemas intact.
type FormOptionsValidatorRunner<
  TFormData,
  TEvents extends ValidatorEvents,
  TValidator,
> = TValidator extends {
  run: infer TRun extends StandardSchemaV1<TFormData, any>
}
  ? { run: TRun }
  : FormValidatorRunner<TFormData, TEvents>

/**
 * Validates the complete form values with a function or Standard Schema.
 *
 * Configure when this validator runs by setting `skipOnSubmit` and `triggers`.
 *
 * The context a validator function gets is dependent on the chosen triggers and submission behaviour.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorConfig - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```ts
 * formOptions({
 *   defaultValues: { name: '' },
 *   validators: [
 *     {
 *       triggers: [
 *         'blur', // Always run on blur
 *         {
 *           // Only run on change after a submission attempt
 *           trigger: 'change',
 *           when: ({ formApi }) => formApi.state.submissionAttempts > 0
 *         },
 *       ],
 *       triggerDebounceMs: 300,
 *       run: ({ value }) => {
 *          if (value.name.trim().length === 0) {
 *            return 'Name is required'
 *          }
 *       }
 *     },
 *   ],
 * })
 * ```
 */
export interface FormValidator<TFormData, TValidatorConfig>
  extends
    FormValidatorConfig<TFormData, TValidatorConfig>,
    FormValidatorRunner<
      TFormData,
      NoInfer<GetValidatorEvents<TValidatorConfig>>
    > {}

/**
 * Matches each form validator to its own trigger and submission settings so
 * callback values and events are inferred for that validator.
 *
 * Validator array positions are preserved.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorConfig - Library-managed. Do not specify explicitly.
 */
export type FormOptionsValidators<
  TFormData,
  TValidatorConfig extends unknown[],
  TValidators = unknown,
> = {
  // Infer trigger names and the skip condition together before contextualizing run.
  // Extract keeps skip conditions and unknown (omitted options) out of events.
  [K in keyof TValidatorConfig]: FormValidatorConfig<
    TFormData,
    TValidatorConfig[K]
  > &
    // Generic arrays need the broad runner for assignment in generic helpers.
    (number extends TValidatorConfig['length']
      ? FormValidatorRunner<
          TFormData,
          NoInfer<GetValidatorEvents<TValidatorConfig[K]>>
        >
      : FormOptionsValidatorRunner<
          TFormData,
          NoInfer<GetValidatorEvents<TValidatorConfig[K]>>,
          K extends keyof TValidators ? TValidators[K] : unknown
        >)
}
