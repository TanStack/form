import type { DeepKeys } from './deep-keys.public'
import type { FormApi } from './FormApi/FormApi.public'
import type { AnyFieldApi, FieldApi } from './FieldApi/FieldApi.public'
import type { FormErrorTypes, ValidationTrigger } from './validation.public'

/**
 * Events that can invoke a listener configured on a form.
 *
 * - `'change'`: A field value changed. The listener receives the updated form
 *   values.
 * - `'blur'`: A field was marked as blurred.
 * - `'submit'`: A submission attempt started. The listener runs before
 *   submission validation.
 * - `'mount'`: The component using the form was mounted.
 * - `'reset'`: The form finished resetting its values and state.
 */
export type FormListenerTriggers = ValidationTrigger | 'mount' | 'reset'

/**
 * Events that can invoke a listener configured on a field.
 *
 * - `'change'`: The field, one of its descendants, or a watched field reported
 *   a value change.
 * - `'blur'`: The field, one of its descendants, or a watched field was
 *   blurred.
 * - `'submit'`: A submission attempt notified the field before validation.
 * - `'mount'`: The field or a watched field was registered.
 * - `'reset'`: The field or a watched field was reset directly or as part of a
 *   form reset.
 * - `'unmount'`: The field or a watched field was unregistered.
 */
export type FieldListenerTriggers = FormListenerTriggers | 'unmount'

/**
 * Context used to conditionally enable or debounce a listener.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export interface ListenerPredicateContext<in out TFormData, out TValue> {
  /** The form associated with the listener event. */
  formApi: FormApi<TFormData, any>
  /**
   * The field associated with the listener event, when available.
   *
   * For a field listener, this is the field that owns the listener even when
   * the event came from one of its `watchFields`. It is `undefined` for
   * form-level `'mount'`, `'reset'`, and `'submit'` events.
   */
  triggerFieldApi?: AnyFieldApi
  /** The value in the listener's scope when the event occurred. */
  value: TValue
}

/**
 * Decides whether a listener is enabled for a matching event.
 *
 * The predicate is only called after its configured trigger matches the
 * current event.
 *
 * @example
 * ```ts
 * when: ({ formApi }) => formApi.state.isDirty,
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export type ListenerPredicateFn<in out TFormData, in out TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => boolean

/**
 * Configures a listener trigger with an optional condition.
 *
 * @typeParam TTriggers - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export interface ListenerTriggerConfig<
  out TTriggers extends FieldListenerTriggers,
  in out TFormData,
  in out TValue,
> {
  /** The event to match before evaluating `when`. */
  trigger: TTriggers
  /**
   * Whether the listener is enabled when `trigger` occurs.
   *
   * A function receives the current listener context.
   *
   * @example
   * ```ts
   * when: ({ formApi }) => formApi.state.isDirty,
   * ```
   *
   * @default true
   */
  when?: boolean | ListenerPredicateFn<TFormData, TValue>
}

/**
 * A listener event, optionally paired with a condition that enables it.
 *
 * A string enables the trigger unconditionally. Use the object form to add a
 * boolean or predicate condition. Omitting `when` from the object form also
 * enables the trigger unconditionally.
 *
 * @example
 * ```ts
 * triggers: [
 *   'blur',
 *   {
 *     trigger: 'change',
 *     when: ({ formApi }) => formApi.state.isDirty,
 *   },
 * ],
 * ```
 *
 * @typeParam TTriggers - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export type ListenerTriggerOption<
  TTriggers extends FieldListenerTriggers,
  TFormData,
  TValue,
> = TTriggers | ListenerTriggerConfig<TTriggers, TFormData, TValue>

/**
 * Calculates a listener's debounce delay from the current event context.
 *
 * The function is called after a trigger matches and its condition is enabled.
 * The returned number is interpreted as milliseconds; values less than or
 * equal to `0` run immediately. The function is not called for `'submit'`
 * events because they always run immediately.
 *
 * @example
 * ```ts
 * triggerDebounceMs: ({ triggerFieldApi }) =>
 *   triggerFieldApi?.name === 'search' ? 300 : 0,
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export type ListenerDebounceFn<in out TFormData, in out TValue> = (
  context: ListenerPredicateContext<TFormData, TValue>,
) => number

/**
 * Configuration shared by form and field listeners.
 *
 * @typeParam TTriggers - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export interface Listener<
  out TTriggers extends FieldListenerTriggers,
  in out TFormData,
  in out TValue,
> {
  /**
   * The debounce delay in milliseconds before the listener runs.
   *
   * A function recalculates the delay for each matching event. Repeated events
   * restart the delay, and the listener receives the latest event context.
   * Values less than or equal to `0` run immediately. `'submit'` events always
   * run immediately.
   *
   * @default 0
   */
  triggerDebounceMs?: number | ListenerDebounceFn<TFormData, TValue>
  /**
   * The events that can invoke the listener.
   *
   * The listener runs at most once for an event, even if multiple entries
   * match. An empty array disables the listener.
   *
   * @example
   * ```ts
   * triggers: [
   *   'blur',
   *   {
   *     trigger: 'change',
   *     when: ({ formApi }) => formApi.state.isDirty,
   *   },
   * ],
   * ```
   */
  triggers: Array<ListenerTriggerOption<TTriggers, TFormData, TValue>>
}

/**
 * Context passed to a form listener.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FormListenerContext<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /**
   * The field that caused the event when available.
   *
   * Some form events are initiated by the form itself, so no field causes
   * them. `triggerFieldApi` is always `undefined` for:
   *
   * - `'mount'`, when the component using the form is mounted.
   * - `'reset'`, when the form is reset.
   * - `'submit'`, when a submission attempt starts.
   *
   */
  triggerFieldApi?: AnyFieldApi
  /** The form that owns the listener. */
  formApi: FormApi<TFormData, TFormErrorTypes>
  /** The form values captured when the event occurred. */
  value: TFormData
}

/**
 * A callback invoked when a form listener runs.
 *
 * The return value is ignored. A returned promise is not awaited, and a
 * rejected promise is reported to the console.
 *
 * @example
 * ```ts
 * run: ({ value }) => {
 *   saveDraft(value)
 * },
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type FormListenerFn<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> = (context: FormListenerContext<TFormData, TFormErrorTypes>) => void

/** A form listener with type-erased form data and error types. */
export type AnyFormListener = FormListener<any, any>

/**
 * A listener configured on a form.
 *
 * Form listeners can observe field changes and blurs as well as form
 * submission, mounting, and resetting.
 *
 * @example
 * ```ts
 * formOptions({
 *   defaultValues: { displayName: '' },
 *   listeners: [
 *     {
 *       triggers: [
 *         {
 *           trigger: 'change',
 *           when: ({ value }) => value.displayName.length > 0,
 *         },
 *       ],
 *       triggerDebounceMs: 200,
 *       run: ({ value }) => {
 *         saveDraft(value)
 *       },
 *     },
 *   ],
 * })
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FormListener<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> extends Listener<FormListenerTriggers, TFormData, TFormData> {
  /**
   * Called when an enabled form trigger occurs.
   *
   * The return value is ignored. A returned promise is not awaited, and a
   * rejected promise is reported to the console.
   *
   * @example
   * ```ts
   * run: ({ value }) => {
   *   saveDraft(value)
   * },
   * ```
   */
  run: FormListenerFn<TFormData, TFormErrorTypes>
}

/**
 * Listener configurations evaluated in array order for each form event.
 *
 * A debounced listener may execute after later, non-debounced listeners.
 *
 * @example
 * ```ts
 * formOptions({
 *   defaultValues: { displayName: '' },
 *   listeners: [
 *     {
 *       triggers: [
 *         {
 *           trigger: 'change',
 *           when: ({ value }) => value.displayName.length > 0,
 *         },
 *       ],
 *       triggerDebounceMs: 200,
 *       run: ({ value }) => {
 *         saveDraft(value)
 *       },
 *     },
 *   ],
 * })
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type FormListeners<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> = Array<FormListener<TFormData, TFormErrorTypes>>

/**
 * Context passed to a field listener.
 *
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 * @typeParam TFieldError - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FieldListenerContext<
  out TFieldName,
  in out TFieldValue,
  in out TFieldError,
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /** The listening field's value captured when the event occurred. */
  value: TFieldValue
  /**
   * The field that owns the listener.
   *
   * This remains the listening field when an event arrives through
   * `watchFields`.
   */
  fieldApi: FieldApi<
    TFieldName,
    TFieldValue,
    TFieldError,
    TFormData,
    TFormErrorTypes
  >
  /** The form that owns the field. */
  formApi: FormApi<TFormData, TFormErrorTypes>
}

/**
 * A callback invoked when a field listener runs.
 *
 * The return value is ignored. A returned promise is not awaited, and a
 * rejected promise is reported to the console.
 *
 * @example
 * ```ts
 * run: ({ value, fieldApi }) => {
 *   const trimmedValue = value.trim()
 *   if (trimmedValue !== value) {
 *     fieldApi.handleChange(trimmedValue)
 *   }
 * },
 * ```
 *
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 * @typeParam TFieldError - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type FieldListenerFn<
  in TFieldName,
  in out TFieldValue,
  in out TFieldError,
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> = (
  context: FieldListenerContext<
    TFieldName,
    TFieldValue,
    TFieldError,
    TFormData,
    TFormErrorTypes
  >,
) => void

/** A field listener with type-erased field and form types. */
export type AnyFieldListener = FieldListener<any, any, any, any, any, any>

/**
 * A listener configured on a field.
 *
 * `'change'` and `'blur'` events from descendant fields propagate to their
 * ancestor field listeners. Use `watchFields` to receive matching events from
 * other fields.
 *
 * @example
 * ```ts
 * listeners: [
 *   {
 *     triggers: ['change', 'blur'],
 *     triggerDebounceMs: 200,
 *     watchFields: ['displayName'],
 *     run: ({ value, formApi }) => {
 *       saveContact({
 *         displayName: formApi.getFieldValue('displayName'),
 *         email: value,
 *       })
 *     },
 *   },
 * ],
 * ```
 *
 * @typeParam TFieldData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 * @typeParam TFieldError - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FieldListener<
  in out TFieldData,
  in TFieldName,
  in out TFieldValue,
  in out TFieldError,
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> extends Listener<FieldListenerTriggers, TFieldData, TFieldValue> {
  /**
   * Called when an enabled field trigger occurs.
   *
   * The return value is ignored. A returned promise is not awaited, and a
   * rejected promise is reported to the console.
   *
   * @example
   * ```ts
   * run: ({ value, fieldApi }) => {
   *   const trimmedValue = value.trim()
   *   if (trimmedValue !== value) {
   *     fieldApi.handleChange(trimmedValue)
   *   }
   * },
   * ```
   */
  run: FieldListenerFn<
    TFieldName,
    TFieldValue,
    TFieldError,
    TFormData,
    TFormErrorTypes
  >
  /**
   * Other fields whose matching events should also invoke this listener.
   *
   * The callback still receives this listener's `fieldApi` and `value`, not
   * the watched field or its value.
   *
   * When omitted, the listener receives matching events from its own field and
   * propagated descendant events only.
   *
   * @example
   * ```ts
   * watchFields: ['firstName', 'lastName'],
   * ```
   */
  watchFields?: Array<DeepKeys<TFieldData>>
}

/**
 * Listener configurations evaluated in array order for each field event.
 *
 * A debounced listener may execute after later, non-debounced listeners.
 *
 * @example
 * ```ts
 * listeners: [
 *   {
 *     triggers: ['change', 'blur'],
 *     triggerDebounceMs: 200,
 *     watchFields: ['displayName'],
 *     run: ({ value, formApi }) => {
 *       saveContact({
 *         displayName: formApi.getFieldValue('displayName'),
 *         email: value,
 *       })
 *     },
 *   },
 * ],
 * ```
 *
 * @typeParam TFieldData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 * @typeParam TFieldValue - Library-managed. Do not specify explicitly.
 * @typeParam TFieldError - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export type FieldListeners<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> = Array<
  FieldListener<
    TFieldData,
    TFieldName,
    TFieldValue,
    TFieldError,
    TFormData,
    TFormErrorTypes
  >
>
