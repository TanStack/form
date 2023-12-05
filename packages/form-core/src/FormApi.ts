import { Store } from '@tanstack/store'
import type { DeepKeys, DeepValue, Updater } from './utils'
import {
  deleteBy,
  functionalUpdate,
  getBy,
  isNonEmptyArray,
  setBy,
  runValidatorOrAdapter,
} from './utils'
import type { FieldApi, FieldMeta } from './FieldApi'
import type {
  ValidationError,
  ValidationErrorMap,
  Validator,
  ValidationCause,
} from './types'
import type { ValidationErrorMapKeys } from './types'

type ValidateFn<TData, ValidatorType> = (props: {
  value: TData
  formApi: FormApi<TData, ValidatorType>
}) => ValidationError

type ValidateOrFn<TData, ValidatorType> = ValidatorType extends Validator<TData>
  ? Parameters<ReturnType<ValidatorType>['validate']>[1]
  : ValidateFn<TData, ValidatorType>

type ValidateAsyncFn<TData, ValidatorType> = (props: {
  value: TData
  formApi: FormApi<TData, ValidatorType>
  signal: AbortSignal
}) => ValidationError | Promise<ValidationError>

type AsyncValidateOrFn<TData, ValidatorType> =
  ValidatorType extends Validator<TData>
    ?
        | Parameters<ReturnType<ValidatorType>['validate']>[1]
        | ValidateAsyncFn<TData, ValidatorType>
    : ValidateAsyncFn<TData, ValidatorType>

export interface FormValidators<TData, ValidatorType> {
  onMount?: ValidateOrFn<TData, ValidatorType>
  onChange?: ValidateOrFn<TData, ValidatorType>
  onChangeAsync?: AsyncValidateOrFn<TData, ValidatorType>
  onChangeAsyncDebounceMs?: number
  onBlur?: ValidateOrFn<TData, ValidatorType>
  onBlurAsync?: AsyncValidateOrFn<TData, ValidatorType>
  onBlurAsyncDebounceMs?: number
  onSubmit?: ValidateOrFn<TData, ValidatorType>
  onSubmitAsync?: AsyncValidateOrFn<TData, ValidatorType>
  onSubmitAsyncDebounceMs?: number
}

export type FormOptions<TData, ValidatorType> = {
  defaultValues?: TData
  defaultState?: Partial<FormState<TData>>
  asyncAlways?: boolean
  asyncDebounceMs?: number
  validatorAdapter?: ValidatorType
  validators?: FormValidators<TData, ValidatorType>
  onSubmit?: (props: {
    value: TData
    formApi: FormApi<TData, ValidatorType>
  }) => any | Promise<any>
  onSubmitInvalid?: (props: {
    value: TData
    formApi: FormApi<TData, ValidatorType>
  }) => void
}

export type ValidationMeta = {
  lastRan: number
  lastAbortController: AbortController
}

export type FieldInfo<TFormData, ValidatorType> = {
  instances: Record<string, FieldApi<TFormData, any, unknown, ValidatorType>>
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
}

export type FormState<TData> = {
  values: TData
  // Form Validation
  isFormValidating: boolean
  isFormValid: boolean
  errors: ValidationError[]
  errorMap: ValidationErrorMap
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
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
    validationMetaMap: defaultState.validationMetaMap ?? {
      onChange: undefined,
      onBlur: undefined,
      onSubmit: undefined,
      onMount: undefined,
    },
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
    const { onMount } = this.options.validators || {}
    if (!onMount) return
    const error = runValidatorOrAdapter({
      validateFn: onMount,
      value: {
        value: this.state.values,
        formApi: this,
      },
      methodName: 'validate',
      adapters: [this.options.validatorAdapter as never],
    })
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
          // Validate the field
          fieldValidationPromises.push(
            Promise.resolve().then(() => instance.validate(cause)),
          )
          // If any fields are not touched
          if (!instance.state.meta.isTouched) {
            // Mark them as touched
            instance.setMeta((prev) => ({ ...prev, isTouched: true }))
          }
        })
      })
    })

    return Promise.all(fieldValidationPromises)
  }

  // TODO: This code is copied from FieldApi, we should refactor to share
  validateSync = (cause: ValidationCause) => {
    const { onChange, onBlur, onSubmit } = this.options.validators || {}

    const validates =
      // https://github.com/TanStack/form/issues/490
      cause === 'submit'
        ? ([
            { cause: 'change', validate: onChange },
            { cause: 'blur', validate: onBlur },
            { cause: 'submit', validate: onSubmit },
          ] as const)
        : cause === 'change'
        ? ([{ cause: 'change', validate: onChange }] as const)
        : ([{ cause: 'blur', validate: onBlur }] as const)

    let hasErrored = false as boolean

    this.store.batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue

        const error = normalizeError(
          runValidatorOrAdapter({
            validateFn: validateObj.validate,
            value: {
              value: this.state.values,
              formApi: this,
            },
            methodName: 'validate',
            adapters: [this.options.validatorAdapter as never],
          }),
        )
        const errorMapKey = getErrorMapKey(validateObj.cause)
        if (this.state.errorMap[errorMapKey] !== error) {
          this.store.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: error,
            },
          }))
        }
        if (error) {
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

    return { hasErrored }
  }

  validateAsync = async (
    cause: ValidationCause,
  ): Promise<ValidationError[]> => {
    const { asyncDebounceMs } = this.options
    const {
      onChangeAsync,
      onBlurAsync,
      onSubmitAsync,
      onBlurAsyncDebounceMs,
      onChangeAsyncDebounceMs,
      onSubmitAsyncDebounceMs,
    } = this.options.validators || {}

    const defaultDebounceMs = asyncDebounceMs ?? 0

    const validates =
      // https://github.com/TanStack/form/issues/490
      cause === 'submit'
        ? ([
            {
              cause: 'change',
              validate: onChangeAsync,
              debounceMs: onChangeAsyncDebounceMs ?? defaultDebounceMs,
            },
            {
              cause: 'blur',
              validate: onBlurAsync,
              debounceMs: onBlurAsyncDebounceMs ?? defaultDebounceMs,
            },
            {
              cause: 'submit',
              validate: onSubmitAsync,
              debounceMs: onSubmitAsyncDebounceMs ?? defaultDebounceMs,
            },
          ] as const)
        : cause === 'change'
        ? ([
            {
              cause: 'change',
              validate: onChangeAsync,
              debounceMs: onChangeAsyncDebounceMs ?? defaultDebounceMs,
            },
          ] as const)
        : ([
            {
              cause: 'blur',
              validate: onBlurAsync,
              debounceMs: onBlurAsyncDebounceMs ?? defaultDebounceMs,
            },
          ] as const)

    if (!this.state.isFormValidating) {
      this.store.setState((prev) => ({ ...prev, isFormValidating: true }))
    }

    /**
     * We have to use a for loop and generate our promises this way, otherwise it won't be sync
     * when there are no validators needed to be run
     */
    const promises: Promise<ValidationError | undefined>[] = []

    for (const validateObj of validates) {
      if (!validateObj.validate) continue
      const key = getErrorMapKey(validateObj.cause)
      const fieldOnChangeMeta = this.state.validationMetaMap[key]

      const now = Date.now()
      const lastRunDiff = now - (fieldOnChangeMeta?.lastRan ?? 0)

      if (fieldOnChangeMeta?.lastRan && lastRunDiff < validateObj.debounceMs) {
        continue
      }
      fieldOnChangeMeta?.lastAbortController.abort()
      // Sorry Safari 12
      // eslint-disable-next-line compat/compat
      const controller = new AbortController()

      this.state.validationMetaMap[key] = {
        ...fieldOnChangeMeta,
        lastRan: now,
        lastAbortController: controller,
      }

      promises.push(
        new Promise<ValidationError | undefined>(async (resolve) => {
          let rawError!: ValidationError | undefined
          try {
            rawError = await runValidatorOrAdapter({
              validateFn: validateObj.validate,
              value: {
                value: this.state.values,
                formApi: this,
                signal: controller.signal,
              },
              methodName: 'validateAsync',
              adapters: [this.options.validatorAdapter as never],
            })
          } catch (e: unknown) {
            rawError = e as ValidationError
          }
          const error = normalizeError(rawError)
          this.store.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [getErrorMapKey(cause)]: error,
            },
          }))

          resolve(error)
        }),
      )
    }

    let results: ValidationError[] = []
    if (promises.length) {
      results = await Promise.all(promises)
    }

    this.store.setState((prev) => ({
      ...prev,
      isFormValidating: false,
    }))

    return results.filter(Boolean)
  }

  validate = (
    cause: ValidationCause,
  ): ValidationError[] | Promise<ValidationError[]> => {
    // Attempt to sync validate first
    const { hasErrored } = this.validateSync(cause)

    if (hasErrored && !this.options.asyncAlways) {
      return this.state.errors
    }

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
      this.options.onSubmitInvalid?.({
        value: this.state.values,
        formApi: this,
      })
      return
    }

    // Run validation for the form
    await this.validate('submit')

    if (!this.state.isValid) {
      done()
      this.options.onSubmitInvalid?.({
        value: this.state.values,
        formApi: this,
      })
      return
    }

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
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
      },
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
    this.store.setState((prev) => {
      const newState = { ...prev }
      newState.values = deleteBy(newState.values, field)
      delete newState.fieldMeta[field]

      return newState
    })
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
