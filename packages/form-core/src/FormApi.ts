import { Store } from '@tanstack/store'
//
import type { DeepKeys, DeepValue, Updater } from './utils'
import { functionalUpdate, getBy, isNonEmptyArray, setBy } from './utils'
import type { FieldApi, FieldMeta, ValidationCause } from './FieldApi'

export type FormOptions<TData> = {
  defaultValues?: TData
  defaultState?: Partial<FormState<TData>>
  asyncDebounceMs?: number
  onMount?: (values: TData, formApi: FormApi<TData>) => ValidationError
  onMountAsync?: (
    values: TData,
    formApi: FormApi<TData>,
  ) => ValidationError | Promise<ValidationError>
  onMountAsyncDebounceMs?: number
  onChange?: (values: TData, formApi: FormApi<TData>) => ValidationError
  onChangeAsync?: (
    values: TData,
    formApi: FormApi<TData>,
  ) => ValidationError | Promise<ValidationError>
  onChangeAsyncDebounceMs?: number
  onBlur?: (values: TData, formApi: FormApi<TData>) => ValidationError
  onBlurAsync?: (
    values: TData,
    formApi: FormApi<TData>,
  ) => ValidationError | Promise<ValidationError>
  onBlurAsyncDebounceMs?: number
  onSubmit?: (values: TData, formApi: FormApi<TData>) => any | Promise<any>
  onSubmitInvalid?: (values: TData, formApi: FormApi<TData>) => void
}

export type FieldInfo<TFormData> = {
  instances: Record<string, FieldApi<TFormData, any, any>>
} & ValidationMeta

export type ValidationMeta = {
  validationCount?: number
  validationAsyncCount?: number
  validationPromise?: Promise<ValidationError[]>
  validationResolve?: (errors: ValidationError[]) => void
  validationReject?: (errors: unknown) => void
}

export type ValidationError = undefined | false | null | string

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
  formError?: ValidationError
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

export class FormApi<TFormData> {
  // // This carries the context for nested fields
  options: FormOptions<TFormData> = {}
  store!: Store<FormState<TFormData>>
  // Do not use __state directly, as it is not reactive.
  // Please use form.useStore() utility to subscribe to state
  state!: FormState<TFormData>
  fieldInfo: Record<DeepKeys<TFormData>, FieldInfo<TFormData>> = {} as any
  fieldName?: string
  validationMeta: ValidationMeta = {}

  constructor(opts?: FormOptions<TFormData>) {
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

          const isFieldsValid = !fieldMetaValues.some((field) =>
            isNonEmptyArray(field?.errors),
          )

          const isTouched = fieldMetaValues.some((field) => field?.isTouched)

          const isValidating = isFieldsValidating || state.isFormValidating
          const isFormValid = !state.formError
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

  update = (options?: FormOptions<TFormData>) => {
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
      void (Object.values(this.fieldInfo) as FieldInfo<any>[]).forEach(
        (field) => {
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
        },
      )
    })

    return Promise.all(fieldValidationPromises)
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
    // await this.validateForm()

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
  ): FieldInfo<TFormData> => {
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

  deleteField = <TField extends DeepKeys<TFormData>>(
    field: TField,
  ) => {
    delete this.state.values[field as keyof TFormData]
    delete this.state.fieldMeta[field]
  }

  pushFieldValue = <TField extends DeepKeys<TFormData>>(
    field: TField,
    value: DeepValue<TFormData, TField>[number],
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
    value: DeepValue<TFormData, TField>[number],
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
