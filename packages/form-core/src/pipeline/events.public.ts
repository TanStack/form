/**
 * Events that identify why validation runs.
 *
 * - `'change'`: A value changed.
 * - `'blur'`: A field was blurred.
 * - `'server'`: Form values are being validated on the server.
 * - `'submit'`: A client form submission was attempted.
 * - `'mount'`: A form is being constructed, or a field or form group is being mounted.
 */
export type ValidatorEvents = 'change' | 'blur' | 'server' | 'submit' | 'mount'

// Alternative event for this: 'reset'
/**
 * Mount events used to validate values during initialization.
 *
 * Form-level mount validators run during form construction, before `formApi`
 * is available in their callback context.
 */
export type PreprocessEvents = Extract<ValidatorEvents, 'mount'>

/** Events for validating complete form values on the server. */
export type ServerSideEvents = Extract<ValidatorEvents, 'server'>

/**
 * Value change, field blur, and client submission events whose form validator
 * callbacks receive `formApi` and an abort `signal`.
 */
export type ClientSideEvents = Exclude<
  ValidatorEvents,
  ServerSideEvents | PreprocessEvents
>

/**
 * Events accepted by a validator's `triggers` array.
 *
 * Submission runs independently of these triggers and is controlled by
 * `skipOnSubmit`.
 */
export type ValidatorTriggers = Exclude<ValidatorEvents, 'submit'>

/**
 * Mount and server triggers that accept boolean `when` conditions.
 *
 * A `true` condition enables the trigger, and `false` disables it.
 * Callback conditions are not supported.
 */
export type StaticValidatorTriggers = Extract<
  ValidatorTriggers,
  ServerSideEvents | PreprocessEvents
>

/**
 * Change and blur triggers that accept boolean or callback `when` conditions.
 *
 * - A callback reads current values and state. The callback must be synchronous and have no side effects.
 * - The boolean condition or callback result enables validation when `true` and disables it when `false`.
 */
export type DynamicValidatorTriggers = Extract<
  ValidatorTriggers,
  ClientSideEvents
>
