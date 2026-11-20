/**
 * Events that identify why a validator runs.
 *
 * - `'change'`: A value changed.
 * - `'blur'`: A field was blurred.
 * - `'server'`: Form values are being validated on the server.
 * - `'submit'`: A client form submission was attempted.
 * - `'mount'`: Initial values are being validated.
 */
export type ValidatorEvents = 'change' | 'blur' | 'server' | 'submit' | 'mount'

// Alternative event for this: 'reset'
/**
 * Events for validating initial values during setup.
 *
 * For form validators, `'mount'` runs when the form is constructed.
 */
export type PreprocessEvents = Extract<ValidatorEvents, 'mount'>

/** Events for validating form values on the server. */
export type ServerSideEvents = Extract<ValidatorEvents, 'server'>

/**
 * Value change, field blur, and client submission events whose validator
 * callbacks receive the form API.
 */
export type ClientSideEvents = Exclude<
  ValidatorEvents,
  ServerSideEvents | PreprocessEvents
>

/**
 * Events accepted by a validator's `triggers` array.
 *
 * Submission is controlled separately by `skipOnSubmit`.
 */
export type ValidatorTriggers = Exclude<ValidatorEvents, 'submit'>

/**
 * Mount and server triggers that accept a boolean `when` condition.
 * Callbacks are not supported for these triggers.
 */
export type StaticValidatorTriggers = Extract<
  ValidatorTriggers,
  ServerSideEvents | PreprocessEvents
>

/**
 * Change and blur triggers that accept a boolean or callback `when` condition.
 *
 * A callback reads the current form values and state; return `true` to run
 * validation or `false` to skip it for the matching event.
 */
export type DynamicValidatorTriggers = Extract<
  ValidatorTriggers,
  ClientSideEvents
>
