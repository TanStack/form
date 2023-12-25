import { Store } from '@tanstack/store'
import type { DeepKeys, DeepValue, Updater } from './utils'
import {
  getAsyncValidatorArray,
  getSyncValidatorArray,
  deleteBy,
  functionalUpdate,
  getBy,
  isNonEmptyArray,
  setBy,
} from './utils'
import type { FieldApi, FieldMeta } from './FieldApi'
import type {
  ValidationError,
  ValidationErrorMap,
  Validator,
  ValidationCause,
  ValidationErrorMapKeys,
} from './types'

export type FormValidateFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = (props: {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidator>
}) => ValidationError

export type FormValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = TFormValidator extends Validator<TFormData, infer TFN>
  ? TFN
  : FormValidateFn<TFormData, TFormValidator>

export type FormValidateAsyncFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = (props: {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidator>
  signal: AbortSignal
}) => ValidationError | Promise<ValidationError>

export type FormAsyncValidateOrFn<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = TFormValidator extends Validator<TFormData, infer FFN>
  ? FFN | FormValidateAsyncFn<TFormData, TFormValidator>
  : FormValidateAsyncFn<TFormData, TFormValidator>

export interface FormValidators<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  onMount?: FormValidateOrFn<TFormData, TFormValidator>
  onChange?: FormValidateOrFn<TFormData, TFormValidator>
  onChangeAsync?: FormAsyncValidateOrFn<TFormData, TFormValidator>
  onChangeAsyncDebounceMs?: number
  onBlur?: FormValidateOrFn<TFormData, TFormValidator>
  onBlurAsync?: FormAsyncValidateOrFn<TFormData, TFormValidator>
  onBlurAsyncDebounceMs?: number
  onSubmit?: FormValidateOrFn<TFormData, TFormValidator>
  onSubmitAsync?: FormAsyncValidateOrFn<TFormData, TFormValidator>
  onSubmitAsyncDebounceMs?: number
}

export type FormOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = {
  defaultValues?: TFormData
  defaultState?: Partial<FormState<TFormData>>
  asyncAlways?: boolean
  asyncDebounceMs?: number
  validatorAdapter?: TFormValidator
  validators?: FormValidators<TFormData, TFormValidator>
  onSubmit?: (props: {
    value: TFormData
    formApi: FormApi<TFormData, TFormValidator>
  }) => any | Promise<any>
  onSubmitInvalid?: (props: {
    value: TFormData
    formApi: FormApi<TFormData, TFormValidator>
  }) => void
}

export type ValidationMeta = {
  lastAbortController: AbortController
}

export type FieldInfo<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = {
  instances: Record<
    string,
    FieldApi<
      TFormData,
      any,
      Validator<unknown, unknown> | undefined,
      TFormValidator
    >
  >
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
}

export type FormState<TFormData> = {
  values: TFormData
  // Form Validation
  isFormValidating: boolean
  isFormValid: boolean
  errors: ValidationError[]
  errorMap: ValidationErrorMap
  validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>
  // Fields
  fieldMeta: Record<DeepKeys<TFormData>, FieldMeta>
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

export class FormApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  options: FormOptions<TFormData, TFormValidator> = {}
  store!: Store<FormState<TFormData>>
  // Do not use __state directly, as it is not reactive.
  // Please use form.useStore() utility to subscribe to state
  state!: FormState<TFormData>
  // // This carries the context for nested fields
  fieldInfo: Record<DeepKeys<TFormData>, FieldInfo<TFormData, TFormValidator>> =
    {} as any

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
          const fieldMetaValues = Object.values<FieldMeta | undefined>(
            state.fieldMeta,
          )

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

  runValidator<
    TValue extends { value: TFormData; formApi: FormApi<any, any> },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FormValidateOrFn<TFormData, TFormValidator>
      : FormAsyncValidateOrFn<TFormData, TFormValidator>
    value: TValue
    type: TType
  }): ReturnType<ReturnType<Validator<any>>[TType]> {
    const adapter = this.options.validatorAdapter
    if (adapter && typeof props.validate !== 'function') {
      return adapter()[props.type](props.value, props.validate) as never
    }

    return (props.validate as FormValidateFn<any, any>)(props.value) as never
  }

  mount = () => {
    const { onMount } = this.options.validators || {}
    if (!onMount) return
    const error = this.runValidator({
      validate: onMount,
      value: {
        value: this.state.values,
        formApi: this,
      },
      type: 'validate',
    })
    if (error) {
      this.store.setState((prev) => ({
        ...prev,
        errorMap: { ...prev.errorMap, onMount: error },
      }))
    }
  }

  update = (options?: FormOptions<TFormData, TFormValidator>) => {
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
    const fieldValidationPromises: Promise<ValidationError[]>[] = []
    this.store.batch(() => {
      const fieldInfoValues = Object.values<FieldInfo<any, TFormValidator>>(
        this.fieldInfo,
      )
      for (const field of fieldInfoValues) {
        const fieldInstances = Object.values(field.instances)
        for (const instance of fieldInstances) {
          // Validate the field
          fieldValidationPromises.push(
            Promise.resolve(instance.validate(cause)),
          )
          // If any fields are not touched
          if (!instance.state.meta.isTouched) {
            // Mark them as touched
            instance.setMeta((prev) => ({ ...prev, isTouched: true }))
          }
        }
      }
    })

    const fieldErrorMapMap = await Promise.all(fieldValidationPromises)
    return fieldErrorMapMap.flat()
  }

  // TODO: This code is copied from FieldApi, we should refactor to share
  validateSync = (cause: ValidationCause) => {
    const validates = getSyncValidatorArray(cause, this.options)
    let hasErrored = false

    this.store.batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue

        const error = normalizeError(
          this.runValidator({
            validate: validateObj.validate,
            value: {
              value: this.state.values,
              formApi: this,
            },
            type: 'validate',
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
    const validates = getAsyncValidatorArray(cause, this.options)

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
      const fieldValidatorMeta = this.state.validationMetaMap[key]

      fieldValidatorMeta?.lastAbortController.abort()
      // Sorry Safari 12
      // eslint-disable-next-line compat/compat
      const controller = new AbortController()

      this.state.validationMetaMap[key] = {
        lastAbortController: controller,
      }

      promises.push(
        new Promise<ValidationError | undefined>(async (resolve) => {
          let rawError!: ValidationError | undefined
          try {
            rawError = await new Promise((rawResolve, rawReject) => {
              setTimeout(() => {
                if (controller.signal.aborted) return rawResolve(undefined)
                this.runValidator({
                  validate: validateObj.validate!,
                  value: {
                    value: this.state.values,
                    formApi: this,
                    signal: controller.signal,
                  },
                  type: 'validateAsync',
                })
                  .then(rawResolve)
                  .catch(rawReject)
              }, validateObj.debounceMs)
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

    const results = promises.length > 0 ? await Promise.all(promises) : []

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
  ): FieldInfo<TFormData, TFormValidator> => {
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
