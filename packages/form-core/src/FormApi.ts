import { Derived, Store, batch } from '@tanstack/store'
import {
  deleteBy,
  functionalUpdate,
  getAsyncValidatorArray,
  getBy,
  getSyncValidatorArray,
  isGlobalFormValidationError,
  isNonEmptyArray,
  setBy,
  shallow,
} from './utils'
import {
  isStandardSchemaValidator,
  standardSchemaValidators,
} from './standardSchemaValidator'
import { metaHelper } from './metaHelper'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
  TStandardSchemaValidatorValue,
} from './standardSchemaValidator'
import type { AnyFieldMeta, AnyFieldMetaBase, FieldApi } from './FieldApi'
import type {
  FormValidationError,
  FormValidationErrorMap,
  UpdateMetaOptions,
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
  ValidationErrorMapKeys,
} from './types'
import type { DeepKeys, DeepValue } from './util-types'
import type { Updater } from './utils'

/**
 * @private
 */
// TODO: Add the `Unwrap` type to the errors
type FormErrorMapFromValidator<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
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

export type FormValidateFn<TFormData> = (props: {
  value: TFormData
  formApi: FormApi<
    TFormData,
    // This is technically an edge-type; which we try to keep non-`any`, but in this case
    // It's referring to an inaccessible type from the field validate function inner types, so it's not a big deal
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
export type FormValidateOrFn<TFormData> =
  | FormValidateFn<TFormData>
  | StandardSchemaV1<TFormData, unknown>

export type UnwrapFormValidateOrFn<
  TValidateOrFn extends undefined | FormValidateOrFn<any>,
> = [TValidateOrFn] extends [FormValidateFn<any>]
  ? ReturnType<TValidateOrFn>
  : [TValidateOrFn] extends [StandardSchemaV1<any, any>]
    ? Record<string, StandardSchemaV1Issue[]>
    : undefined

/**
 * @private
 */
export type FormValidateAsyncFn<TFormData> = (props: {
  value: TFormData
  formApi: FormApi<
    TFormData,
    // This is technically an edge-type; which we try to keep non-`any`, but in this case
    // It's referring to an inaccessible type from the field validate function inner types, so it's not a big deal
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

export type FormValidator<TFormData, TType, TFn = unknown> = {
  validate(options: { value: TType }, fn: TFn): ValidationError
  validateAsync(
    options: { value: TType },
    fn: TFn,
  ): Promise<FormValidationError<TFormData>>
}

type ValidationPromiseResult<TFormData> =
  | {
      fieldErrors: Partial<Record<DeepKeys<TFormData>, ValidationError>>
      errorMapKey: ValidationErrorMapKeys
    }
  | undefined

/**
 * @private
 */
export type FormAsyncValidateOrFn<TFormData> =
  | FormValidateAsyncFn<TFormData>
  | StandardSchemaV1<TFormData, unknown>

export type UnwrapFormAsyncValidateOrFn<
  TValidateOrFn extends undefined | FormAsyncValidateOrFn<any>,
> = [TValidateOrFn] extends [FormValidateAsyncFn<any>]
  ? Awaited<ReturnType<TValidateOrFn>>
  : [TValidateOrFn] extends [StandardSchemaV1<any, any>]
    ? Record<string, StandardSchemaV1Issue[]>
    : undefined

export interface FormValidators<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
> {
  /**
   * Optional function that fires as soon as the component mounts.
   */
  onMount?: TOnMount
  /**
   * Optional function that checks the validity of your data whenever a value changes
   */
  onChange?: TOnChange
  /**
   * Optional onChange asynchronous counterpart to onChange. Useful for more complex validation logic that might involve server requests.
   */
  onChangeAsync?: TOnChangeAsync
  /**
   * The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.
   */
  onChangeAsyncDebounceMs?: number
  /**
   * Optional function that validates the form data when a field loses focus, returns a `FormValidationError`
   */
  onBlur?: TOnBlur
  /**
   * Optional onBlur asynchronous validation method for when a field loses focus returns a ` FormValidationError` or a promise of `Promise<FormValidationError>`
   */
  onBlurAsync?: TOnBlurAsync
  /**
   * The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.
   */
  onBlurAsyncDebounceMs?: number
  onSubmit?: TOnSubmit
  onSubmitAsync?: TOnSubmitAsync
}

/**
 * @private
 */
export interface FormTransform<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta = never,
> {
  fn: (
    formBase: FormApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >,
  ) => FormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >
  deps: unknown[]
}

/**
 * An object representing the options for a form.
 */
export interface FormOptions<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta = never,
> {
  /**
   * Set initial values for your form.
   */
  defaultValues?: TFormData
  /**
   * The default state for the form.
   */
  defaultState?: Partial<
    FormState<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer
    >
  >
  /**
   * If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.
   */
  asyncAlways?: boolean
  /**
   * Optional time in milliseconds if you want to introduce a delay before firing off an async action.
   */
  asyncDebounceMs?: number
  /**
   * A list of validators to pass to the form
   */
  validators?: FormValidators<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync
  >

  /**
   * onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props
   */
  onSubmitMeta?: TSubmitMeta

  /**
   * A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`
   */
  onSubmit?: (props: {
    value: TFormData
    formApi: FormApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >
    meta: TSubmitMeta
  }) => any | Promise<any>
  /**
   * Specify an action for scenarios where the user tries to submit an invalid form.
   */
  onSubmitInvalid?: (props: {
    value: TFormData
    formApi: FormApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >
  }) => void
  transform?: FormTransform<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >
}

/**
 * An object representing the validation metadata for a field. Not intended for public usage.
 */
export type ValidationMeta = {
  /**
   * An abort controller stored in memory to cancel previous async validation attempts.
   */
  lastAbortController: AbortController
}

/**
 * An object representing the field information for a specific field within the form.
 */
export type FieldInfo<TFormData> = {
  /**
   * An instance of the FieldAPI.
   */
  instance: FieldApi<
    TFormData,
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
  /**
   * A record of field validation internal handling.
   */
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
}

/**
 * An object representing the current state of the form.
 */
export type BaseFormState<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
> = {
  /**
   * The current values of the form fields.
   */
  values: TFormData
  /**
   * The error map for the form itself.
   */
  errorMap: FormValidationErrorMap<
    UnwrapFormValidateOrFn<TOnMount>,
    UnwrapFormValidateOrFn<TOnChange>,
    UnwrapFormAsyncValidateOrFn<TOnChangeAsync>,
    UnwrapFormValidateOrFn<TOnBlur>,
    UnwrapFormAsyncValidateOrFn<TOnBlurAsync>,
    UnwrapFormValidateOrFn<TOnSubmit>,
    UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>,
    UnwrapFormAsyncValidateOrFn<TOnServer>
  >
  /**
   * An internal mechanism used for keeping track of validation logic in a form.
   */
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
  /**
   * A record of field metadata for each field in the form, not including the derived properties, like `errors` and such
   */
  fieldMetaBase: Record<DeepKeys<TFormData>, AnyFieldMetaBase>
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
   * A boolean indicating if the form has been submitted.
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
}

export type DerivedFormState<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
> = {
  /**
   * A boolean indicating if the form is currently validating.
   */
  isFormValidating: boolean
  /**
   * A boolean indicating if the form is valid.
   */
  isFormValid: boolean
  /**
   * The error array for the form itself.
   */
  errors: Array<
    | UnwrapFormValidateOrFn<TOnMount>
    | UnwrapFormValidateOrFn<TOnChange>
    | UnwrapFormAsyncValidateOrFn<TOnChangeAsync>
    | UnwrapFormValidateOrFn<TOnBlur>
    | UnwrapFormAsyncValidateOrFn<TOnBlurAsync>
    | UnwrapFormValidateOrFn<TOnSubmit>
    | UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>
    | UnwrapFormAsyncValidateOrFn<TOnServer>
  >
  /**
   * A boolean indicating if any of the form fields are currently validating.
   */
  isFieldsValidating: boolean
  /**
   * A boolean indicating if all the form fields are valid.
   */
  isFieldsValid: boolean
  /**
   * A boolean indicating if any of the form fields have been touched.
   */
  isTouched: boolean
  /**
   * A boolean indicating if any of the form fields have been blurred.
   */
  isBlurred: boolean
  /**
   * A boolean indicating if any of the form's fields' values have been modified by the user. `True` if the user have modified at least one of the fields. Opposite of `isPristine`.
   */
  isDirty: boolean
  /**
   * A boolean indicating if none of the form's fields' values have been modified by the user. `True` if the user have not modified any of the fields. Opposite of `isDirty`.
   */
  isPristine: boolean
  /**
   * A boolean indicating if the form and all its fields are valid.
   */
  isValid: boolean
  /**
   * A boolean indicating if the form can be submitted based on its current state.
   */
  canSubmit: boolean
  /**
   * A record of field metadata for each field in the form.
   */
  fieldMeta: Record<DeepKeys<TFormData>, AnyFieldMeta>
}

export type FormState<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
> = BaseFormState<
  TFormData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnServer
> &
  DerivedFormState<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer
  >

export type AnyFormState = FormState<
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

function getDefaultFormState<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
>(
  defaultState: Partial<
    FormState<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer
    >
  >,
): BaseFormState<
  TFormData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnServer
> {
  return {
    values: defaultState.values ?? ({} as never),
    errorMap: defaultState.errorMap ?? {},
    fieldMetaBase: defaultState.fieldMetaBase ?? ({} as never),
    isSubmitted: defaultState.isSubmitted ?? false,
    isSubmitting: defaultState.isSubmitting ?? false,
    isValidating: defaultState.isValidating ?? false,
    submissionAttempts: defaultState.submissionAttempts ?? 0,
    validationMetaMap: defaultState.validationMetaMap ?? {
      onChange: undefined,
      onBlur: undefined,
      onSubmit: undefined,
      onMount: undefined,
      onServer: undefined,
    },
  }
}

/**
 * @public
 *
 * A type representing the Form API with all generics set to `any` for convenience.
 */
export type AnyFormApi = FormApi<
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
 * A class representing the Form API. It handles the logic and interactions with the form state.
 *
 * Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
 * hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
 * However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.
 */
export class FormApi<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta = never,
> {
  /**
   * The options for the form.
   */
  options: FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  > = {}
  baseStore!: Store<
    BaseFormState<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer
    >
  >
  fieldMetaDerived!: Derived<Record<DeepKeys<TFormData>, AnyFieldMeta>>
  store!: Derived<
    FormState<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer
    >
  >
  /**
   * A record of field information for each field in the form.
   */
  fieldInfo: Record<DeepKeys<TFormData>, FieldInfo<TFormData>> = {} as any

  get state() {
    return this.store.state
  }

  /**
   * @private
   */
  prevTransformArray: unknown[] = []

  /**
   * Constructs a new `FormApi` instance with the given form options.
   */
  constructor(
    opts?: FormOptions<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >,
  ) {
    this.baseStore = new Store(
      getDefaultFormState({
        ...(opts?.defaultState as any),
        values: opts?.defaultValues ?? opts?.defaultState?.values,
        isFormValid: true,
      }),
    )

    this.fieldMetaDerived = new Derived({
      deps: [this.baseStore],
      fn: ({ prevDepVals, currDepVals, prevVal: _prevVal }) => {
        const prevVal = _prevVal as
          | Record<DeepKeys<TFormData>, AnyFieldMeta>
          | undefined
        const prevBaseStore = prevDepVals?.[0]
        const currBaseStore = currDepVals[0]

        let originalMetaCount = 0

        const fieldMeta = {} as FormState<
          TFormData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync,
          TOnServer
        >['fieldMeta']

        for (const fieldName of Object.keys(
          currBaseStore.fieldMetaBase,
        ) as Array<keyof typeof currBaseStore.fieldMetaBase>) {
          const currBaseVal = currBaseStore.fieldMetaBase[
            fieldName as never
          ] as AnyFieldMetaBase

          const prevBaseVal = prevBaseStore?.fieldMetaBase[
            fieldName as never
          ] as AnyFieldMetaBase | undefined

          const prevFieldInfo =
            prevVal?.[fieldName as never as keyof typeof prevVal]

          let fieldErrors = prevFieldInfo?.errors
          if (!prevBaseVal || currBaseVal.errorMap !== prevBaseVal.errorMap) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            fieldErrors = Object.values(currBaseVal.errorMap ?? {}).filter(
              (val) => val !== undefined,
            ) as never

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const fieldInstance = this.getFieldInfo(fieldName)?.instance

            if (fieldInstance && !fieldInstance.options.disableErrorFlat) {
              fieldErrors = (fieldErrors as undefined | string[])?.flat(
                1,
              ) as never
            }
          }

          // As a primitive, we don't need to aggressively persist the same referential value for performance reasons
          const isFieldPristine = !currBaseVal.isDirty

          if (
            prevFieldInfo &&
            prevFieldInfo.isPristine === isFieldPristine &&
            prevFieldInfo.errors === fieldErrors &&
            currBaseVal === prevBaseVal
          ) {
            fieldMeta[fieldName] = prevFieldInfo
            originalMetaCount++
            continue
          }

          fieldMeta[fieldName] = {
            ...currBaseVal,
            errors: fieldErrors,
            isPristine: isFieldPristine,
          } as AnyFieldMeta
        }

        if (
          prevVal &&
          originalMetaCount === Object.keys(currBaseStore.fieldMetaBase).length
        ) {
          return prevVal
        }

        return fieldMeta
      },
    })

    this.store = new Derived({
      deps: [this.baseStore, this.fieldMetaDerived],
      fn: ({ prevDepVals, currDepVals, prevVal: _prevVal }) => {
        const prevVal = _prevVal as
          | FormState<
              TFormData,
              TOnMount,
              TOnChange,
              TOnChangeAsync,
              TOnBlur,
              TOnBlurAsync,
              TOnSubmit,
              TOnSubmitAsync,
              TOnServer
            >
          | undefined
        const prevBaseStore = prevDepVals?.[0]
        const currBaseStore = currDepVals[0]

        // Computed state
        const fieldMetaValues = Object.values(currBaseStore.fieldMetaBase) as (
          | AnyFieldMeta
          | undefined
        )[]

        const isFieldsValidating = fieldMetaValues.some(
          (field) => field?.isValidating,
        )

        const isFieldsValid = !fieldMetaValues.some(
          (field) =>
            field?.errorMap &&
            isNonEmptyArray(Object.values(field.errorMap).filter(Boolean)),
        )

        const isTouched = fieldMetaValues.some((field) => field?.isTouched)
        const isBlurred = fieldMetaValues.some((field) => field?.isBlurred)

        const shouldInvalidateOnMount =
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          isTouched && currBaseStore?.errorMap?.onMount

        const isDirty = fieldMetaValues.some((field) => field?.isDirty)
        const isPristine = !isDirty

        const hasOnMountError = Boolean(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          currBaseStore.errorMap?.onMount ||
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            fieldMetaValues.some((f) => f?.errorMap?.onMount),
        )

        const isValidating = !!isFieldsValidating

        // As `errors` is not a primitive, we need to aggressively persist the same referencial value for performance reasons
        let errors = prevVal?.errors ?? []
        if (
          !prevBaseStore ||
          currBaseStore.errorMap !== prevBaseStore.errorMap
        ) {
          errors = Object.values(currBaseStore.errorMap).reduce<
            Array<
              | UnwrapFormValidateOrFn<TOnMount>
              | UnwrapFormValidateOrFn<TOnChange>
              | UnwrapFormAsyncValidateOrFn<TOnChangeAsync>
              | UnwrapFormValidateOrFn<TOnBlur>
              | UnwrapFormAsyncValidateOrFn<TOnBlurAsync>
              | UnwrapFormValidateOrFn<TOnSubmit>
              | UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>
              | UnwrapFormAsyncValidateOrFn<TOnServer>
            >
          >((prev, curr) => {
            if (curr === undefined) return prev
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (curr && isGlobalFormValidationError(curr)) {
              prev.push(curr.form as never)
              return prev
            }
            prev.push(curr as never)
            return prev
          }, [])
        }

        const isFormValid = errors.length === 0
        const isValid = isFieldsValid && isFormValid
        const canSubmit =
          (currBaseStore.submissionAttempts === 0 &&
            !isTouched &&
            !hasOnMountError) ||
          (!isValidating && !currBaseStore.isSubmitting && isValid)

        let errorMap = currBaseStore.errorMap
        if (shouldInvalidateOnMount) {
          errors = errors.filter(
            (err) => err !== currBaseStore.errorMap.onMount,
          )
          errorMap = Object.assign(errorMap, { onMount: undefined })
        }

        if (
          prevVal &&
          prevBaseStore &&
          prevVal.errorMap === errorMap &&
          prevVal.fieldMeta === this.fieldMetaDerived.state &&
          prevVal.errors === errors &&
          prevVal.isFieldsValidating === isFieldsValidating &&
          prevVal.isFieldsValid === isFieldsValid &&
          prevVal.isFormValid === isFormValid &&
          prevVal.isValid === isValid &&
          prevVal.canSubmit === canSubmit &&
          prevVal.isTouched === isTouched &&
          prevVal.isBlurred === isBlurred &&
          prevVal.isPristine === isPristine &&
          prevVal.isDirty === isDirty &&
          shallow(prevBaseStore, currBaseStore)
        ) {
          return prevVal
        }

        let state = {
          ...currBaseStore,
          errorMap,
          fieldMeta: this.fieldMetaDerived.state,
          errors,
          isFieldsValidating,
          isFieldsValid,
          isFormValid,
          isValid,
          canSubmit,
          isTouched,
          isBlurred,
          isPristine,
          isDirty,
        } as FormState<
          TFormData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync,
          TOnServer
        >

        // Only run transform if state has shallowly changed - IE how React.useEffect works
        const transformArray = this.options.transform?.deps ?? []
        const shouldTransform =
          transformArray.length !== this.prevTransformArray.length ||
          transformArray.some((val, i) => val !== this.prevTransformArray[i])

        if (shouldTransform) {
          const newObj = Object.assign({}, this, { state })
          // This mutates the state
          this.options.transform?.fn(newObj)
          state = newObj.state
          this.prevTransformArray = transformArray
        }

        return state
      },
    })

    this.handleSubmit = this.handleSubmit.bind(this)

    this.update(opts || {})
  }

  /**
   * @private
   */
  runValidator<
    TValue extends TStandardSchemaValidatorValue<TFormData> & {
      formApi: AnyFormApi
    },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FormValidateOrFn<TFormData>
      : FormAsyncValidateOrFn<TFormData>
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

  mount = () => {
    const cleanupFieldMetaDerived = this.fieldMetaDerived.mount()
    const cleanupStoreDerived = this.store.mount()
    const cleanup = () => {
      cleanupFieldMetaDerived()
      cleanupStoreDerived()
    }
    const { onMount } = this.options.validators || {}
    if (!onMount) return cleanup
    this.validateSync('mount')

    return cleanup
  }

  /**
   * Updates the form options and form state.
   */
  update = (
    options?: FormOptions<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >,
  ) => {
    if (!options) return

    const oldOptions = this.options

    // Options need to be updated first so that when the store is updated, the state is correct for the derived state
    this.options = options

    const shouldUpdateValues =
      options.defaultValues &&
      !shallow(options.defaultValues, oldOptions.defaultValues) &&
      !this.state.isTouched

    const shouldUpdateState =
      !shallow(options.defaultState, oldOptions.defaultState) &&
      !this.state.isTouched

    if (!shouldUpdateValues && !shouldUpdateState) return

    batch(() => {
      this.baseStore.setState(() =>
        getDefaultFormState(
          Object.assign(
            {},
            this.state as any,

            shouldUpdateState ? options.defaultState : {},

            shouldUpdateValues
              ? {
                  values: options.defaultValues,
                }
              : {},
          ),
        ),
      )
    })
  }

  /**
   * Resets the form state to the default values.
   * If values are provided, the form will be reset to those values instead and the default values will be updated.
   *
   * @param values - Optional values to reset the form to.
   * @param opts - Optional options to control the reset behavior.
   */
  reset = (values?: TFormData, opts?: { keepDefaultValues?: boolean }) => {
    const { fieldMeta: currentFieldMeta } = this.state
    const fieldMetaBase = this.resetFieldMeta(currentFieldMeta)

    if (values && !opts?.keepDefaultValues) {
      this.options = {
        ...this.options,
        defaultValues: values,
      }
    }

    this.baseStore.setState(() =>
      getDefaultFormState({
        ...(this.options.defaultState as any),
        values:
          values ??
          this.options.defaultValues ??
          this.options.defaultState?.values,
        fieldMetaBase,
      }),
    )
  }

  /**
   * Validates all fields using the correct handlers for a given validation cause.
   */
  validateAllFields = async (cause: ValidationCause) => {
    const fieldValidationPromises: Promise<ValidationError[]>[] = [] as any
    batch(() => {
      void (Object.values(this.fieldInfo) as FieldInfo<any>[]).forEach(
        (field) => {
          if (!field.instance) return
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
        },
      )
    })

    const fieldErrorMapMap = await Promise.all(fieldValidationPromises)
    return fieldErrorMapMap.flat()
  }

  /**
   * Validates the children of a specified array in the form starting from a given index until the end using the correct handlers for a given validation type.
   */
  validateArrayFieldsStartingFrom = async <TField extends DeepKeys<TFormData>>(
    field: TField,
    index: number,
    cause: ValidationCause,
  ) => {
    const currentValue = this.getFieldValue(field)

    const lastIndex = Array.isArray(currentValue)
      ? Math.max(currentValue.length - 1, 0)
      : null

    // We have to validate all fields that have shifted (at least the current field)
    const fieldKeysToValidate = [`${field}[${index}]`]
    for (let i = index + 1; i <= (lastIndex ?? 0); i++) {
      fieldKeysToValidate.push(`${field}[${i}]`)
    }

    // We also have to include all fields that are nested in the shifted fields
    const fieldsToValidate = Object.keys(this.fieldInfo).filter((fieldKey) =>
      fieldKeysToValidate.some((key) => fieldKey.startsWith(key)),
    ) as DeepKeys<TFormData>[]

    // Validate the fields
    const fieldValidationPromises: Promise<ValidationError[]>[] = [] as any
    batch(() => {
      fieldsToValidate.forEach((nestedField) => {
        fieldValidationPromises.push(
          Promise.resolve().then(() => this.validateField(nestedField, cause)),
        )
      })
    })

    const fieldErrorMapMap = await Promise.all(fieldValidationPromises)
    return fieldErrorMapMap.flat()
  }

  /**
   * Validates a specified field in the form using the correct handlers for a given validation type.
   */
  validateField = <TField extends DeepKeys<TFormData>>(
    field: TField,
    cause: ValidationCause,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const fieldInstance = this.fieldInfo[field]?.instance
    if (!fieldInstance) return []

    // If the field is not touched (same logic as in validateAllFields)
    if (!fieldInstance.state.meta.isTouched) {
      // Mark it as touched
      fieldInstance.setMeta((prev) => ({ ...prev, isTouched: true }))
    }

    return fieldInstance.validate(cause)
  }

  /**
   * TODO: This code is copied from FieldApi, we should refactor to share
   * @private
   */
  validateSync = (
    cause: ValidationCause,
  ): {
    hasErrored: boolean
    fieldsErrorMap: FormErrorMapFromValidator<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync
    >
  } => {
    const validates = getSyncValidatorArray(cause, this.options)
    let hasErrored = false as boolean

    const fieldsErrorMap: FormErrorMapFromValidator<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync
    > = {}

    batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue

        const rawError = this.runValidator({
          validate: validateObj.validate,
          value: {
            value: this.state.values,
            formApi: this,
            validationSource: 'form',
          },
          type: 'validate',
        })

        const { formError, fieldErrors } = normalizeError<TFormData>(rawError)

        const errorMapKey = getErrorMapKey(validateObj.cause)

        if (fieldErrors) {
          for (const [field, fieldError] of Object.entries(fieldErrors)) {
            const oldErrorMap =
              fieldsErrorMap[field as DeepKeys<TFormData>] || {}
            const newErrorMap = {
              ...oldErrorMap,
              [errorMapKey]: fieldError,
            }
            fieldsErrorMap[field as DeepKeys<TFormData>] = newErrorMap

            const fieldMeta = this.getFieldMeta(field as DeepKeys<TFormData>)
            if (fieldMeta && fieldMeta.errorMap[errorMapKey] !== fieldError) {
              this.setFieldMeta(field as DeepKeys<TFormData>, (prev) => ({
                ...prev,
                errorMap: {
                  ...prev.errorMap,
                  [errorMapKey]: fieldError,
                },
              }))
            }
          }
        }

        if (this.state.errorMap[errorMapKey] !== formError) {
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: formError,
            },
          }))
        }

        if (formError || fieldErrors) {
          hasErrored = true
        }
      }
    })

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

    return { hasErrored, fieldsErrorMap }
  }

  /**
   * @private
   */
  validateAsync = async (
    cause: ValidationCause,
  ): Promise<
    FormErrorMapFromValidator<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync
    >
  > => {
    const validates = getAsyncValidatorArray(cause, this.options)

    if (!this.state.isFormValidating) {
      this.baseStore.setState((prev) => ({ ...prev, isFormValidating: true }))
    }

    /**
     * We have to use a for loop and generate our promises this way, otherwise it won't be sync
     * when there are no validators needed to be run
     */
    const promises: Promise<ValidationPromiseResult<TFormData>>[] = []

    let fieldErrors:
      | Partial<Record<DeepKeys<TFormData>, ValidationError>>
      | undefined

    for (const validateObj of validates) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!validateObj.validate) continue
      const key = getErrorMapKey(validateObj.cause)
      const fieldValidatorMeta = this.state.validationMetaMap[key]

      fieldValidatorMeta?.lastAbortController.abort()
      const controller = new AbortController()

      this.state.validationMetaMap[key] = {
        lastAbortController: controller,
      }

      promises.push(
        new Promise<ValidationPromiseResult<TFormData>>(async (resolve) => {
          let rawError!:
            | ValidationError
            | FormValidationError<unknown>
            | undefined
          try {
            rawError = await new Promise((rawResolve, rawReject) => {
              setTimeout(async () => {
                if (controller.signal.aborted) return rawResolve(undefined)
                try {
                  rawResolve(
                    await this.runValidator({
                      validate: validateObj.validate!,
                      value: {
                        value: this.state.values,
                        formApi: this,
                        validationSource: 'form',
                        signal: controller.signal,
                      },
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
          const { formError, fieldErrors: fieldErrorsFromNormalizeError } =
            normalizeError<TFormData>(rawError)

          if (fieldErrorsFromNormalizeError) {
            fieldErrors = fieldErrors
              ? { ...fieldErrors, ...fieldErrorsFromNormalizeError }
              : fieldErrorsFromNormalizeError
          }
          const errorMapKey = getErrorMapKey(validateObj.cause)

          if (fieldErrors) {
            for (const [field, fieldError] of Object.entries(fieldErrors)) {
              const fieldMeta = this.getFieldMeta(field as DeepKeys<TFormData>)
              if (fieldMeta && fieldMeta.errorMap[errorMapKey] !== fieldError) {
                this.setFieldMeta(field as DeepKeys<TFormData>, (prev) => ({
                  ...prev,
                  errorMap: {
                    ...prev.errorMap,
                    [errorMapKey]: fieldError,
                  },
                }))
              }
            }
          }
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: formError,
            },
          }))

          resolve(fieldErrors ? { fieldErrors, errorMapKey } : undefined)
        }),
      )
    }

    let results: ValidationPromiseResult<TFormData>[] = []

    const fieldsErrorMap: FormErrorMapFromValidator<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync
    > = {}
    if (promises.length) {
      results = await Promise.all(promises)
      for (const fieldValidationResult of results) {
        if (fieldValidationResult?.fieldErrors) {
          const { errorMapKey } = fieldValidationResult

          for (const [field, fieldError] of Object.entries(
            fieldValidationResult.fieldErrors,
          )) {
            const oldErrorMap =
              fieldsErrorMap[field as DeepKeys<TFormData>] || {}
            const newErrorMap = {
              ...oldErrorMap,
              [errorMapKey]: fieldError,
            }
            fieldsErrorMap[field as DeepKeys<TFormData>] = newErrorMap
          }
        }
      }
    }

    this.baseStore.setState((prev) => ({
      ...prev,
      isFormValidating: false,
    }))

    return fieldsErrorMap
  }

  /**
   * @private
   */
  validate = (
    cause: ValidationCause,
  ):
    | FormErrorMapFromValidator<
        TFormData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync
      >
    | Promise<
        FormErrorMapFromValidator<
          TFormData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync
        >
      > => {
    // Attempt to sync validate first
    const { hasErrored, fieldsErrorMap } = this.validateSync(cause)

    if (hasErrored && !this.options.asyncAlways) {
      return fieldsErrorMap
    }

    // No error? Attempt async validation
    return this.validateAsync(cause)
  }

  /**
   * Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.
   */
  handleSubmit(): Promise<void>
  handleSubmit(submitMeta: TSubmitMeta): Promise<void>
  async handleSubmit(submitMeta?: TSubmitMeta): Promise<void> {
    this.baseStore.setState((old) => ({
      ...old,
      // Submission attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
    }))

    // Don't let invalid forms submit
    if (!this.state.canSubmit) return

    this.baseStore.setState((d) => ({ ...d, isSubmitting: true }))

    const done = () => {
      this.baseStore.setState((prev) => ({ ...prev, isSubmitting: false }))
    }

    await this.validateAllFields('submit')

    if (!this.state.isFieldsValid) {
      done()
      this.options.onSubmitInvalid?.({
        value: this.state.values,
        formApi: this,
      })
      return
    }

    await this.validate('submit')

    // Fields are invalid, do not submit
    if (!this.state.isValid) {
      done()
      this.options.onSubmitInvalid?.({
        value: this.state.values,
        formApi: this,
      })
      return
    }

    batch(() => {
      void (Object.values(this.fieldInfo) as FieldInfo<TFormData>[]).forEach(
        (field) => {
          field.instance?.options.listeners?.onSubmit?.({
            value: field.instance.state.value,
            fieldApi: field.instance,
          })
        },
      )
    })

    try {
      // Run the submit code
      await this.options.onSubmit?.({
        value: this.state.values,
        formApi: this,
        meta: submitMeta,
      } as any)

      batch(() => {
        this.baseStore.setState((prev) => ({ ...prev, isSubmitted: true }))
        done()
      })
    } catch (err) {
      done()
      throw err
    }
  }

  /**
   * Gets the value of the specified field.
   */
  getFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ): DeepValue<TFormData, TField> => getBy(this.state.values, field)

  /**
   * Gets the metadata of the specified field.
   */
  getFieldMeta = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ): AnyFieldMeta | undefined => {
    return this.state.fieldMeta[field]
  }

  /**
   * Gets the field info of the specified field.
   */
  getFieldInfo = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ): FieldInfo<TFormData> => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (this.fieldInfo[field] ||= {
      instance: null,
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
        onServer: undefined,
      },
    })
  }

  /**
   * Updates the metadata of the specified field.
   */
  setFieldMeta = <TField extends DeepKeys<TFormData>>(
    field: TField,
    updater: Updater<AnyFieldMeta>,
  ) => {
    this.baseStore.setState((prev) => {
      return {
        ...prev,
        fieldMetaBase: {
          ...prev.fieldMetaBase,
          [field]: functionalUpdate(
            updater,
            prev.fieldMetaBase[field] as never,
          ),
        },
      }
    })
  }

  resetFieldMeta = <TField extends DeepKeys<TFormData>>(
    fieldMeta: Record<TField, AnyFieldMeta>,
  ): Record<TField, AnyFieldMeta> => {
    return Object.keys(fieldMeta).reduce(
      (acc: Record<TField, AnyFieldMeta>, key) => {
        const fieldKey = key as TField
        acc[fieldKey] = {
          isValidating: false,
          isTouched: false,
          isBlurred: false,
          isDirty: false,
          isPristine: true,
          errors: [],
          errorMap: {},
        }
        return acc
      },
      {} as Record<TField, AnyFieldMeta>,
    )
  }

  /**
   * Sets the value of the specified field and optionally updates the touched state.
   */
  setFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
    updater: Updater<DeepValue<TFormData, TField>>,
    opts?: UpdateMetaOptions,
  ) => {
    const dontUpdateMeta = opts?.dontUpdateMeta ?? false

    batch(() => {
      if (!dontUpdateMeta) {
        this.setFieldMeta(field, (prev) => ({
          ...prev,
          isTouched: true,
          isDirty: true,
          errorMap: {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            ...prev?.errorMap,
            onMount: undefined,
          },
        }))
      }

      this.baseStore.setState((prev) => {
        return {
          ...prev,
          values: setBy(prev.values, field, updater),
        }
      })
    })
  }

  deleteField = <TField extends DeepKeys<TFormData>>(field: TField) => {
    this.baseStore.setState((prev) => {
      const newState = { ...prev }
      newState.values = deleteBy(newState.values, field)
      delete newState.fieldMetaBase[field]

      return newState
    })
    delete this.fieldInfo[field]
  }

  /**
   * Pushes a value into an array field.
   */
  pushFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => {
    this.setFieldValue(
      field,
      (prev) => [...(Array.isArray(prev) ? prev : []), value] as any,
      opts,
    )
    this.validateField(field, 'change')
  }

  insertFieldValue = async <TField extends DeepKeys<TFormData>>(
    field: TField,
    index: number,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => {
    this.setFieldValue(
      field,
      (prev) => {
        return [
          ...(prev as DeepValue<TFormData, TField>[]).slice(0, index),
          value,
          ...(prev as DeepValue<TFormData, TField>[]).slice(index),
        ] as any
      },
      opts,
    )

    // Validate the whole array + all fields that have shifted
    await this.validateField(field, 'change')

    // Shift down all meta after validating to make sure the new field has been mounted
    metaHelper(this).handleArrayFieldMetaShift(field, index, 'insert')

    await this.validateArrayFieldsStartingFrom(field, index, 'change')
  }

  /**
   * Replaces a value into an array field at the specified index.
   */
  replaceFieldValue = async <TField extends DeepKeys<TFormData>>(
    field: TField,
    index: number,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: UpdateMetaOptions,
  ) => {
    this.setFieldValue(
      field,
      (prev) => {
        return (prev as DeepValue<TFormData, TField>[]).map((d, i) =>
          i === index ? value : d,
        ) as any
      },
      opts,
    )

    // Validate the whole array + all fields that have shifted
    await this.validateField(field, 'change')
    await this.validateArrayFieldsStartingFrom(field, index, 'change')
  }

  /**
   * Removes a value from an array field at the specified index.
   */
  removeFieldValue = async <TField extends DeepKeys<TFormData>>(
    field: TField,
    index: number,
    opts?: UpdateMetaOptions,
  ) => {
    const fieldValue = this.getFieldValue(field)

    const lastIndex = Array.isArray(fieldValue)
      ? Math.max(fieldValue.length - 1, 0)
      : null

    this.setFieldValue(
      field,
      (prev) => {
        return (prev as DeepValue<TFormData, TField>[]).filter(
          (_d, i) => i !== index,
        ) as any
      },
      opts,
    )

    // Shift up all meta
    metaHelper(this).handleArrayFieldMetaShift(field, index, 'remove')

    if (lastIndex !== null) {
      const start = `${field}[${lastIndex}]`
      const fieldsToDelete = Object.keys(this.fieldInfo).filter((f) =>
        f.startsWith(start),
      )

      // Cleanup the last fields
      fieldsToDelete.forEach((f) => this.deleteField(f as TField))
    }

    // Validate the whole array + all fields that have shifted
    await this.validateField(field, 'change')
    await this.validateArrayFieldsStartingFrom(field, index, 'change')
  }

  /**
   * Swaps the values at the specified indices within an array field.
   */
  swapFieldValues = <TField extends DeepKeys<TFormData>>(
    field: TField,
    index1: number,
    index2: number,
    opts?: UpdateMetaOptions,
  ) => {
    this.setFieldValue(
      field,
      (prev: any) => {
        const prev1 = prev[index1]!
        const prev2 = prev[index2]!
        return setBy(setBy(prev, `${index1}`, prev2), `${index2}`, prev1)
      },
      opts,
    )

    // Swap meta
    metaHelper(this).handleArrayFieldMetaShift(field, index1, 'swap', index2)

    // Validate the whole array
    this.validateField(field, 'change')
    // Validate the swapped fields
    this.validateField(`${field}[${index1}]` as DeepKeys<TFormData>, 'change')
    this.validateField(`${field}[${index2}]` as DeepKeys<TFormData>, 'change')
  }

  /**
   * Moves the value at the first specified index to the second specified index within an array field.
   */
  moveFieldValues = <TField extends DeepKeys<TFormData>>(
    field: TField,
    index1: number,
    index2: number,
    opts?: UpdateMetaOptions,
  ) => {
    this.setFieldValue(
      field,
      (prev: any) => {
        prev.splice(index2, 0, prev.splice(index1, 1)[0])
        return prev
      },
      opts,
    )

    // Move meta between index1 and index2
    metaHelper(this).handleArrayFieldMetaShift(field, index1, 'move', index2)

    // Validate the whole array
    this.validateField(field, 'change')
    // Validate the moved fields
    this.validateField(`${field}[${index1}]` as DeepKeys<TFormData>, 'change')
    this.validateField(`${field}[${index2}]` as DeepKeys<TFormData>, 'change')
  }
  /**
   * Updates the form's errorMap
   */
  setErrorMap(
    errorMap: ValidationErrorMap<
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync
    >,
  ) {
    this.baseStore.setState(
      (prev) =>
        ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            ...errorMap,
          },
        }) as never,
    )
  }
}

function normalizeError<TFormData>(rawError?: FormValidationError<unknown>): {
  formError: ValidationError
  fieldErrors?: Partial<Record<DeepKeys<TFormData>, ValidationError>>
} {
  if (rawError) {
    if (isGlobalFormValidationError(rawError)) {
      const formError = normalizeError(rawError.form).formError
      const fieldErrors = rawError.fields
      return { formError, fieldErrors } as never
    }

    return { formError: rawError }
  }

  return { formError: undefined }
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
    case 'change':
    default:
      return 'onChange'
  }
}
