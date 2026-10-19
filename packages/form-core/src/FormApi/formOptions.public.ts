import type { GetFormErrorTypes } from '../validation/state.public'
import type { ErrorVisibility } from './errorVisibility.public'
import type { FormListeners } from './formListeners.public'
import type { ServerFormState } from './formServerState.public'
import type {
  FormOptionsOnSubmitFn,
  FormOptionsOnSubmitInvalidFn,
  GetValidatorOutputs,
} from './formSubmit.public'
import type { FormOptionsValidators } from '../validation/formValidators.public'
import type {
  StandardSchemaInput,
  StandardSchemaV1,
} from '../standardSchema.public'
import type { Editable, InferUnion } from '../utils.public'

declare const formOptionsTypePayloadSymbol: unique symbol

type TryGetValidatorOutputs<TValidators> =
  TValidators extends ReadonlyArray<unknown>
    ? GetValidatorOutputs<TValidators>
    : []

/**
 * Configures a form's initial values, validation, listeners, and submission.
 *
 * Pass these options to a framework adapter's form creation API. Use
 * `formOptions` when defining reusable options so values and callbacks retain
 * their inferred types.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorConfig - Library-managed. Do not specify explicitly.
 * @typeParam TValidators - Library-managed. Do not specify explicitly.
 * @typeParam TPayload - Library-managed. Do not specify explicitly.
 */
export interface FormOptions<
  TFormData,
  TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
  out TPayload,
> {
  /**
   * INTERNAL USE ONLY
   *
   * A custom type payload that adapters need for things like form composition. Not a real runtime value.
   */
  readonly [formOptionsTypePayloadSymbol]?: TPayload
  /**
   * The values your form starts with.
   *
   * `reset()` restores these values, and `isDefaultValue` checks whether the
   * current values match them.
   *
   * You can supply a new object whenever options are updated. Defaults are
   * compared deeply, so recreating equal objects and arrays leaves them unchanged.
   *
   * When defaults change, untouched top-level fields receive the new values.
   * Values under touched top-level fields are preserved.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: {
   *     name: '',
   *     age: 0,
   *     interests: [] as string[],
   *   },
   *   onSubmit: ({ value }) => {
   *      // Use values
   *   },
   * })
   * ```
   */
  defaultValues: TFormData
  /**
   * Identifies this form through `formApi.formId`.
   *
   * When omitted, an identifier is generated when the form is created and
   * preserved across option updates. Supplying a new `formId` replaces it.
   */
  formId?: string
  /**
   * Controls when fields expose validation errors. Return `true` to show errors
   * or `false` to hide them. This only affects their visibility and does not
   * change the form's validity.
   *
   * Applies to every field unless the field supplies its own `errorVisibility`.
   * When no `errorVisibility` is provided, errors are always exposed.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   errorVisibility: ({ state, fieldState }) =>
   *     fieldState.meta.isBlurred || state.submissionAttempts > 0,
   * })
   * ```
   */
  errorVisibility?: ErrorVisibility<NoInfer<TFormData>>
  /**
   * An ordered array of validators for the complete form values.
   *
   * By default, validators run only on submission. See `triggers` and
   * `skipOnSubmit` to change when they run.
   *
   * Submission outputs follow the same array order.
   *
   * Make sure to not dynamically change the array length.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   validators: [
   *     {
   *       triggers: ['change'],
   *       run: ({ value, createErrorMap }) => {
   *         // Form validators can set errors on fields
   *         const map = createErrorMap();
   *         if (!value.name.trim()) {
   *           map.fields.name = 'Enter a name';
   *         }
   *         return map;
   *       },
   *     },
   *   ],
   * })
   * ```
   */
  validators?: TValidators &
    FormOptionsValidators<NoInfer<TFormData>, TValidatorConfig>
  /**
   * Callbacks for change, blur, submit, mount, and reset events.
   *
   * Use listeners for work that does not depend on other listeners. Return
   * values are ignored, and returned promises are not awaited.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   listeners: [
   *     {
   *       triggers: ['change'],
   *       triggerDebounceMs: 200,
   *       run: ({ value }) => {
   *         localStorage.setItem('profile-draft', JSON.stringify(value))
   *       },
   *     },
   *   ],
   * })
   * ```
   */
  listeners?: FormListeners<
    NoInfer<TFormData>,
    NoInfer<GetFormErrorTypes<TValidators, TSubmitReturn>>
  >
  /**
   * Used by server-side rendering (SSR) integrations to restore form state
   * from the server on the client.
   */
  serverState?: NoInfer<ServerFormState<TFormData, TValidators>> | null
  /**
   * Handles submission after field and form submission validation succeeds.
   * A returned promise is awaited before submission finishes.
   *
   * The context provides form values, validator outputs, the form instance, and
   * helpers for reporting submission errors.
   *
   * You can also report form and field errors discovered during submission,
   * such as validation errors returned by the server.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   onSubmit: async ({ value, createErrorMap }) => {
   *     const response = await createProfile();
   *     if (response.error === 'username_taken') {
   *       return createErrorMap({ fields: { name: 'This name is taken' }})
   *     }
   *     return redirect({ to: '/my-profile' })
   *   },
   * })
   * ```
   */
  onSubmit?: FormOptionsOnSubmitFn<
    NoInfer<TFormData>,
    NoInfer<TryGetValidatorOutputs<TValidators>>,
    TSubmitReturn
  >
  /**
   * Handles a failed submission, including submission validation failures,
   * errors returned from `onSubmit`, and exceptions during validation or
   * `onSubmit`.
   *
   * A returned promise is awaited before submission finishes.
   *
   * @example
   * ```ts
   * formOptions({
   *   defaultValues: { name: '' },
   *   onSubmitInvalid: () => {
   *     // Focus on first invalid input
   *     document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
   *   },
   * })
   * ```
   */
  onSubmitInvalid?: FormOptionsOnSubmitInvalidFn<
    NoInfer<TFormData>,
    NoInfer<GetFormErrorTypes<TValidators, TSubmitReturn>>
  >
}

/**
 * Function type for creating form options whose default values match a Standard
 * Schema's input type.
 *
 * @returns The supplied options object unchanged.
 * @typeParam TPayload - Library-managed. Do not specify explicitly.
 * @typeParam TSchema - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorConfig - Library-managed. Do not specify explicitly.
 * @typeParam TValidators - Library-managed. Do not specify explicitly.
 * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
 */
export type FormOptionsStrictSchemaFn<out TPayload> = <
  TSchema extends StandardSchemaV1<any, any>,
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  schema: TSchema,
  options: FormOptions<
    NoInfer<StandardSchemaInput<TSchema>>,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
) => FormOptions<
  NoInfer<StandardSchemaInput<TSchema>>,
  TValidatorConfig,
  TValidators,
  TSubmitReturn,
  TPayload
>

type LooseSchemaFormOptions<
  TSchemaInput,
  TFormData extends Editable<TSchemaInput>,
  TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
> = Omit<
  FormOptions<
    InferUnion<TFormData, TSchemaInput>,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
  'defaultValues'
> & {
  defaultValues: TFormData
}

/**
 * Function type for creating form options from a Standard Schema with defaults
 * that may omit properties or contain `null` or `undefined`.
 *
 * @returns The supplied options object unchanged.
 * @typeParam TPayload - Library-managed. Do not specify explicitly.
 * @typeParam TSchema - Library-managed. Do not specify explicitly.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TValidatorConfig - Library-managed. Do not specify explicitly.
 * @typeParam TValidators - Library-managed. Do not specify explicitly.
 * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
 */
export type FormOptionsLooseSchemaFn<out TPayload> = <
  TSchema extends StandardSchemaV1<any, any>,
  const TFormData extends Editable<StandardSchemaInput<TSchema>>,
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  schema: TSchema,
  options: LooseSchemaFormOptions<
    StandardSchemaInput<TSchema>,
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn
  >,
) => FormOptions<
  InferUnion<TFormData, StandardSchemaInput<TSchema>>,
  TValidatorConfig,
  TValidators,
  TSubmitReturn,
  TPayload
>

/**
 * The form-options helper type used by `formOptions` and adapter helpers such
 * as `appFormOptions` to retain registered component types.
 *
 * @typeParam TPayload - Library-managed. Do not specify explicitly.
 */
export interface FormOptionsApi<out TPayload> {
  /**
   * Infers form values, validator settings, and callback types for reusable
   * options.
   *
   * @typeParam TFormData - Library-managed. Do not specify explicitly.
   * @typeParam TValidatorConfig - Library-managed. Do not specify explicitly.
   * @typeParam TValidators - Library-managed. Do not specify explicitly.
   */
  <
    TFormData,
    const TValidatorConfig extends unknown[],
    TValidators,
    TSubmitReturn,
  >(
    options: FormOptions<
      TFormData,
      TValidatorConfig,
      TValidators,
      TSubmitReturn,
      unknown
    >,
  ): FormOptions<
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    TPayload
  >

  /**
   * Defines form options whose values follow a Standard Schema's input type.
   * Default values must match that type, including any required properties.
   *
   * The schema supplies the value types without running validation. Add it to
   * `validators` when it should also validate the form.
   *
   * @example
   * ```ts
   * // schema input: { name: string; age: number }
   * const profileOptions = formOptions.strictSchema(schema, {
   *   defaultValues: { name: '', age: 0 },
   *   validators: [{ run: schema }],
   * })
   * ```
   */
  strictSchema: FormOptionsStrictSchemaFn<TPayload>
  /**
   * Defines form options from a Standard Schema's input type while allowing
   * defaults to omit properties or use `null` or `undefined`.
   *
   * These empty states remain part of the form's value types, including inside
   * callbacks. This also applies to nested objects and array items.
   *
   * The schema supplies the value types without running validation. Add it to
   * `validators` when it should also validate the form.
   *
   * @example
   * ```ts
   * // schema input: { name: string; age: number }
   * const profileOptions = formOptions.looseSchema(schema, {
   *   defaultValues: { age: null },
   *   validators: [{ run: schema }],
   * })
   * ```
   */
  looseSchema: FormOptionsLooseSchemaFn<TPayload>
}

/**
 * Defines reusable form options with inferred values, validators, and callback
 * types.
 *
 * Returns the supplied object unchanged. Pass the result to a framework
 * adapter's form creation API to create a form.
 *
 * @example
 * ```ts
 * const profileOptions = formOptions({
 *   defaultValues: { name: '' },
 *   validators: [
 *     {
 *       triggers: ['blur'],
 *       run: ({ value }) => (value.name.trim() ? undefined : 'Enter a name'),
 *     },
 *   ],
 * })
 * ```
 */
export const formOptions = ((opts) => opts) as FormOptionsApi<unknown>

formOptions.strictSchema = (_schema, opts) => opts
formOptions.looseSchema = (_schema, opts) => opts as never
