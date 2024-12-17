import { Store } from '@tanstack/store'
import {
  deleteBy,
  functionalUpdate,
  getAsyncValidatorArray,
  getBy,
  getSyncValidatorArray,
  isNonEmptyArray,
  setBy,
} from './utils'
import {
  isStandardSchemaValidator,
  standardSchemaValidator,
} from './standardSchemaValidator'
import type { StandardSchemaV1 } from './standardSchemaValidator'
import type { FieldApi, FieldMeta } from './FieldApi'
import type {
  FormValidationError,
  FormValidationErrorMap,
  UpdateMetaOptions,
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
  ValidationErrorMapKeys,
  ValidationSource,
  Validator,
} from './types'
import type { DeepKeys, DeepValue } from './util-types'
import type { Updater } from './utils'

export type FieldsErrorMapFromValidator<TFormData> = Partial<
  Record<DeepKeys<TFormData>, ValidationErrorMap>
>

export type FormValidateFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = (props: {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidator>
}) => FormValidationError<TFormData>

/**
 * @private
 */
export type FormValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> =
  TFormValidator extends Validator<TFormData, infer TFN>
    ? TFN | FormValidateFn<TFormData, TFormValidator>
    :
        | FormValidateFn<TFormData, TFormValidator>
        | StandardSchemaV1<TFormData, unknown>

/**
 * @private
 */
export type FormValidateAsyncFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = (props: {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidator>
  signal: AbortSignal
}) => FormValidationError<TFormData> | Promise<FormValidationError<TFormData>>

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
export type FormAsyncValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> =
  TFormValidator extends Validator<TFormData, infer FFN>
    ? FFN | FormValidateAsyncFn<TFormData, TFormValidator>
    :
        | FormValidateAsyncFn<TFormData, TFormValidator>
        | StandardSchemaV1<TFormData, unknown>

export interface FormValidators<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  /**
   * Optional function that fires as soon as the component mounts.
   */
  onMount?: FormValidateOrFn<TFormData, TFormValidator>
  /**
   * Optional function that checks the validity of your data whenever a value changes
   */
  onChange?: FormValidateOrFn<TFormData, TFormValidator>
  /**
   * Optional onChange asynchronous counterpart to onChange. Useful for more complex validation logic that might involve server requests.
   */
  onChangeAsync?: FormAsyncValidateOrFn<TFormData, TFormValidator>
  /**
   * The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.
   */
  onChangeAsyncDebounceMs?: number
  /**
   * Optional function that validates the form data when a field loses focus, returns a `FormValidationError`
   */
  onBlur?: FormValidateOrFn<TFormData, TFormValidator>
  /**
   * Optional onBlur asynchronous validation method for when a field loses focus returns a ` FormValidationError` or a promise of `Promise<FormValidationError>`
   */
  onBlurAsync?: FormAsyncValidateOrFn<TFormData, TFormValidator>
  /**
   * The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.
   */
  onBlurAsyncDebounceMs?: number
  onSubmit?: FormValidateOrFn<TFormData, TFormValidator>
  onSubmitAsync?: FormAsyncValidateOrFn<TFormData, TFormValidator>
}

/**
 * @private
 */
export interface FormTransform<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  fn: (
    formBase: FormApi<TFormData, TFormValidator>,
  ) => FormApi<TFormData, TFormValidator>
  deps: unknown[]
}

/**
 * An object representing the options for a form.
 */
export interface FormOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  /**
   * Set initial values for your form.
   */
  defaultValues?: TFormData
  /**
   * The default state for the form.
   */
  defaultState?: Partial<FormState<TFormData>>
  /**
   * If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.
   */
  asyncAlways?: boolean
  /**
   * Optional time in milliseconds if you want to introduce a delay before firing off an async action.
   */
  asyncDebounceMs?: number
  /**
   * A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)
   */
  validatorAdapter?: TFormValidator
  /**
   * A list of validators to pass to the form
   */
  validators?: FormValidators<TFormData, TFormValidator>
  /**
   * A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`
   */
  onSubmit?: (props: {
    value: TFormData
    formApi: FormApi<TFormData, TFormValidator>
  }) => any | Promise<any>
  /**
   * Specify an action for scenarios where the user tries to submit an invalid form.
   */
  onSubmitInvalid?: (props: {
    value: TFormData
    formApi: FormApi<TFormData, TFormValidator>
  }) => void
  transform?: FormTransform<TFormData, TFormValidator>
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
export type FieldInfo<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = {
  /**
   * An instance of the FieldAPI.
   */
  instance: FieldApi<
    TFormData,
    any,
    Validator<unknown, unknown> | undefined,
    TFormValidator
  > | null
  /**
   * A record of field validation internal handling.
   */
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
}

/**
 * An object representing the current state of the form.
 */
export type FormState<TFormData> = {
  /**
   * The current values of the form fields.
   */
  values: TFormData
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
  errors: ValidationError[]
  /**
   * The error map for the form itself.
   */
  errorMap: FormValidationErrorMap
  /**
   * An internal mechanism used for keeping track of validation logic in a form.
   */
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
  /**
   * A record of field metadata for each field in the form.
   */
  fieldMeta: Record<DeepKeys<TFormData>, FieldMeta>
  /**
   * A boolean indicating if any of the form fields are currently validating.
   */
  isFieldsValidating: boolean
  /**
   * A boolean indicating if all the form fields are valid.
   */
  isFieldsValid: boolean
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
   * A boolean indicating if the form has been submitted.
   */
  isSubmitted: boolean
  /**
   * A boolean indicating if the form or any of its fields are currently validating.
   */
  isValidating: boolean
  /**
   * A boolean indicating if the form and all its fields are valid.
   */
  isValid: boolean
  /**
   * A boolean indicating if the form can be submitted based on its current state.
   */
  canSubmit: boolean
  /**
   * A counter for tracking the number of submission attempts.
   */
  submissionAttempts: number
}

function getDefaultFormState<TFormData>(
  defaultState: Partial<FormState<TFormData>>,
): FormState<TFormData> {
  return {
    values: defaultState.values ?? ({} as never),
    errors: defaultState.errors ?? [],
    errorMap: defaultState.errorMap ?? {},
    fieldMeta: defaultState.fieldMeta ?? ({} as never),
    canSubmit: defaultState.canSubmit ?? true,
    isFieldsValid: defaultState.isFieldsValid ?? false,
    isFieldsValidating: defaultState.isFieldsValidating ?? false,
    isFormValid: defaultState.isFormValid ?? false,
    isFormValidating: defaultState.isFormValidating ?? false,
    isSubmitted: defaultState.isSubmitted ?? false,
    isSubmitting: defaultState.isSubmitting ?? false,
    isTouched: defaultState.isTouched ?? false,
    isBlurred: defaultState.isBlurred ?? false,
    isPristine: defaultState.isPristine ?? true,
    isDirty: defaultState.isDirty ?? false,
    isValid: defaultState.isValid ?? false,
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

const isFormValidationError = (
  error: unknown,
): error is FormValidationError<unknown> => {
  return typeof error === 'object'
}

/**
 * A class representing the Form API. It handles the logic and interactions with the form state.
 *
 * Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
 * hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
 * However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.
 */
export class FormApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  /**
   * The options for the form.
   */
  options: FormOptions<TFormData, TFormValidator> = {}
  /**
   * A [TanStack Store instance](https://tanstack.com/store/latest/docs/reference/Store) that keeps track of the form's state.
   */
  store!: Store<FormState<TFormData>>
  /**
   * The current state of the form.
   *
   * **Note:**
   * Do not use `state` directly, as it is not reactive.
   * Please use useStore(form.store) utility to subscribe to state
   */
  state!: FormState<TFormData>
  /**
   * A record of field information for each field in the form.
   */
  fieldInfo: Record<DeepKeys<TFormData>, FieldInfo<TFormData, TFormValidator>> =
    {} as any

  /**
   * @private
   */
  prevTransformArray: unknown[] = []

  /**
   * Constructs a new `FormApi` instance with the given form options.
   */
  constructor(opts?: FormOptions<TFormData, TFormValidator>) {
    this.store = new Store<FormState<TFormData>>(
      getDefaultFormState({
        ...(opts?.defaultState as any),
        values: opts?.defaultValues ?? opts?.defaultState?.values,
        isFormValid: true,
      }),
      {
        onUpdate: () => {
          let { state } = this.store
          // Computed state
          const fieldMetaValues = Object.values(state.fieldMeta) as (
            | FieldMeta
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

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (isTouched && state?.errorMap?.onMount) {
            state.errorMap.onMount = undefined
          }

          const isDirty = fieldMetaValues.some((field) => field?.isDirty)
          const isPristine = !isDirty

          const hasOnMountError = Boolean(
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.errorMap?.onMount ||
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              fieldMetaValues.some((f) => f?.errorMap?.onMount),
          )

          const isValidating = isFieldsValidating || state.isFormValidating
          state.errors = Object.values(state.errorMap).reduce((prev, curr) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (curr === undefined) return prev
            if (typeof curr === 'string') {
              prev.push(curr)
              return prev
            } else if (curr && isFormValidationError(curr)) {
              prev.push(curr.form)
              return prev
            }
            return prev
          }, [] as ValidationError[])
          const isFormValid = state.errors.length === 0
          const isValid = isFieldsValid && isFormValid
          const canSubmit =
            (state.submissionAttempts === 0 &&
              !isTouched &&
              !hasOnMountError) ||
            (!isValidating && !state.isSubmitting && isValid)

          state = {
            ...state,
            isFieldsValidating,
            isFieldsValid,
            isFormValid,
            isValid,
            canSubmit,
            isTouched,
            isBlurred,
            isPristine,
            isDirty,
          }

          this.state = state
          this.store.state = this.state

          // Only run transform if state has shallowly changed - IE how React.useEffect works
          const transformArray = this.options.transform?.deps ?? []
          const shouldTransform =
            transformArray.length !== this.prevTransformArray.length ||
            transformArray.some((val, i) => val !== this.prevTransformArray[i])

          if (shouldTransform) {
            // This mutates the state
            this.options.transform?.fn(this)
            this.store.state = this.state
            this.prevTransformArray = transformArray
          }
        },
      },
    )

    this.state = this.store.state

    this.update(opts || {})
  }

  /**
   * @private
   */
  runValidator<
    TValue extends {
      value: TFormData
      formApi: FormApi<any, any>
      validationSource: ValidationSource
    },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FormValidateOrFn<TFormData, TFormValidator>
      : FormAsyncValidateOrFn<TFormData, TFormValidator>
    value: TValue
    type: TType
  }): ReturnType<ReturnType<Validator<any>>[TType]> {
    const adapter = this.options.validatorAdapter
    if (
      adapter &&
      (typeof props.validate !== 'function' || '~standard' in props.validate)
    ) {
      return adapter()[props.type](props.value, props.validate) as never
    }

    if (isStandardSchemaValidator(props.validate)) {
      return standardSchemaValidator()()[props.type](
        props.value,
        props.validate,
      ) as never
    }

    return (props.validate as FormValidateFn<any, any>)(props.value) as never
  }

  mount = () => {
    const { onMount } = this.options.validators || {}
    if (!onMount) return

    this.validateSync('mount')
  }

  /**
   * Updates the form options and form state.
   */
  update = (options?: FormOptions<TFormData, TFormValidator>) => {
    if (!options) return

    const oldOptions = this.options

    // Options need to be updated first so that when the store is updated, the state is correct for the derived state
    this.options = options

    this.store.batch(() => {
      const shouldUpdateValues =
        options.defaultValues &&
        options.defaultValues !== oldOptions.defaultValues &&
        !this.state.isTouched

      const shouldUpdateState =
        options.defaultState !== oldOptions.defaultState &&
        !this.state.isTouched

      this.store.setState(() =>
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
    const fieldMeta = this.resetFieldMeta(currentFieldMeta)

    if (values && !opts?.keepDefaultValues) {
      this.options = {
        ...this.options,
        defaultValues: values,
      }
    }

    this.store.setState(() =>
      getDefaultFormState({
        ...(this.options.defaultState as any),
        values:
          values ??
          this.options.defaultValues ??
          this.options.defaultState?.values,
        fieldMeta,
      }),
    )
  }

  /**
   * Validates form and all fields in using the correct handlers for a given validation cause.
   */
  validateAllFields = async (cause: ValidationCause) => {
    const fieldValidationPromises: Promise<ValidationError[]>[] = [] as any
    this.store.batch(() => {
      void (
        Object.values(this.fieldInfo) as FieldInfo<any, TFormValidator>[]
      ).forEach((field) => {
        if (!field.instance) return
        const fieldInstance = field.instance
        // Validate the field
        fieldValidationPromises.push(
          // Remember, `validate` is either a sync operation or a promise
          Promise.resolve().then(() => fieldInstance.validate(cause)),
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
    this.store.batch(() => {
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
    fieldsErrorMap: FieldsErrorMapFromValidator<TFormData>
  } => {
    const validates = getSyncValidatorArray(cause, this.options)
    let hasErrored = false as boolean

    const fieldsErrorMap: FieldsErrorMapFromValidator<TFormData> = {}

    this.store.batch(() => {
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
          this.store.setState((prev) => ({
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
      this.store.setState((prev) => ({
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
  ): Promise<FieldsErrorMapFromValidator<TFormData>> => {
    const validates = getAsyncValidatorArray(cause, this.options)

    if (!this.state.isFormValidating) {
      this.store.setState((prev) => ({ ...prev, isFormValidating: true }))
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
          this.store.setState((prev) => ({
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

    const fieldsErrorMap: FieldsErrorMapFromValidator<TFormData> = {}
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

    this.store.setState((prev) => ({
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
    | FieldsErrorMapFromValidator<TFormData>
    | Promise<FieldsErrorMapFromValidator<TFormData>> => {
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
  handleSubmit = async () => {
    this.store.setState((old) => ({
      ...old,
      // Submission attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
    }))

    // Don't let invalid forms submit
    if (!this.state.canSubmit) return

    this.store.setState((d) => ({ ...d, isSubmitting: true }))

    const done = () => {
      this.store.setState((prev) => ({ ...prev, isSubmitting: false }))
    }

    // Validate form and all fields
    await this.validateAllFields('submit')

    // Fields are invalid, do not submit
    if (!this.state.isValid) {
      done()
      this.options.onSubmitInvalid?.({
        value: this.state.values,
        formApi: this,
      })
      return
    }

    this.store.batch(() => {
      void (
        Object.values(this.fieldInfo) as FieldInfo<TFormData, TFormValidator>[]
      ).forEach((field) => {
        field.instance?.options.listeners?.onSubmit?.({
          value: field.instance.state.value,
          fieldApi: field.instance,
        })
      })
    })

    try {
      // Run the submit code
      await this.options.onSubmit?.({ value: this.state.values, formApi: this })

      this.store.batch(() => {
        this.store.setState((prev) => ({ ...prev, isSubmitted: true }))
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
  ): FieldMeta | undefined => {
    return this.state.fieldMeta[field]
  }

  /**
   * Gets the field info of the specified field.
   */
  getFieldInfo = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ): FieldInfo<TFormData, TFormValidator> => {
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
    updater: Updater<FieldMeta>,
  ) => {
    this.store.setState((prev) => {
      return {
        ...prev,
        fieldMeta: {
          ...prev.fieldMeta,
          [field]: functionalUpdate(updater, prev.fieldMeta[field]),
        },
      }
    })
  }

  resetFieldMeta = <TField extends DeepKeys<TFormData>>(
    fieldMeta: Record<TField, FieldMeta>,
  ): Record<TField, FieldMeta> => {
    return Object.keys(fieldMeta).reduce(
      (acc: Record<TField, FieldMeta>, key) => {
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
      {} as Record<TField, FieldMeta>,
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

    this.store.batch(() => {
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

      this.store.setState((prev) => {
        return {
          ...prev,
          values: setBy(prev.values, field, updater),
        }
      })
    })
  }

  deleteField = <TField extends DeepKeys<TFormData>>(field: TField) => {
    this.store.setState((prev) => {
      const newState = { ...prev }
      newState.values = deleteBy(newState.values, field)
      delete newState.fieldMeta[field]

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

  /**
   * Inserts a value into an array field at the specified index, shifting the subsequent values to the right.
   */
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

    // Validate the whole array
    this.validateField(field, 'change')
    // Validate the moved fields
    this.validateField(`${field}[${index1}]` as DeepKeys<TFormData>, 'change')
    this.validateField(`${field}[${index2}]` as DeepKeys<TFormData>, 'change')
  }
  /**
   * Updates the form's errorMap
   */
  setErrorMap(errorMap: ValidationErrorMap) {
    this.store.setState((prev) => ({
      ...prev,
      errorMap: {
        ...prev.errorMap,
        ...errorMap,
      },
    }))
  }
}

function normalizeError<TFormData>(rawError?: FormValidationError<unknown>): {
  formError: ValidationError
  fieldErrors?: Partial<Record<DeepKeys<TFormData>, ValidationError>>
} {
  if (rawError) {
    if (typeof rawError === 'object') {
      const formError = normalizeError(rawError.form).formError
      const fieldErrors = rawError.fields
      return { formError, fieldErrors } as never
    }

    if (typeof rawError !== 'string') {
      return { formError: 'Invalid Form Values' }
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
