import { Store } from '@tanstack/store'
import type { DeepKeys, DeepValue, Updater } from './utils'
import { functionalUpdate, getBy, isNonEmptyArray, setBy } from './utils'
import type { FieldApi, FieldMeta, ValidationCause } from './FieldApi'
import type { ValidationError, Validator } from './types'

type ValidateFn<TData, ValidatorType> = (
  values: TData,
  formApi: FormApi<TData, ValidatorType>,
) => ValidationError

type ValidateOrFn<TData, ValidatorType> = ValidatorType extends Validator<TData>
  ? Parameters<ReturnType<ValidatorType>['validate']>[1]
  : ValidateFn<TData, ValidatorType>

type ValidateAsyncFn<TData, ValidatorType> = (
  value: TData,
  fieldApi: FormApi<TData, ValidatorType>,
) => ValidationError | Promise<ValidationError>

export type FormOptions<TData, ValidatorType> = {
  defaultValues?: TData
  defaultState?: Partial<FormState<TData>>
  asyncAlways?: boolean
  asyncDebounceMs?: number
  validator?: ValidatorType
  onMount?: ValidateOrFn<TData, ValidatorType>
  onChange?: ValidateOrFn<TData, ValidatorType>
  onChangeAsync?: ValidateAsyncFn<TData, ValidatorType>
  onChangeAsyncDebounceMs?: number
  onBlur?: ValidateOrFn<TData, ValidatorType>
  onBlurAsync?: ValidateAsyncFn<TData, ValidatorType>
  onBlurAsyncDebounceMs?: number
  onSubmit?: (
    values: TData,
    formApi: FormApi<TData, ValidatorType>,
  ) => any | Promise<any>
  onSubmitInvalid?: (
    values: TData,
    formApi: FormApi<TData, ValidatorType>,
  ) => void
}

export type FieldInfo<TFormData, ValidatorType> = {
  instances: Record<string, FieldApi<TFormData, any, unknown, ValidatorType>>
} & ValidationMeta

export type ValidationMeta = {
  validationCount?: number
  validationAsyncCount?: number
  validationPromise?: Promise<ValidationError[] | undefined>
  validationResolve?: (errors: ValidationError[] | undefined) => void
  validationReject?: (errors: unknown) => void
}

export type ValidationErrorMapKeys = `on${Capitalize<ValidationCause>}`

export type ValidationErrorMap = {
  [K in ValidationErrorMapKeys]?: ValidationError
}

export type FormState<TData> = {
  values: TData
  // Form Validation
  isFormValidating: boolean
  formValidationCount: number
  isFormValid: boolean
  errors: ValidationError[]
  errorMap: ValidationErrorMap
  // Fields
  fieldMeta: Record<DeepKeys<TData>, FieldMeta>
  isFieldsValidating: boolean
  isFieldsValid: boolean
  isSubmitting: boolean
  // General
  isTouched: boolean
  isSubmitted: boolean
  isValidating: boolean
  isValid: boolean
  canSubmit: boolean
  submissionAttempts: number
}

function getDefaultFormState<TData>(
  defaultState: Partial<FormState<TData>>,
): FormState<TData> {
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
    isValid: defaultState.isValid ?? false,
    isValidating: defaultState.isValidating ?? false,
    submissionAttempts: defaultState.submissionAttempts ?? 0,
    formValidationCount: defaultState.formValidationCount ?? 0,
  }
}

export class FormApi<TFormData, ValidatorType> {
  // // This carries the context for nested fields
  options: FormOptions<TFormData, ValidatorType> = {}
  store!: Store<FormState<TFormData>>
  // Do not use __state directly, as it is not reactive.
  // Please use form.useStore() utility to subscribe to state
  state!: FormState<TFormData>
  fieldInfo: Record<DeepKeys<TFormData>, FieldInfo<TFormData, ValidatorType>> =
    {} as any
  fieldName?: string
  validationMeta: ValidationMeta = {}

  constructor(opts?: FormOptions<TFormData, ValidatorType>) {
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

          const isValidating = isFieldsValidating || state.isFormValidating
          state.errors = Object.values(state.errorMap).filter(
            (val: unknown) => val !== undefined,
          )
          const isFormValid = state.errors.length === 0
          const isValid = isFieldsValid && isFormValid
          const canSubmit =
            (state.submissionAttempts === 0 && !isTouched) ||
            (!isValidating && !state.isSubmitting && isValid)

          state = {
            ...state,
            isFieldsValidating,
            isFieldsValid,
            isFormValid,
            isValid,
            canSubmit,
            isTouched,
          }

          this.store.state = state
          this.state = state
        },
      },
    )

    this.state = this.store.state

    this.update(opts || {})
  }

  mount = () => {
    const doValidate = () => {
      if (
        this.options.validator &&
        typeof this.options.onMount !== 'function'
      ) {
        return (this.options.validator as Validator<TFormData>)().validate(
          this.state.values,
          this.options.onMount,
        )
      }
      return (this.options.onMount as ValidateFn<TFormData, ValidatorType>)(
        this.state.values,
        this,
      )
    }
    if (!this.options.onMount) return
    const error = doValidate()
    if (error) {
      this.store.setState((prev) => ({
        ...prev,
        errorMap: { ...prev.errorMap, onMount: error },
      }))
    }
  }

  update = (options?: FormOptions<TFormData, ValidatorType>) => {
    if (!options) return

    this.store.batch(() => {
      const shouldUpdateValues =
        options.defaultValues &&
        options.defaultValues !== this.options.defaultValues &&
        !this.state.isTouched

      const shouldUpdateState =
        options.defaultState !== this.options.defaultState &&
        !this.state.isTouched

      this.store.setState(() =>
        getDefaultFormState(
          Object.assign(
            {},
            this.state as any,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            shouldUpdateState ? options.defaultState : {},
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            shouldUpdateValues
              ? {
                  values: options.defaultValues,
                }
              : {},
          ),
        ),
      )
    })

    this.options = options
  }

  reset = () =>
    this.store.setState(() =>
      getDefaultFormState({
        ...(this.options.defaultState as any),
        values: this.options.defaultValues ?? this.options.defaultState?.values,
      }),
    )

  validateAllFields = async (cause: ValidationCause) => {
    const fieldValidationPromises: Promise<ValidationError[]>[] = [] as any
    this.store.batch(() => {
      void (
        Object.values(this.fieldInfo) as FieldInfo<any, ValidatorType>[]
      ).forEach((field) => {
        Object.values(field.instances).forEach((instance) => {
          // If any fields are not touched
          if (!instance.state.meta.isTouched) {
            // Mark them as touched
            instance.setMeta((prev) => ({ ...prev, isTouched: true }))
            // Validate the field
            fieldValidationPromises.push(
              Promise.resolve().then(() => instance.validate(cause)),
            )
          }
        })
      })
    })

    return Promise.all(fieldValidationPromises)
  }

  validateSync = (cause: ValidationCause): void => {
    const { onChange, onBlur } = this.options
    const validate =
      cause === 'change' ? onChange : cause === 'blur' ? onBlur : undefined
    if (!validate) return

    const errorMapKey = getErrorMapKey(cause)
    const doValidate = () => {
      if (this.options.validator && typeof validate !== 'function') {
        return (this.options.validator as Validator<TFormData>)().validate(
          this.state.values,
          validate,
        )
      }

      return (validate as ValidateFn<TFormData, ValidatorType>)(
        this.state.values,
        this,
      )
    }

    const error = normalizeError(doValidate())
    if (this.state.errorMap[errorMapKey] !== error) {
      this.store.setState((prev) => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          [errorMapKey]: error,
        },
      }))
    }

    if (this.state.errorMap[errorMapKey]) {
      this.cancelValidateAsync()
    }
  }

  __leaseValidateAsync = () => {
    const count = (this.validationMeta.validationAsyncCount || 0) + 1
    this.validationMeta.validationAsyncCount = count
    return count
  }

  cancelValidateAsync = () => {
    // Lease a new validation count to ignore any pending validations
    this.__leaseValidateAsync()
    // Cancel any pending validation state
    this.store.setState((prev) => ({
      ...prev,
      isFormValidating: false,
    }))
  }

  validateAsync = async (
    cause: ValidationCause,
  ): Promise<ValidationError[]> => {
    const {
      onChangeAsync,
      onBlurAsync,
      asyncDebounceMs,
      onBlurAsyncDebounceMs,
      onChangeAsyncDebounceMs,
    } = this.options

    const validate =
      cause === 'change'
        ? onChangeAsync
        : cause === 'blur'
        ? onBlurAsync
        : undefined

    if (!validate) return []
    const debounceMs =
      (cause === 'change' ? onChangeAsyncDebounceMs : onBlurAsyncDebounceMs) ??
      asyncDebounceMs ??
      0

    if (!this.state.isFormValidating) {
      this.store.setState((prev) => ({ ...prev, isFormValidating: true }))
    }

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationAsyncCount = this.__leaseValidateAsync()

    const checkLatest = () =>
      validationAsyncCount === this.validationMeta.validationAsyncCount

    if (!this.validationMeta.validationPromise) {
      this.validationMeta.validationPromise = new Promise((resolve, reject) => {
        this.validationMeta.validationResolve = resolve
        this.validationMeta.validationReject = reject
      })
    }

    if (debounceMs > 0) {
      await new Promise((r) => setTimeout(r, debounceMs))
    }

    const doValidate = () => {
      if (typeof validate === 'function') {
        return validate(this.state.values, this) as ValidationError
      }
      if (this.options.validator && typeof validate !== 'function') {
        return (this.options.validator as Validator<TFormData>)().validateAsync(
          this.state.values,
          validate,
        )
      }
      const errorMapKey = getErrorMapKey(cause)
      throw new Error(
        `Form validation for ${errorMapKey}Async failed. ${errorMapKey}Async should either be a function, or \`validator\` should be correct.`,
      )
    }

    // Only kick off validation if this validation is the latest attempt
    if (checkLatest()) {
      const prevErrors = this.state.errors
      try {
        const rawError = await doValidate()
        if (checkLatest()) {
          const error = normalizeError(rawError)
          this.store.setState((prev) => ({
            ...prev,
            isFormValidating: false,
            errorMap: {
              ...prev.errorMap,
              [getErrorMapKey(cause)]: error,
            },
          }))
          this.validationMeta.validationResolve?.([...prevErrors, error])
        }
      } catch (error) {
        if (checkLatest()) {
          this.validationMeta.validationReject?.([...prevErrors, error])
          throw error
        }
      } finally {
        if (checkLatest()) {
          this.store.setState((prev) => ({ ...prev, isFormValidating: false }))
          delete this.validationMeta.validationPromise
        }
      }
    }
    // Always return the latest validation promise to the caller
    return (await this.validationMeta.validationPromise) ?? []
  }

  validate = (
    cause: ValidationCause,
  ): ValidationError[] | Promise<ValidationError[]> => {
    // Store the previous error for the errorMapKey (eg. onChange, onBlur, onSubmit)
    const errorMapKey = getErrorMapKey(cause)
    const prevError = this.state.errorMap[errorMapKey]

    // Attempt to sync validate first
    this.validateSync(cause)

    const newError = this.state.errorMap[errorMapKey]
    if (
      prevError !== newError &&
      !this.options.asyncAlways &&
      !(newError === undefined && prevError !== undefined)
    )
      return this.state.errors

    // No error? Attempt async validation
    return this.validateAsync(cause)
  }

  handleSubmit = async () => {
    // Check to see that the form and all fields have been touched
    // If they have not, touch them all and run validation
    // Run form validation
    // Submit the form

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

    // Validate all fields
    await this.validateAllFields('submit')

    // Fields are invalid, do not submit
    if (!this.state.isFieldsValid) {
      done()
      this.options.onSubmitInvalid?.(this.state.values, this)
      return
    }

    // Run validation for the form
    await this.validate('submit')

    if (!this.state.isValid) {
      done()
      this.options.onSubmitInvalid?.(this.state.values, this)
      return
    }

    try {
      // Run the submit code
      await this.options.onSubmit?.(this.state.values, this)

      this.store.batch(() => {
        this.store.setState((prev) => ({ ...prev, isSubmitted: true }))
        done()
      })
    } catch (err) {
      done()
      throw err
    }
  }

  getFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ): DeepValue<TFormData, TField> => getBy(this.state.values, field)

  getFieldMeta = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ): FieldMeta | undefined => {
    return this.state.fieldMeta[field]
  }

  getFieldInfo = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ): FieldInfo<TFormData, ValidatorType> => {
    // eslint-disable-next-line  @typescript-eslint/no-unnecessary-condition
    return (this.fieldInfo[field] ||= {
      instances: {},
    })
  }

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

  setFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
    updater: Updater<DeepValue<TFormData, TField>>,
    opts?: { touch?: boolean },
  ) => {
    const touch = opts?.touch

    this.store.batch(() => {
      if (touch) {
        this.setFieldMeta(field, (prev) => ({
          ...prev,
          isTouched: true,
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
    const newState = { ...this.state }
    delete newState.values[field as keyof TFormData]
    delete newState.fieldMeta[field]

    this.store.setState((_) => newState)
  }

  pushFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: { touch?: boolean },
  ) => {
    return this.setFieldValue(
      field,
      (prev) => [...(Array.isArray(prev) ? prev : []), value] as any,
      opts,
    )
  }

  insertFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
    index: number,
    value: DeepValue<TFormData, TField> extends any[]
      ? DeepValue<TFormData, TField>[number]
      : never,
    opts?: { touch?: boolean },
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
  }

  removeFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
    index: number,
    opts?: { touch?: boolean },
  ) => {
    this.setFieldValue(
      field,
      (prev) => {
        return (prev as DeepValue<TFormData, TField>[]).filter(
          (_d, i) => i !== index,
        ) as any
      },
      opts,
    )
  }

  swapFieldValues = <TField extends DeepKeys<TFormData>>(
    field: TField,
    index1: number,
    index2: number,
  ) => {
    this.setFieldValue(field, (prev: any) => {
      const prev1 = prev[index1]!
      const prev2 = prev[index2]!
      return setBy(setBy(prev, `${index1}`, prev2), `${index2}`, prev1)
    })
  }
}

function normalizeError(rawError?: ValidationError) {
  if (rawError) {
    if (typeof rawError !== 'string') {
      return 'Invalid Form Values'
    }

    return rawError
  }

  return undefined
}

function getErrorMapKey(cause: ValidationCause) {
  switch (cause) {
    case 'submit':
      return 'onSubmit'
    case 'change':
      return 'onChange'
    case 'blur':
      return 'onBlur'
    case 'mount':
      return 'onMount'
  }
}
