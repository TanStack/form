import { batch, createStore } from '@tanstack/store'
import { evaluate, getSyncValidatorArray, mergeOpts } from './utils'
import { defaultValidationLogic } from './ValidationLogic'
import {
  isStandardSchemaValidator,
  standardSchemaValidators,
} from './standardSchemaValidator'
import { defaultFieldMeta } from './metaHelper'
import type { Updater } from './utils'
import type { ReadonlyStore } from '@tanstack/store'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
  TStandardSchemaValidatorValue,
} from './standardSchemaValidator'
import type {
  FieldLikeAPI,
  FieldLikeApiOptions,
  FieldLikeMetaBase,
  FieldLikeOptions,
  FieldLikeState,
  ListenerCause,
  UpdateMetaOptions,
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
} from './types'
import type {
  AnyFormApi,
  FormAsyncValidateOrFn,
  FormValidateAsyncFn,
  FormValidateFn,
  FormValidateOrFn,
} from './FormApi'
import type { DeepKeys, DeepValue } from './util-types'

/**
 * @private
 */
// TODO: Add the `Unwrap` type to the errors
type FormGroupErrorMapFromValidator<
  TFormData,
  TName extends DeepKeys<TFormData>,
  TData extends DeepValue<TFormData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TFormData, TName, TData>,
  TOnChange extends undefined | FormGroupValidateOrFn<TFormData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TFormData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TFormData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TFormData, TName, TData>,
  TOnSubmit extends undefined | FormGroupValidateOrFn<TFormData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TFormData, TName, TData>,
> = Partial<
  Record<
    DeepKeys<TFormData>,
    ValidationErrorMap<
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync
    >
  >
>

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

type StandardBrandedSchemaV1<T> = T & { __standardSchemaV1: true }

type UnwrapFormValidateOrFnForInner<
  TValidateOrFn extends undefined | FormValidateOrFn<any>,
> = [TValidateOrFn] extends [FormValidateFn<any>]
  ? ReturnType<TValidateOrFn>
  : [TValidateOrFn] extends [StandardSchemaV1<infer TOut, any>]
    ? StandardBrandedSchemaV1<TOut>
    : undefined

export type UnwrapFormGroupValidateOrFn<
  TName extends string,
  TValidateOrFn extends undefined | FormGroupValidateOrFn<any, any, any>,
  TFormValidateOrFn extends undefined | FormValidateOrFn<any>,
> =
  | ([TFormValidateOrFn] extends [StandardSchemaV1<any, infer TStandardOut>]
      ? TName extends keyof TStandardOut
        ? StandardSchemaV1Issue[]
        : undefined
      : undefined)
  | (UnwrapFormValidateOrFnForInner<TFormValidateOrFn> extends infer TFormValidateVal
      ? TFormValidateVal extends { __standardSchemaV1: true }
        ? [DeepValue<TFormValidateVal, TName>] extends [never]
          ? undefined
          : StandardSchemaV1Issue[]
        : TFormValidateVal extends { fields: any }
          ? TName extends keyof TFormValidateVal['fields']
            ? TFormValidateVal['fields'][TName]
            : undefined
          : undefined
      : never)
  | ([TValidateOrFn] extends [FormGroupValidateFn<any, any, any>]
      ? ReturnType<TValidateOrFn>
      : [TValidateOrFn] extends [StandardSchemaV1<any, any>]
        ? // TODO: Check if `disableErrorFlat` is enabled, if so, return StandardSchemaV1Issue[][]
          StandardSchemaV1Issue[]
        : undefined)

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

type UnwrapFormAsyncValidateOrFnForInner<
  TValidateOrFn extends undefined | FormAsyncValidateOrFn<any>,
> = [TValidateOrFn] extends [FormValidateAsyncFn<any>]
  ? Awaited<ReturnType<TValidateOrFn>>
  : [TValidateOrFn] extends [StandardSchemaV1<infer TOut, any>]
    ? StandardBrandedSchemaV1<TOut>
    : undefined

export type UnwrapFormGroupAsyncValidateOrFn<
  TName extends string,
  TValidateOrFn extends undefined | FormGroupAsyncValidateOrFn<any, any, any>,
  TFormValidateOrFn extends undefined | FormAsyncValidateOrFn<any>,
> =
  | ([TFormValidateOrFn] extends [StandardSchemaV1<any, infer TStandardOut>]
      ? TName extends keyof TStandardOut
        ? StandardSchemaV1Issue[]
        : undefined
      : undefined)
  | (UnwrapFormAsyncValidateOrFnForInner<TFormValidateOrFn> extends infer TFormValidateVal
      ? TFormValidateVal extends { __standardSchemaV1: true }
        ? [DeepValue<TFormValidateVal, TName>] extends [never]
          ? undefined
          : StandardSchemaV1Issue[]
        : TFormValidateVal extends { fields: any }
          ? TName extends keyof TFormValidateVal['fields']
            ? TFormValidateVal['fields'][TName]
            : undefined
          : undefined
      : never)
  | ([TValidateOrFn] extends [FormGroupValidateAsyncFn<any, any, any>]
      ? Awaited<ReturnType<TValidateOrFn>>
      : [TValidateOrFn] extends [StandardSchemaV1<any, any>]
        ? // TODO: Check if `disableErrorFlat` is enabled, if so, return StandardSchemaV1Issue[][]
          StandardSchemaV1Issue[]
        : undefined)

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
   * A list of listeners which attach to the corresponding events
   */
  listeners?: FormGroupListeners<TParentData, TName, TData>
}

/**
 * An object type representing the options for a field in a form.
 */
export interface FieldOptions<
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
      TOnDynamicAsync
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
      TOnDynamicAsync
    > {}

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
    TOnDynamicAsync
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

    this.store = createStore(
      (
        prevVal:
          | FieldLikeState<
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

        if (prevVal && prevVal.value === value && prevVal.meta === meta) {
          return prevVal
        }

        return {
          value,
          meta,
        } as FieldLikeState<
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

  _isFieldNamePartOfGroup = (fieldName: string) => {
    // TODO: Does this `startWith` capture sub-field names properly? Probably not. :(
    return fieldName.startsWith(this.options.name)
  }

  _getRelatedFieldInfos = () => {
    return Object.entries(this.options.form.fieldInfo).reduce(
      (prev, [fieldName, fieldInfo]) => {
        if (this._isFieldNamePartOfGroup(fieldName) && fieldInfo) {
          prev[fieldName] = fieldInfo
        }
        return prev
      },
      {} as typeof this.options.form.fieldInfo,
    )
  }

  _isFieldsValid = () => {
    return Object.values(this._getRelatedFieldInfos()).every(
      (field) => field && field.instance && field.instance.state.meta.isValid,
    )
  }

  /**
   * Validates all fields using the correct handlers for a given validation cause.
   */
  validateAllFields = async (cause: ValidationCause) => {
    const fieldValidationPromises: Promise<ValidationError[]>[] = [] as any
    batch(() => {
      void Object.values(this._getRelatedFieldInfos()).forEach((field) => {
        if (!field || !field.instance) return
        const fieldInstance = field.instance
        // Validate the field
        fieldValidationPromises.push(
          // Remember, `validate` is either a sync operation or a promise
          Promise.resolve().then(() =>
            fieldInstance.validate(cause, { skipFormValidation: true }),
          ),
        )
        // If any fields are not touched
        if (!field.instance.state.meta.isTouched) {
          // Mark them as touched
          field.instance.setMeta((prev) => ({ ...prev, isTouched: true }))
        }
      })
    })

    const fieldErrorMapMap = await Promise.all(fieldValidationPromises)
    return fieldErrorMapMap.flat()
  }

  /**
   * @private
   */
  runValidator<
    TValue extends TStandardSchemaValidatorValue<any /* TFormData */> & {
      formApi: AnyFormApi
    },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FormValidateOrFn<any /* TFormData */>
      : FormAsyncValidateOrFn<any /* TFormData */>
    value: TValue
    type: TType
  }): unknown {
    if (isStandardSchemaValidator(props.validate)) {
      return standardSchemaValidators[props.type](
        props.value,
        props.validate,
      ) as never
    }

    return (props.validate as FormValidateFn<any>)(props.value) as never
  }

  /**
   * TODO: This code is mostly copied from FormApi, we should refactor to share
   *
   * This does not need to validate fields or the base form, as that's done elsewhere
   *
   * @private
   */
  validateSync = (cause: ValidationCause) => {
    const validates = getSyncValidatorArray(cause, {
      ...this.options,
      form: this,
      validationLogic: this.options.validationLogic || defaultValidationLogic,
    })

    let hasErrored = false as boolean

    batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue

        const rawError = this.runValidator({
          validate: validateObj.validate,
          value: {
            value: 0 /* this.state.values */,
            formApi: this.options.form as never,
            validationSource: 'field',
          },
          type: 'validate',
        })

        // TODO: Support form group error maps like so:
        /*
        {
          group: "Error on group",
          fields: {
            firstName: "Other error"
          }
        }
         */
        // const { formError, fieldErrors } = normalizeError<TFormData>(rawError)

        const groupError = normalizeError(rawError)
        const errorMapKey = getErrorMapKey(validateObj.cause)

        if (this.state.errorMap[errorMapKey] !== groupError) {
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: groupError,
            },
          }))
        }

        if (groupError /* || fieldErrors */) {
          hasErrored = true
        }
      }

      /**
       *  when we have an error for onSubmit in the state, we want
       *  to clear the error as soon as the user enters a valid value in the field
       */
      const submitErrKey = getErrorMapKey('submit')
      if (
        this.state.errorMap[submitErrKey] &&
        cause !== 'submit' &&
        !hasErrored
      ) {
        this.baseStore.setState((prev) => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            [submitErrKey]: undefined,
          },
        }))
      }

      /**
       *  when we have an error for onServer in the state, we want
       *  to clear the error as soon as the user enters a valid value in the field
       */
      const serverErrKey = getErrorMapKey('server')
      if (
        this.state.errorMap[serverErrKey] &&
        cause !== 'server' &&
        !hasErrored
      ) {
        this.baseStore.setState((prev) => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            [serverErrKey]: undefined,
          },
        }))
      }
    })

    return { hasErrored }
  }

  /**
   * @private
   */
  validate = (
    cause: ValidationCause,
    // TODO: Handle return type?
  ) => {
    // Attempt to sync validate first
    const { hasErrored /* fieldsErrorMap */ } = this.validateSync(cause)

    if (hasErrored && !this.options.asyncAlways) {
      return fieldsErrorMap
    }

    // No error? Attempt async validation
    return this.validateAsync(cause)
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

  _handleSubmit = async (): Promise<void> => {
    this.baseStore.setState((old) => ({
      ...old,
      // Submission attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
      isSubmitSuccessful: false, // Reset isSubmitSuccessful at the start of submission
    }))

    batch(() => {
      void Object.values(this._getRelatedFieldInfos()).forEach((field) => {
        if (!field || !field.instance) return
        // If any fields are not touched
        if (!field.instance.state.meta.isTouched) {
          // Mark them as touched
          field.instance.setMeta((prev) => ({ ...prev, isTouched: true }))
        }
      })
    })

    // // TODO: Add support for meta
    // const submitMetaArg =
    //   submitMeta ?? (this.options.onSubmitMeta as TSubmitMeta)

    this.baseStore.setState((d) => ({ ...d, isSubmitting: true }))

    const done = () => {
      this.baseStore.setState((prev) => ({ ...prev, isSubmitting: false }))
    }

    await this.validateAllFields('submit')

    // Fields are invalid, do not submit
    if (!this._isFieldsValid()) {
      done()

      this.options.onGroupSubmitInvalid?.({
        value: 0 /* this.state.values */,
        formApi: this.options.form,
        meta: {} as never /* submitMetaArg */,
      })

      return
    }

    await this.options.form.validate('submit', {
      dontUpdateFormErrorMap: true,
      filterFieldNames: this._isFieldNamePartOfGroup as never,
    })

    // Form is invalid, do not submit
    if (!this.options.form.state.isValid) {
      done()

      this.options.onGroupSubmitInvalid?.({
        value: 0 /* this.state.values */,
        formApi: this.options.form,
        meta: {} as never /* submitMetaArg */,
      })

      return
    }

    // TODO: Handle validators on the FormGroup itself
    // await this.validate('submit')
    //
    // if (!this.state.isValid) {
    //   done()
    //
    //   this.options.onGroupSubmitInvalid?.({
    //     value: 0 /* this.state.values */,
    //     formApi: this.options.form,
    //     meta: {} as never /* submitMetaArg */,
    //   })
    //
    //   return
    // }

    batch(() => {
      void Object.values(this._getRelatedFieldInfos()).forEach((field) => {
        if (!field || !field.instance) return
        field.instance.options.listeners?.onGroupSubmit?.({
          value: field.instance.state.value,
          fieldApi: field.instance,
        })
      })
    })

    this.options.listeners?.onSubmit?.({
      formApi: this.options.form,
      meta: {} as never /* submitMetaArg */,
    })

    try {
      await this.options.onGroupSubmit?.({
        value: 0,
        formApi: this.options.form,
        meta: {},
      })

      // Run the submit code
      await this.options.onGroupSubmit?.({
        value: 0, // this.state.values,
        formApi: this.options.form,
        meta: {}, // submitMetaArg,
      })

      batch(() => {
        this.baseStore.setState((prev) => ({
          ...prev,
          isSubmitted: true,
          isSubmitSuccessful: true, // Set isSubmitSuccessful to true on successful submission
        }))

        done()
      })
    } catch (err) {
      this.baseStore.setState((prev) => ({
        ...prev,
        isSubmitSuccessful: false, // Ensure isSubmitSuccessful is false if an error occurs
      }))

      done()

      throw err
    }
  }

  handleSubmit(): Promise<void> {
    return this._handleSubmit()
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
