import { batch, createStore } from '@tanstack/store'
import {
  determineFieldLevelErrorSourceAndValue,
  evaluate,
  getAsyncValidatorArray,
  getSyncValidatorArray,
  isGlobalFormValidationError,
  mergeOpts,
} from './utils'
import { defaultValidationLogic } from './ValidationLogic'
import {
  isStandardSchemaValidator,
  standardSchemaValidators,
} from './standardSchemaValidator'
import { defaultFieldMeta } from './metaHelper'
import { FieldApi } from './FieldApi'
import {
  BaseFormState,
  FormAsyncValidateOrFn,
  FormState,
  FormValidateOrFn,
  UnwrapFormAsyncValidateOrFn,
  UnwrapFormValidateOrFn,
} from './FormApi'
import type { AnyFieldApi } from './FieldApi'
import type {
  StandardSchemaV1,
  TStandardSchemaValidatorValue,
} from './standardSchemaValidator'
import type { AsyncValidator, SyncValidator, Updater } from './utils'
import type { ReadonlyStore, Store } from '@tanstack/store'
import {
  AnyFieldLikeMeta,
  FieldErrorMapFromValidator,
  FieldInfo,
  FieldLikeAPI,
  FieldLikeApiOptions,
  FieldLikeMetaBase,
  FieldLikeOptions,
  FieldLikeState,
  ListenerCause,
  UnwrapFieldAsyncValidateOrFn,
  UnwrapFieldValidateOrFn,
  UpdateMetaOptions,
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
} from './types'
import type { DeepKeys, DeepValue } from './util-types'

/**
 * @private
 */
export type FormGroupValidateFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = (props: {
  value: TData
  groupApi: FormGroupApi<
    TParentData,
    TName,
    TData,
    // This is technically an edge-type; which we try to keep non-`any`, but in this case
    // It's referring to an inaccessible type from the group validate function inner types, so it's not a big deal
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
}) => unknown

/**
 * @private
 */
export type FormGroupValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> =
  | FormGroupValidateFn<TParentData, TName, TData>
  | StandardSchemaV1<TData, unknown>

/**
 * @private
 */
export type FormGroupValidateAsyncFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = (options: {
  value: TData
  groupApi: FormGroupApi<
    TParentData,
    TName,
    TData,
    // This is technically an edge-type; which we try to keep non-`any`, but in this case
    // It's referring to an inaccessible type from the group validate function inner types, so it's not a big deal
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
  signal: AbortSignal
}) => unknown | Promise<unknown>

/**
 * @private
 */
export type FormGroupAsyncValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> =
  | FormGroupValidateAsyncFn<TParentData, TName, TData>
  | StandardSchemaV1<TData, unknown>

/**
 * @private
 */
export type FormGroupListenerFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = (props: {
  value: TData
  groupApi: FormGroupApi<
    TParentData,
    TName,
    TData,
    // This is technically an edge-type; which we try to keep non-`any`, but in this case
    // It's referring to an inaccessible type from the group listener function inner types, so it's not a big deal
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
}) => void

export interface FormGroupValidators<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
> {
  /**
   * An optional function, that runs on the mount event of input.
   */
  onMount?: TOnMount
  /**
   * An optional function, that runs on the change event of input.
   *
   * @example z.string().min(1)
   */
  onChange?: TOnChange
  /**
   * An optional property similar to `onChange` but async validation
   *
   * @example z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })
   */
  onChangeAsync?: TOnChangeAsync
  /**
   * An optional number to represent how long the `onChangeAsync` should wait before running
   *
   * If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds
   */
  onChangeAsyncDebounceMs?: number
  /**
   * An optional list of field names that should trigger this field's `onChange` and `onChangeAsync` events when its value changes
   */
  onChangeListenTo?: DeepKeys<TParentData>[]
  /**
   * An optional function, that runs on the blur event of input.
   *
   * @example z.string().min(1)
   */
  onBlur?: TOnBlur
  /**
   * An optional property similar to `onBlur` but async validation.
   *
   * @example z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })
   */
  onBlurAsync?: TOnBlurAsync

  /**
   * An optional number to represent how long the `onBlurAsync` should wait before running
   *
   * If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds
   */
  onBlurAsyncDebounceMs?: number
  /**
   * An optional list of field names that should trigger this field's `onBlur` and `onBlurAsync` events when its value changes
   */
  onBlurListenTo?: DeepKeys<TParentData>[]
  /**
   * An optional function, that runs on the submit event of form.
   *
   * @example z.string().min(1)
   */
  onSubmit?: TOnSubmit
  /**
   * An optional property similar to `onSubmit` but async validation.
   *
   * @example z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })
   */
  onSubmitAsync?: TOnSubmitAsync
  onDynamic?: TOnDynamic
  onDynamicAsync?: TOnDynamicAsync
  onDynamicAsyncDebounceMs?: number
}

export interface FormGroupListeners<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> {
  onChange?: FormGroupListenerFn<TParentData, TName, TData>
  onChangeDebounceMs?: number
  onBlur?: FormGroupListenerFn<TParentData, TName, TData>
  onBlurDebounceMs?: number
  onMount?: FormGroupListenerFn<TParentData, TName, TData>
  onUnmount?: FormGroupListenerFn<TParentData, TName, TData>
  onSubmit?: FormGroupListenerFn<TParentData, TName, TData>
  onGroupSubmit?: FormGroupListenerFn<TParentData, TName, TData>
}

interface FormGroupExtraOptions<
  in out TParentData,
  in out TName extends DeepKeys<TParentData>,
  in out TData extends DeepValue<TParentData, TName>,
  in out TOnMount extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnBlur extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TSubmitMeta,
  in out TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChangeAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnBlurAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnSubmitAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnDynamicAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  in out TParentSubmitMeta,
> {
  /**
   * A list of validators to pass to the field
   */
  validators?: FormGroupValidators<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync
  >

  /**
   * If true, allows the form to be submitted in an invalid state i.e. canSubmit will remain true regardless of validation errors. Defaults to undefined.
   */
  canSubmitWhenInvalid?: boolean

  /**
   * A list of listeners which attach to the corresponding events
   */
  listeners?: FormGroupListeners<TParentData, TName, TData>

  defaultState?: FormGroupState
  /**
   * onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props
   */
  onSubmitMeta?: TSubmitMeta

  /**
   * A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`
   */
  onGroupSubmit?: (props: {
    value: TData
    groupApi: FormGroupApi<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TSubmitMeta,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    >
    meta: TSubmitMeta
  }) => any | Promise<any>
  /**
   * Specify an action for scenarios where the user tries to submit an invalid form.
   */
  onGroupSubmitInvalid?: (props: {
    value: TData
    groupApi: FormGroupApi<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TSubmitMeta,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    >
    meta: TSubmitMeta
  }) => void
}

/**
 * An object type representing the options for a field in a form.
 */
export interface FieldOptions<
  in out TParentData,
  in out TName extends DeepKeys<TParentData>,
  in out TData extends DeepValue<TParentData, TName>,
  in out TOnMount extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnBlur extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TSubmitMeta,
  in out TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChangeAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnBlurAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnSubmitAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnDynamicAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  in out TParentSubmitMeta,
>
  extends
    FormGroupExtraOptions<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TSubmitMeta,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    >,
    FieldLikeOptions<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync
    > {}

interface FormGroupApiOptions<
  in out TParentData,
  in out TName extends DeepKeys<TParentData>,
  in out TData extends DeepValue<TParentData, TName>,
  in out TOnMount extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnBlur extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TSubmitMeta,
  in out TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChangeAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnBlurAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnSubmitAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnDynamicAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  in out TParentSubmitMeta,
>
  extends
    FieldLikeApiOptions<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    >,
    FormGroupExtraOptions<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TSubmitMeta,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    > {}

interface FormGroupState {
  /**
   * A boolean indicating if the form is currently in the process of being submitted after `handleSubmit` is called.
   *
   * Goes back to `false` when submission completes for one of the following reasons:
   * - the validation step returned errors.
   * - the `onSubmit` function has completed.
   *
   * Note: if you're running async operations in your `onSubmit` function make sure to await them to ensure `isSubmitting` is set to `false` only when the async operation completes.
   *
   * This is useful for displaying loading indicators or disabling form inputs during submission.
   *
   */
  isSubmitting: boolean
  /**
   * A boolean indicating if the `onSubmit` function has completed successfully.
   *
   * Goes back to `false` at each new submission attempt.
   *
   * Note: you can use isSubmitting to check if the form is currently submitting.
   */
  isSubmitted: boolean
  /**
   * A boolean indicating if the form or any of its fields are currently validating.
   */
  isValidating: boolean
  /**
   * A counter for tracking the number of submission attempts.
   */
  submissionAttempts: number
  /**
   * A boolean indicating if the last submission was successful.
   */
  isSubmitSuccessful: boolean
}

function getDefaultFormGroupState(
  defaultState: Partial<FormGroupState>,
): FormGroupState {
  return {
    isSubmitted: defaultState.isSubmitted ?? false,
    isSubmitting: defaultState.isSubmitting ?? false,
    isValidating: defaultState.isValidating ?? false,
    submissionAttempts: defaultState.submissionAttempts ?? 0,
    isSubmitSuccessful: defaultState.isSubmitSuccessful ?? false,
  }
}

/**
 * @public
 *
 * A type representing the FormGroup API with all generics set to `any` for convenience.
 */
export type AnyFormGroupApi = FormGroupApi<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

interface FormGroupStoreState extends AnyFieldLikeMeta {
  isFieldsValidating: boolean
  isFieldsValid: boolean
  isGroupValid: boolean
  canSubmit: boolean
}

export class FormGroupApi<
  in out TParentData,
  in out TName extends DeepKeys<TParentData>,
  in out TData extends DeepValue<TParentData, TName>,
  in out TOnMount extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnBlur extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  in out TSubmitMeta,
  in out TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChangeAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnBlurAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnSubmitAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnDynamicAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  in out TParentSubmitMeta,
> implements FieldLikeAPI<
  TParentData,
  TName,
  TData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer,
  TParentSubmitMeta,
  FormGroupExtraOptions<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TSubmitMeta,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TParentSubmitMeta
  >
> {
  /**
   * A reference to the form API instance.
   */
  form: FormGroupApiOptions<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TSubmitMeta,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TParentSubmitMeta
  >['form']
  /**
   * The field name.
   */
  name: TName
  /**
   * The field options.
   */
  options: FormGroupApiOptions<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TSubmitMeta,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TParentSubmitMeta
  > = {} as any
  /**
   * The field state store.
   */
  store!: ReadonlyStore<
    FieldLikeState<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync
    >
  >
  /**
   * The current field state.
   */
  get state() {
    return this.store.state
  }

  formStateStore: Store<FormGroupState>

  get formState() {
    return this.formStateStore.state
  }

  timeoutIds: {
    validations: Record<ValidationCause, ReturnType<typeof setTimeout> | null>
    listeners: Record<ListenerCause, ReturnType<typeof setTimeout> | null>
    formListeners: Record<ListenerCause, ReturnType<typeof setTimeout> | null>
  }

  constructor(
    opts: FormGroupApiOptions<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TSubmitMeta,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    >,
  ) {
    this.form = opts.form
    this.name = opts.name
    this.options = opts

    this.timeoutIds = {
      validations: {} as Record<ValidationCause, never>,
      listeners: {} as Record<ListenerCause, never>,
      formListeners: {} as Record<ListenerCause, never>,
    }

    const formStateStoreVal: FormGroupState = getDefaultFormGroupState({
      ...(opts.defaultState as any),
    })

    this.formStateStore = createStore(formStateStoreVal) as never

    let prevMeta: AnyFieldLikeMeta | undefined = undefined

    this.store = createStore(
      (
        prevVal:
          | (FormGroupStoreState &
              FieldLikeState<
                TParentData,
                TName,
                TData,
                TOnMount,
                TOnChange,
                TOnChangeAsync,
                TOnBlur,
                TOnBlurAsync,
                TOnSubmit,
                TOnSubmitAsync,
                TOnDynamic,
                TOnDynamicAsync,
                TFormOnMount,
                TFormOnChange,
                TFormOnChangeAsync,
                TFormOnBlur,
                TFormOnBlurAsync,
                TFormOnSubmit,
                TFormOnSubmitAsync,
                TFormOnDynamic,
                TFormOnDynamicAsync
              >)
          | undefined,
      ) => {
        // Temp hack to subscribe to form.store
        this.form.store.get()

        const meta = this.form.getFieldMeta(this.name) ?? {
          ...defaultFieldMeta,
          ...opts.defaultMeta,
        }

        let value = this.form.getFieldValue(this.name)
        if (
          !meta.isTouched &&
          (value as unknown) === undefined &&
          this.options.defaultValue !== undefined &&
          !evaluate(value, this.options.defaultValue)
        ) {
          value = this.options.defaultValue
        }

        const relatedFieldMeta = this.getRelatedFieldMetasDerived()

        const isFieldsValidating = relatedFieldMeta.some(
          (field) => field.isValidating,
        )

        const isFieldsValid = relatedFieldMeta.every((field) => field.isValid)

        const isTouched = relatedFieldMeta.some((field) => field.isTouched)
        const isBlurred = relatedFieldMeta.some((field) => field.isBlurred)
        const isDefaultValue = relatedFieldMeta.every(
          (field) => field.isDefaultValue,
        )

        const isDirty = relatedFieldMeta.some((field) => field.isDirty)
        const isPristine = !isDirty

        const isValidating = !!isFieldsValidating

        // As `errors` is not a primitive, we need to aggressively persist the same referencial value for performance reasons
        let errors = prevVal?.errors ?? []
        if (!prevMeta || meta.errorMap !== prevMeta.errorMap) {
          errors = Object.values(meta.errorMap).reduce<
            Array<
              | UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>
              | UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>
              | UnwrapFieldAsyncValidateOrFn<
                  TName,
                  TOnChangeAsync,
                  TFormOnChangeAsync
                >
              | UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>
              | UnwrapFieldAsyncValidateOrFn<
                  TName,
                  TOnBlurAsync,
                  TFormOnBlurAsync
                >
              | UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>
              | UnwrapFieldAsyncValidateOrFn<
                  TName,
                  TOnSubmitAsync,
                  TFormOnSubmitAsync
                >
            >
          >((prev, curr) => {
            if (curr === undefined) return prev

            if (curr && isGlobalFormValidationError(curr)) {
              prev.push(curr.form as never)
              return prev
            }
            prev.push(curr as never)
            return prev
          }, [])
        }

        const isGroupValid = errors.length === 0
        const isValid = isFieldsValid && isGroupValid
        const submitInvalid = this.options.canSubmitWhenInvalid ?? false
        const canSubmit =
          (this.formStateStore.state.submissionAttempts === 0 &&
            !isTouched) /* &&
            !hasOnMountError */ ||
          (!isValidating &&
            !this.formStateStore.state.isSubmitting &&
            isValid) ||
          submitInvalid

        const errorMap = meta.errorMap
        // TODO: Handle this
        /*
        if (shouldInvalidateOnMount) {
          errors = errors.filter(
            (err) => err !== currBaseStore.errorMap.onMount,
          )
          errorMap = Object.assign(errorMap, { onMount: undefined })
        }
         */

        if (
          prevVal &&
          prevMeta &&
          prevVal.value === value &&
          prevVal.meta === meta &&
          prevVal.errorMap === errorMap &&
          prevVal.errors === errors &&
          prevVal.isFieldsValidating === isFieldsValidating &&
          prevVal.isFieldsValid === isFieldsValid &&
          prevVal.isGroupValid === isGroupValid &&
          prevVal.isValid === isValid &&
          prevVal.canSubmit === canSubmit &&
          prevVal.isTouched === isTouched &&
          prevVal.isBlurred === isBlurred &&
          prevVal.isPristine === isPristine &&
          prevVal.isDefaultValue === isDefaultValue &&
          prevVal.isDirty === isDirty &&
          evaluate(prevMeta, meta)
        ) {
          return prevVal
        }

        const state = {
          ...this.formStateStore.state,
          value,
          meta,
          errorMap,
          errors,
          canSubmit,
          isFieldsValidating,
          isFieldsValid,
          isGroupValid,
          isValid,
          isTouched,
          isBlurred,
          isPristine,
          isDefaultValue,
          isDirty,
          errorSourceMap: {},
        } as FormGroupStoreState &
          FieldLikeState<
            TParentData,
            TName,
            TData,
            TOnMount,
            TOnChange,
            TOnChangeAsync,
            TOnBlur,
            TOnBlurAsync,
            TOnSubmit,
            TOnSubmitAsync,
            TOnDynamic,
            TOnDynamicAsync,
            TFormOnMount,
            TFormOnChange,
            TFormOnChangeAsync,
            TFormOnBlur,
            TFormOnBlurAsync,
            TFormOnSubmit,
            TFormOnSubmitAsync,
            TFormOnDynamic,
            TFormOnDynamicAsync
          >

        prevMeta = meta

        return state
      },
    )

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Updates the field instance with new options.
   */
  update = (
    opts: FormGroupApiOptions<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TSubmitMeta,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TParentSubmitMeta
    >,
  ) => {
    this.options = opts
    this.name = opts.name

    // Default Value
    if (!this.state.meta.isTouched && this.options.defaultValue !== undefined) {
      const formField = this.form.getFieldValue(this.name)
      if (!evaluate(formField, opts.defaultValue)) {
        this.form.setFieldValue(this.name, opts.defaultValue as never, {
          dontUpdateMeta: true,
          dontValidate: true,
          dontRunListeners: true,
        })
      }
    }

    if (!this.form.getFieldMeta(this.name)) {
      this.form.setFieldMeta(this.name, this.state.meta)
    }
  }

  /**
   * @private
   */
  runValidator<
    TValue extends TStandardSchemaValidatorValue<TData> & {
      groupApi: AnyFormGroupApi
    },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FormGroupValidateOrFn<any, any, any>
      : FormGroupAsyncValidateOrFn<any, any, any>
    value: TValue
    type: TType
    // When `api` is 'field', the return type cannot be `FormValidationError`
  }): unknown {
    if (isStandardSchemaValidator(props.validate)) {
      return standardSchemaValidators[props.type](
        props.value,
        props.validate,
      ) as never
    }

    return (props.validate as FormGroupValidateFn<any, any>)(
      props.value,
    ) as never
  }

  mount() {
    // TODO: Absorb from FieldApi
    return () => {}
  }

  /**
   * Sets the field value and run the `change` validator.
   */
  setValue = (updater: Updater<TData>, options?: UpdateMetaOptions) => {
    this.form.setFieldValue(
      this.name,
      updater as never,
      mergeOpts(options, { dontRunListeners: true, dontValidate: true }),
    )

    if (!options?.dontRunListeners) {
      this.triggerOnChangeListener()
    }

    if (!options?.dontValidate) {
      this.validate('change')
    }
  }

  getMeta = () => this.store.state.meta

  /**
   * Sets the field metadata.
   */
  setMeta = (
    updater: Updater<
      FieldLikeMetaBase<
        TParentData,
        TName,
        TData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnDynamic,
        TOnDynamicAsync,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnDynamic,
        TFormOnDynamicAsync
      >
    >,
  ) => this.form.setFieldMeta(this.name, updater)

  /**
   * Gets the field information object.
   */
  getInfo = () => this.form.getFieldInfo(this.name)

  /**
   * @private
   */
  getRelatedFields = () => {
    const fields = Object.values(this.form.fieldInfo) as FieldInfo<any>[]

    const relatedFields: AnyFieldApi[] = []
    for (const field of fields) {
      if (!field.instance) continue
      // TODO: How to handle FormGroups?
      if (!(field.instance instanceof FieldApi)) continue
      if (field.instance.name.startsWith(this.name)) {
        relatedFields.push(field.instance)
      }
    }

    return relatedFields
  }
  /**
   * @private
   */
  getRelatedFieldMetasDerived = () => {
    const fields = Object.entries(this.form.fieldMetaDerived.state) as [
      string,
      AnyFieldLikeMeta,
    ][]

    const relatedFieldMetas: (AnyFieldLikeMeta & { name: string })[] = []
    for (const [fieldName, fieldMeta] of fields) {
      if (fieldName.startsWith(this.name)) {
        relatedFieldMetas.push({ ...fieldMeta, name: fieldName })
      }
    }

    return relatedFieldMetas
  }

  /**
   * @private
   */
  validateSync = (
    cause: ValidationCause,
    errorFromForm: ValidationErrorMap,
    opts: {
      skipRelatedFieldValidation?: boolean
    } = {},
  ) => {
    const validates = getSyncValidatorArray(cause, {
      ...this.options,
      form: this.form,
      validationLogic:
        this.form.options.validationLogic || defaultValidationLogic,
    })

    const relatedFields = opts.skipRelatedFieldValidation
      ? []
      : this.getRelatedFields()
    const relatedFieldValidates = relatedFields.reduce(
      (acc, field) => {
        const fieldValidates = getSyncValidatorArray(cause, {
          ...field.options,
          form: field.form,
          validationLogic:
            field.form.options.validationLogic || defaultValidationLogic,
        })
        fieldValidates.forEach((validate) => {
          ;(validate as any).field = field
        })
        return acc.concat(fieldValidates as never)
      },
      [] as Array<
        SyncValidator<any> & {
          field: AnyFieldApi
        }
      >,
    )

    // Needs type cast as eslint errantly believes this is always falsy
    let hasErrored = false as boolean

    batch(() => {
      const validateFieldOrGroupFn = (
        fieldOrGroup: AnyFieldApi | AnyFormGroupApi,
        validateObj: SyncValidator<any>,
      ) => {
        const errorMapKey = getErrorMapKey(validateObj.cause)

        const fieldLevelError = validateObj.validate
          ? normalizeError(
              // TODO: Remove `any` cast
              (fieldOrGroup as any).runValidator({
                validate: validateObj.validate,
                value: {
                  value: fieldOrGroup.store.state.value,
                  validationSource: 'field',
                  ...(fieldOrGroup instanceof FormGroupApi
                    ? {
                        groupApi: fieldOrGroup,
                      }
                    : { fieldApi: fieldOrGroup }),
                } as never,
                type: 'validate',
              }),
            )
          : undefined

        const formLevelError = errorFromForm[errorMapKey]

        const { newErrorValue, newSource } =
          determineFieldLevelErrorSourceAndValue({
            formLevelError,
            fieldLevelError,
          })

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (fieldOrGroup.state.meta.errorMap?.[errorMapKey] !== newErrorValue) {
          fieldOrGroup.setMeta((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: newErrorValue,
            },
            errorSourceMap: {
              ...prev.errorSourceMap,
              [errorMapKey]: newSource,
            },
          }))
        }
        if (newErrorValue) {
          hasErrored = true
        }
      }

      for (const validateObj of validates) {
        validateFieldOrGroupFn(this, validateObj)
      }
      for (const fieldValidateObj of relatedFieldValidates) {
        if (!fieldValidateObj.validate) continue
        validateFieldOrGroupFn(fieldValidateObj.field, fieldValidateObj)
      }
    })

    /**
     *  when we have an error for onSubmit in the state, we want
     *  to clear the error as soon as the user enters a valid value in the field
     */
    const submitErrKey = getErrorMapKey('submit')

    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.state.meta.errorMap?.[submitErrKey] &&
      cause !== 'submit' &&
      !hasErrored
    ) {
      this.setMeta((prev) => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          [submitErrKey]: undefined,
        },
        errorSourceMap: {
          ...prev.errorSourceMap,
          [submitErrKey]: undefined,
        },
      }))
    }

    return { hasErrored }
  }

  /**
   * @private
   */
  validateAsync = async (
    cause: ValidationCause,
    formValidationResultPromise: Promise<
      FieldErrorMapFromValidator<
        TParentData,
        TName,
        TData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync
      >
    >,
    opts: {
      skipRelatedFieldValidation?: boolean
    } = {},
  ) => {
    const validates = getAsyncValidatorArray(cause, {
      ...this.options,
      form: this.form,
      validationLogic:
        this.form.options.validationLogic || defaultValidationLogic,
    })

    // Get the field-specific error messages that are coming from the form's validator
    const asyncFormValidationResults = await formValidationResultPromise

    const relatedFields = opts.skipRelatedFieldValidation
      ? []
      : this.getRelatedFields()
    const relatedFieldValidates = relatedFields.reduce(
      (acc, field) => {
        const fieldValidates = getAsyncValidatorArray(cause, {
          ...field.options,
          form: field.form,
          validationLogic:
            field.form.options.validationLogic || defaultValidationLogic,
        })
        fieldValidates.forEach((validate) => {
          ;(validate as any).field = field
        })
        return acc.concat(fieldValidates as never)
      },
      [] as Array<
        AsyncValidator<any> & {
          field: AnyFieldApi
        }
      >,
    )

    /**
     * We have to use a for loop and generate our promises this way, otherwise it won't be sync
     * when there are no validators needed to be run
     */
    const validatesPromises: Promise<ValidationError | undefined>[] = []
    const linkedPromises: Promise<ValidationError | undefined>[] = []

    // Check if there are actual async validators to run before setting isValidating
    // This prevents unnecessary re-renders when there are no async validators
    // See: https://github.com/TanStack/form/issues/1130
    const hasAsyncValidators =
      validates.some((v) => v.validate) ||
      relatedFieldValidates.some((v) => v.validate)

    if (hasAsyncValidators) {
      if (!this.state.meta.isValidating) {
        this.setMeta((prev) => ({ ...prev, isValidating: true }))
      }

      for (const linkedField of relatedFields) {
        linkedField.setMeta((prev) => ({ ...prev, isValidating: true }))
      }
    }

    const validateFieldOrGroupAsyncFn = (
      fieldOrGroup: AnyFieldApi | AnyFormGroupApi,
      validateObj: AsyncValidator<any>,
      promises: Promise<ValidationError | undefined>[],
    ) => {
      const errorMapKey = getErrorMapKey(validateObj.cause)
      const fieldInfo = fieldOrGroup.getInfo()
      const fieldValidatorMeta = fieldInfo.validationMetaMap[errorMapKey]

      fieldValidatorMeta?.lastAbortController.abort()
      const controller = new AbortController()

      fieldInfo.validationMetaMap[errorMapKey] = {
        lastAbortController: controller,
      }

      promises.push(
        new Promise<ValidationError | undefined>(async (resolve) => {
          let rawError!: ValidationError | undefined
          try {
            rawError = await new Promise((rawResolve, rawReject) => {
              if (fieldOrGroup.timeoutIds.validations[validateObj.cause]) {
                clearTimeout(
                  fieldOrGroup.timeoutIds.validations[validateObj.cause]!,
                )
              }

              fieldOrGroup.timeoutIds.validations[validateObj.cause] =
                setTimeout(async () => {
                  if (controller.signal.aborted) return rawResolve(undefined)
                  try {
                    rawResolve(
                      await this.runValidator({
                        validate: validateObj.validate,
                        value: {
                          value: fieldOrGroup.store.state.value,
                          signal: controller.signal,
                          validationSource: 'field',
                          ...(fieldOrGroup instanceof FormGroupApi
                            ? {
                                groupApi: fieldOrGroup,
                              }
                            : { fieldApi: fieldOrGroup }),
                        } as never,
                        type: 'validateAsync',
                      }),
                    )
                  } catch (e) {
                    rawReject(e)
                  }
                }, validateObj.debounceMs)
            })
          } catch (e: unknown) {
            rawError = e as ValidationError
          }
          if (controller.signal.aborted) return resolve(undefined)

          const fieldLevelError = normalizeError(rawError)
          const formLevelError =
            asyncFormValidationResults[
              fieldOrGroup.name as keyof typeof asyncFormValidationResults
            ]?.[errorMapKey]

          const { newErrorValue, newSource } =
            determineFieldLevelErrorSourceAndValue({
              formLevelError,
              fieldLevelError,
            })

          if (fieldOrGroup.getInfo().instance !== fieldOrGroup) {
            return resolve(undefined)
          }

          fieldOrGroup.setMeta((prev) => {
            return {
              ...prev,
              errorMap: {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                ...prev?.errorMap,
                [errorMapKey]: newErrorValue,
              },
              errorSourceMap: {
                ...prev.errorSourceMap,
                [errorMapKey]: newSource,
              },
            }
          })

          resolve(newErrorValue)
        }),
      )
    }

    // TODO: Dedupe this logic to reduce bundle size
    for (const validateObj of validates) {
      if (!validateObj.validate) continue
      validateFieldOrGroupAsyncFn(this, validateObj, validatesPromises)
    }
    for (const fieldValitateObj of relatedFieldValidates) {
      if (!fieldValitateObj.validate) continue
      validateFieldOrGroupAsyncFn(
        fieldValitateObj.field,
        fieldValitateObj,
        linkedPromises,
      )
    }

    let results: ValidationError[] = []
    if (validatesPromises.length || linkedPromises.length) {
      results = await Promise.all(validatesPromises)
      await Promise.all(linkedPromises)
    }

    // Only reset isValidating if we set it to true earlier
    if (hasAsyncValidators) {
      this.setMeta((prev) => ({ ...prev, isValidating: false }))

      for (const linkedField of relatedFields) {
        linkedField.setMeta((prev) => ({ ...prev, isValidating: false }))
      }
    }

    return results.filter(Boolean)
  }

  /**
   * Validates all fields according to the FIELD level validators.
   * This will ignore FORM level validators, use form.validate({ValidationCause}) for a complete validation
   */
  validateAllFields = async (cause: ValidationCause) => {
    const fieldValidationPromises: Promise<ValidationError[]>[] = [] as any

    batch(() => {
      void Object.values(this.getRelatedFields()).forEach((fieldInstance) => {
        // Validate the field
        fieldValidationPromises.push(
          // Remember, `validate` is either a sync operation or a promise
          Promise.resolve().then(() =>
            fieldInstance.validate(cause, { skipFormValidation: true }),
          ),
        )

        // If any fields are not touched
        if (!fieldInstance.store.state.meta.isTouched) {
          // Mark them as touched
          fieldInstance.setMeta((prev) => ({ ...prev, isTouched: true }))
        }
      })
    })

    const fieldErrorMapMap = await Promise.all(fieldValidationPromises)
    return fieldErrorMapMap.flat()
  }

  areRelatedFieldsValid = () => {
    return Object.values(this.getRelatedFields()).every(
      (field) => field.state.meta.isValid,
    )
  }

  /**
   * Validates the form group and all related children.
   */
  validate = (
    cause: ValidationCause,
    opts?: {
      skipFormValidation?: boolean
      skipRelatedFieldValidation?: boolean
    },
  ): ValidationError[] | Promise<ValidationError[]> => {
    // Attempt to sync validate first
    const { fieldsErrorMap } = opts?.skipFormValidation
      ? { fieldsErrorMap: {} as never }
      : this.form.validateSync(cause, {
          dontUpdateFormErrorMap: true,
          filterFieldNames: (fieldName) => fieldName.startsWith(this.name),
        })
    const { hasErrored } = this.validateSync(
      cause,
      fieldsErrorMap[this.name] ?? {},
      { skipRelatedFieldValidation: opts?.skipRelatedFieldValidation },
    )

    if (hasErrored && !this.options.asyncAlways) {
      this.getInfo().validationMetaMap[
        getErrorMapKey(cause)
      ]?.lastAbortController.abort()
      return this.state.meta.errors
    }

    // No error? Attempt async validation
    const formValidationResultPromise = opts?.skipFormValidation
      ? Promise.resolve({})
      : this.form.validateAsync(cause, {
          dontUpdateFormErrorMap: true,
          filterFieldNames: (fieldName) => fieldName.startsWith(this.name),
        })
    return this.validateAsync(cause, formValidationResultPromise, {
      skipRelatedFieldValidation: opts?.skipRelatedFieldValidation,
    })
  }

  /**
   * @private
   */
  triggerOnChangeListener = () => {
    // // TODO: Solve typings with formListener getting a fieldApi vs a groupApi
    // const formDebounceMs = this.form.options.listeners?.onChangeDebounceMs
    // if (formDebounceMs && formDebounceMs > 0) {
    //   if (this.timeoutIds.formListeners.change) {
    //     clearTimeout(this.timeoutIds.formListeners.change)
    //   }
    //
    //   this.timeoutIds.formListeners.change = setTimeout(() => {
    //     this.form.options.listeners?.onChange?.({
    //       formApi: this.form,
    //       groupApi: this,
    //     })
    //   }, formDebounceMs)
    // } else {
    //   this.form.options.listeners?.onChange?.({
    //     formApi: this.form,
    //     groupApi: this,
    //   })
    // }

    const fieldDebounceMs = this.options.listeners?.onChangeDebounceMs
    if (fieldDebounceMs && fieldDebounceMs > 0) {
      if (this.timeoutIds.listeners.change) {
        clearTimeout(this.timeoutIds.listeners.change)
      }

      this.timeoutIds.listeners.change = setTimeout(() => {
        this.options.listeners?.onChange?.({
          value: this.state.value,
          groupApi: this,
        })
      }, fieldDebounceMs)
    } else {
      this.options.listeners?.onChange?.({
        value: this.state.value,
        groupApi: this,
      })
    }
  }

  /**
   * @private
   */
  triggerOnSubmitListener() {
    this.options.listeners?.onSubmit?.({
      value: this.state.value,
      groupApi: this,
    })
  }

  // Needs to edgecase in the React adapter specifically to avoid type errors
  handleSubmit(): Promise<void>
  handleSubmit(submitMeta: TSubmitMeta): Promise<void>
  handleSubmit(submitMeta?: TSubmitMeta): Promise<void> {
    return this._handleSubmit(submitMeta)
  }

  /**
   * Handles the form submission, performs validation, and calls the appropriate onSubmit or onSubmitInvalid callbacks.
   */
  _handleSubmit = async (submitMeta?: TSubmitMeta): Promise<void> => {
    this.formStateStore.setState((old) => ({
      ...old,
      // Submission attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
      isSubmitSuccessful: false, // Reset isSubmitSuccessful at the start of submission
    }))

    batch(() => {
      void Object.values(this.getRelatedFields()).forEach((field) => {
        // If any fields are not touched
        if (!field.state.meta.isTouched) {
          // Mark them as touched
          field.setMeta((prev) => ({ ...prev, isTouched: true }))
        }
      })
    })

    const submitMetaArg =
      submitMeta ?? (this.options.onSubmitMeta as TSubmitMeta)

    if (!this.state.meta.isValid) {
      this.options.onGroupSubmitInvalid?.({
        value: this.state.value,
        groupApi: this,
        meta: submitMetaArg,
      })
      return
    }

    this.formStateStore.setState((d) => ({ ...d, isSubmitting: true }))

    const done = () => {
      this.formStateStore.setState((prev) => ({ ...prev, isSubmitting: false }))
    }

    await this.validateAllFields('submit')

    // Fields are invalid, do not submit
    if (!this.areRelatedFieldsValid()) {
      done()

      this.options.onGroupSubmitInvalid?.({
        value: this.state.value,
        groupApi: this,
        meta: submitMetaArg,
      })

      return
    }

    await this.validate('submit', {
      // This has already happened in the previous step
      skipRelatedFieldValidation: true,
    })

    // Group is invalid, do not submit
    if (!this.state.meta.isValid) {
      done()

      this.options.onGroupSubmitInvalid?.({
        value: this.state.value,
        groupApi: this,
        meta: submitMetaArg,
      })

      return
    }

    batch(() => {
      void Object.values(this.getRelatedFields()).forEach((field) => {
        field.options.listeners?.onGroupSubmit?.({
          value: field.state.value,
          fieldApi: field,
        })
      })
    })

    this.options.listeners?.onSubmit?.({
      groupApi: this,
      value: this.state.value,
    })

    try {
      // Run the submit code
      await this.options.onGroupSubmit?.({
        value: this.state.value,
        groupApi: this,
        meta: submitMetaArg,
      })

      batch(() => {
        this.formStateStore.setState((prev) => ({
          ...prev,
          isSubmitted: true,
          isSubmitSuccessful: true, // Set isSubmitSuccessful to true on successful submission
        }))

        done()
      })
    } catch (err) {
      this.formStateStore.setState((prev) => ({
        ...prev,
        isSubmitSuccessful: false, // Ensure isSubmitSuccessful is false if an error occurs
      }))

      done()

      throw err
    }
  }
}

function normalizeError(rawError?: ValidationError) {
  if (rawError) {
    return rawError
  }

  return undefined
}

function getErrorMapKey(cause: ValidationCause) {
  switch (cause) {
    case 'submit':
      return 'onSubmit'
    case 'blur':
      return 'onBlur'
    case 'mount':
      return 'onMount'
    case 'server':
      return 'onServer'
    case 'dynamic':
      return 'onDynamic'
    case 'change':
    default:
      return 'onChange'
  }
}
