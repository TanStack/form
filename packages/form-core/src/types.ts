import type {
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  UnwrapFieldAsyncValidateOrFn,
  UnwrapFieldValidateOrFn,
} from './FieldApi'
import type {
  DeepKeys,
  DeepKeysOfType,
  DeepValue,
  UnwrapOneLevelOfArray,
} from './util-types'
import type { Updater } from './utils'
import type {
  AnyFormApi,
  FormApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ValidationMeta,
} from './FormApi'
import type { ReadonlyStore } from '@tanstack/store'

export type ValidationError = unknown

export type ValidationSource = 'form' | 'field'

/**
 * "server" is only intended for SSR/SSG validation and should not execute anything
 * @private
 */
export type ValidationCause =
  | 'change'
  | 'blur'
  | 'submit'
  | 'mount'
  | 'server'
  | 'dynamic'

/**
 * @private
 */
export type ListenerCause = 'change' | 'blur' | 'submit' | 'mount'

/**
 * @private
 */
export type ValidationErrorMapKeys = `on${Capitalize<ValidationCause>}`

/**
 * @private
 */
export type ValidationErrorMap<
  TOnMountReturn = unknown,
  TOnChangeReturn = unknown,
  TOnChangeAsyncReturn = unknown,
  TOnBlurReturn = unknown,
  TOnBlurAsyncReturn = unknown,
  TOnSubmitReturn = unknown,
  TOnSubmitAsyncReturn = unknown,
  TOnDynamicReturn = unknown,
  TOnDynamicAsyncReturn = unknown,
  TOnServerReturn = unknown,
> = {
  onMount?: TOnMountReturn
  onChange?: TOnChangeReturn | TOnChangeAsyncReturn
  onBlur?: TOnBlurReturn | TOnBlurAsyncReturn
  onSubmit?: TOnSubmitReturn | TOnSubmitAsyncReturn
  onDynamic?: TOnDynamicReturn | TOnDynamicAsyncReturn
  onServer?: TOnServerReturn
}

/**
 * @private allows tracking the source of the errors in the error map
 */
export type ValidationErrorMapSource = {
  onMount?: ValidationSource
  onChange?: ValidationSource
  onBlur?: ValidationSource
  onSubmit?: ValidationSource
  onServer?: ValidationSource
  onDynamic?: ValidationSource
}

/**
 * @private
 */
export type FormValidationErrorMap<
  TFormData = unknown,
  TOnMountReturn = unknown,
  TOnChangeReturn = unknown,
  TOnChangeAsyncReturn = unknown,
  TOnBlurReturn = unknown,
  TOnBlurAsyncReturn = unknown,
  TOnSubmitReturn = unknown,
  TOnSubmitAsyncReturn = unknown,
  TOnDynamicReturn = unknown,
  TOnDynamicAsyncReturn = unknown,
  TOnServerReturn = unknown,
> = {
  onMount?: TOnMountReturn | GlobalFormValidationError<TFormData>
  onChange?:
    | TOnChangeReturn
    | TOnChangeAsyncReturn
    | GlobalFormValidationError<TFormData>
  onBlur?:
    | TOnBlurReturn
    | TOnBlurAsyncReturn
    | GlobalFormValidationError<TFormData>
  onSubmit?:
    | TOnSubmitReturn
    | TOnSubmitAsyncReturn
    | GlobalFormValidationError<TFormData>
  onDynamic?:
    | TOnDynamicReturn
    | TOnDynamicAsyncReturn
    | GlobalFormValidationError<TFormData>
  onServer?: TOnServerReturn
}

export type FormValidationError<TFormData> =
  | ValidationError
  | GlobalFormValidationError<TFormData>

/**
 * @private
 *
 * @example
 * ```tsx
 * {
 *   form: 'This form contains an error',
 *   fields: {
 *     age: "Must be 13 or older to register"
 *   }
 * }
 * ````
 */
export type GlobalFormValidationError<TFormData> = {
  form?: ValidationError
  fields: Partial<Record<DeepKeys<TFormData>, ValidationError>>
}

export type ExtractGlobalFormError<TFormError> =
  TFormError extends GlobalFormValidationError<any>
    ? TFormError['form']
    : TFormError

/**
 * @private
 */
export interface UpdateMetaOptions {
  /**
   * @default false
   */
  dontUpdateMeta?: boolean
  /**
   * @default false
   */
  dontValidate?: boolean
  /**
   * @default false
   */
  dontRunListeners?: boolean
}

/**
 * @private
 */
export interface FormLikeAPI<TFormData, TSubmitMeta> {
  /**
   * Validates all fields using the correct handlers for a given validation cause.
   */
  validateAllFields: (cause: ValidationCause) => Promise<unknown[]>

  /**
   * Validates the children of a specified array in the form starting from a given index until the end using the correct handlers for a given validation type.
   */
  validateArrayFieldsStartingFrom: <
    TField extends DeepKeysOfType<TFormData, any[]>,
  >(
    field: TField,
    index: number,
    cause: ValidationCause,
  ) => Promise<unknown[]>

  /**
   * Validates a specified field in the form using the correct handlers for a given validation type.
   */
  validateField: <TField extends DeepKeys<TFormData>>(
    field: TField,
    cause: ValidationCause,
  ) => unknown[] | Promise<unknown[]>

  /**
   * Handles the form submission, performs validation, and calls the appropriate onSubmit or onSubmitInvalid callbacks.
   */
  handleSubmit(): Promise<void>
  handleSubmit(submitMeta: TSubmitMeta): Promise<void>

  /**
   * Gets the value of the specified field.
   */
  getFieldValue: <TField extends DeepKeys<TFormData>>(
    field: TField,
  ) => DeepValue<TFormData, TField>

  /**
   * Gets the metadata of the specified field.
   */
  getFieldMeta: <TField extends DeepKeys<TFormData>>(
    field: TField,
  ) => AnyFieldLikeMeta | undefined

  /**
   * Updates the metadata of the specified field.
   */
  setFieldMeta: <TField extends DeepKeys<TFormData>>(
    field: TField,
    updater: Updater<AnyFieldLikeMetaBase>,
  ) => void

  /**
   * Sets the value of the specified field and optionally updates the touched state.
   */
  setFieldValue: <TField extends DeepKeys<TFormData>>(
    field: TField,
    updater: Updater<DeepValue<TFormData, TField>>,
    opts?: UpdateMetaOptions,
  ) => void

  /**
   * Delete the specified field. Also deletes all subfields if there are any.
   */
  deleteField: <TField extends DeepKeys<TFormData>>(field: TField) => void

  /**
   * Pushes a value into an array field.
   */
  pushFieldValue: <TField extends DeepKeysOfType<TFormData, any[]>>(
    field: TField,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => void

  /**
   * Insert a value into an array field at the specified index.
   */
  insertFieldValue: <TField extends DeepKeysOfType<TFormData, any[]>>(
    field: TField,
    index: number,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => Promise<void>

  /**
   * Replaces a value into an array field at the specified index.
   */
  replaceFieldValue: <TField extends DeepKeysOfType<TFormData, any[]>>(
    field: TField,
    index: number,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => Promise<void>

  /**
   * Removes a value from an array field at the specified index.
   */
  removeFieldValue: <TField extends DeepKeysOfType<TFormData, any[]>>(
    field: TField,
    index: number,
    opts?: UpdateMetaOptions,
  ) => Promise<void>

  /**
   * Swaps the values at the specified indices within an array field.
   */
  swapFieldValues: <TField extends DeepKeysOfType<TFormData, any[]>>(
    field: TField,
    index1: number,
    index2: number,
    opts?: UpdateMetaOptions,
  ) => void

  /**
   * Moves the value at the first specified index to the second specified index within an array field.
   */
  moveFieldValues: <TField extends DeepKeysOfType<TFormData, any[]>>(
    field: TField,
    index1: number,
    index2: number,
    opts?: UpdateMetaOptions,
  ) => void

  /**
   * Clear all values within an array field.
   */
  clearFieldValues: <TField extends DeepKeysOfType<TFormData, any[]>>(
    field: TField,
    opts?: UpdateMetaOptions,
  ) => void

  /**
   * Resets the field value and meta to default state
   */
  resetField: <TField extends DeepKeys<TFormData>>(field: TField) => void
}

/**
 * @private
 */
export type FieldLikeMetaBase<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
> = {
  /**
   * A flag indicating whether the field has been touched.
   */
  isTouched: boolean
  /**
   * A flag indicating whether the field has been blurred.
   */
  isBlurred: boolean
  /**
   * A flag that is `true` if the field's value has been modified by the user. Opposite of `isPristine`.
   */
  isDirty: boolean
  /**
   * A map of errors related to the field value.
   */
  errorMap: ValidationErrorMap<
    UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>,
    UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>,
    UnwrapFieldAsyncValidateOrFn<TName, TOnChangeAsync, TFormOnChangeAsync>,
    UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>,
    UnwrapFieldAsyncValidateOrFn<TName, TOnBlurAsync, TFormOnBlurAsync>,
    UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>,
    UnwrapFieldAsyncValidateOrFn<TName, TOnSubmitAsync, TFormOnSubmitAsync>,
    UnwrapFieldValidateOrFn<TName, TOnDynamic, TFormOnDynamic>,
    UnwrapFieldAsyncValidateOrFn<TName, TOnDynamicAsync, TFormOnDynamicAsync>
  >

  /**
   * @private allows tracking the source of the errors in the error map
   */
  errorSourceMap: ValidationErrorMapSource
  /**
   * A flag indicating whether the field is currently being validated.
   */
  isValidating: boolean
}

/**
 * @private
 */
export type AnyFieldLikeMetaBase = FieldLikeMetaBase<
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

/**
 * @private
 */
export type FieldLikeMetaDerived<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
> = {
  /**
   * An array of errors related to the field value.
   */
  errors: Array<
    | UnwrapOneLevelOfArray<
        UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldAsyncValidateOrFn<TName, TOnChangeAsync, TFormOnChangeAsync>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldAsyncValidateOrFn<TName, TOnBlurAsync, TFormOnBlurAsync>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldAsyncValidateOrFn<TName, TOnSubmitAsync, TFormOnSubmitAsync>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldValidateOrFn<TName, TOnDynamic, TFormOnDynamic>
      >
    | UnwrapOneLevelOfArray<
        UnwrapFieldAsyncValidateOrFn<
          TName,
          TOnDynamicAsync,
          TFormOnDynamicAsync
        >
      >
  >
  /**
   * A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.
   */
  isPristine: boolean
  /**
   * A boolean indicating if the field is valid. Evaluates `true` if there are no field errors.
   */
  isValid: boolean
  /**
   * A flag indicating whether the field's current value is the default value
   */
  isDefaultValue: boolean
}

/**
 * @private
 * An object type representing the metadata of a field in a form.
 */
export type FieldLikeMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
> = FieldLikeMetaBase<
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
> &
  FieldLikeMetaDerived<
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

/**
 * @private
 */
export type AnyFieldLikeMeta = FieldLikeMeta<
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

/**
 * @private
 * An object type representing the state of a field.
 */
export type FieldLikeState<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
> = {
  /**
   * The current value of the field.
   */
  value: TData
  /**
   * The current metadata of the field.
   */
  meta: FieldLikeMeta<
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
}

/**
 * @private
 * An object type representing the options for a field in a form.
 */
export interface FieldLikeOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
> {
  /**
   * The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.
   */
  name: TName
  /**
   * An optional default value for the field.
   */
  defaultValue?: NoInfer<TData>
  /**
   * The default time to debounce async validation if there is not a more specific debounce time passed.
   */
  asyncDebounceMs?: number
  /**
   * If `true`, always run async validation, even if there are errors emitted during synchronous validation.
   */
  asyncAlways?: boolean
  /**
   * An optional object with default metadata for the field.
   */
  defaultMeta?: Partial<
    FieldLikeMeta<
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
  >
  /**
   * Disable the `flat(1)` operation on `field.errors`. This is useful if you want to keep the error structure as is. Not suggested for most use-cases.
   */
  disableErrorFlat?: boolean
}

/**
 * @private
 * An object type representing the required options for the FieldApi class.
 */
export interface FieldLikeApiOptions<
  in out TParentData,
  in out TName extends DeepKeys<TParentData>,
  in out TData extends DeepValue<TParentData, TName>,
  in out TOnMount extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnChange extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnBlur extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmit extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamic extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
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
> extends FieldLikeOptions<
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
> {
  form: FormApi<
    TParentData,
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
}

/**
 * @private
 */
export interface FieldLikeAPI<
  in out TParentData,
  in out TName extends DeepKeys<TParentData>,
  in out TData extends DeepValue<TParentData, TName>,
  in out TOnMount extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnChange extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnBlur extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmit extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamic extends
    | undefined
    | FieldValidateOrFn<TParentData, TName, TData>,
  in out TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
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
  TExtraOptions = {},
> {
  form: AnyFormApi
  options: FieldLikeApiOptions<
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
  > &
    TExtraOptions
  store: ReadonlyStore<
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
   * The field name.
   */
  name: TName
  mount: () => () => void

  setValue: (updater: Updater<TData>, options?: UpdateMetaOptions) => void
  getMeta: () => AnyFieldLikeMeta
  setMeta: (updater: Updater<AnyFieldLikeMetaBase>) => void
  getInfo: () => FieldInfo<TParentData>
  validate: (
    cause: ValidationCause,
    opts?: { skipFormValidation?: boolean },
  ) => ValidationError[] | Promise<ValidationError[]>
  /**
   * @private
   */
  triggerOnChangeListener: () => void
  /**
   * @private
   */
  triggerOnSubmitListener: () => void
}

/**
 * @private
 */
export interface FieldInfo<TParentData> {
  instance: FieldLikeAPI<
    TParentData,
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
  > | null
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
}
