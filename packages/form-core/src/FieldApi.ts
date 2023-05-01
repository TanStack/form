//
import type { DeepKeys, DeepValue, RequiredByKey, Updater } from './utils'
import type { FormApi, ValidationError } from './FormApi'
import { Store } from '@tanstack/store'

export type ValidationCause = 'change' | 'blur' | 'submit'

export interface FieldOptions<TData, TFormData> {
  name: unknown extends TFormData ? string : DeepKeys<TFormData>
  defaultValue?: TData
  validate?: (
    value: TData,
    fieldApi: FieldApi<TData, TFormData>,
  ) => ValidationError
  validateAsync?: (
    value: TData,
    fieldApi: FieldApi<TData, TFormData>,
  ) => ValidationError | Promise<ValidationError>
  validatePristine?: boolean // Default: false
  validateOn?: ValidationCause // Default: 'change'
  validateAsyncOn?: ValidationCause // Default: 'blur'
  validateAsyncDebounceMs?: number
  defaultMeta?: Partial<FieldMeta>
}

export type FieldApiOptions<TData, TFormData> = FieldOptions<
  TData,
  TFormData
> & {
  form: FormApi<TFormData>
}

export type FieldMeta = {
  isTouched: boolean
  touchedError?: ValidationError
  error?: ValidationError
  isValidating: boolean
}

export type UserChangeProps<TData> = {
  onChange?: (updater: Updater<TData>) => void
  onBlur?: (event: any) => void
}

export type UserInputProps = {
  onChange?: (event: any) => void
  onBlur?: (event: any) => void
}

export type ChangeProps<TData> = {
  value: TData
  onChange: (updater: Updater<TData>) => void
  onBlur: (event: any) => void
}

export type InputProps = {
  value: string
  onChange: (event: any) => void
  onBlur: (event: any) => void
}

let uid = 0

export type FieldState<TData> = {
  value: TData
  meta: FieldMeta
}

export class FieldApi<TData, TFormData> {
  uid: number
  form: FormApi<TFormData>
  name!: DeepKeys<TFormData>
  store!: Store<FieldState<TData>>
  state!: FieldState<TData>
  options: RequiredByKey<
    FieldOptions<TData, TFormData>,
    | 'validatePristine'
    | 'validateOn'
    | 'validateAsyncOn'
    | 'validateAsyncDebounceMs'
  > = {} as any

  constructor(opts: FieldApiOptions<TData, TFormData>) {
    this.form = opts.form
    this.uid = uid++
    // Support field prefixing from FieldScope
    let fieldPrefix = ''
    if (this.form.fieldName) {
      fieldPrefix = `${this.form.fieldName}.`
    }

    this.name = (fieldPrefix + opts.name) as any

    this.store = new Store<FieldState<TData>>(
      {
        value: this.getValue(),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        meta: this.getMeta() ?? {
          isValidating: false,
          isTouched: false,
          ...this.options.defaultMeta,
        },
      },
      {
        onUpdate: (next) => {
          next.meta.touchedError = next.meta.isTouched
            ? next.meta.error
            : undefined

          // Do not validate pristine fields
          const prevState = this.state
          this.state = next
          if (next.value !== prevState.value) {
            this.validate('change', next.value)
          }
        },
      },
    )

    this.state = this.store.state
    this.update(opts)
  }

  mount = () => {
    const info = this.getInfo()
    info.instances[this.uid] = this

    const unsubscribe = this.form.store.subscribe(() => {
      this.#updateStore()
    })

    return () => {
      unsubscribe()
      delete info.instances[this.uid]
      if (!Object.keys(info.instances).length) {
        delete this.form.fieldInfo[this.name]
      }
    }
  }

  #updateStore = () => {
    this.store.batch(() => {
      const nextValue = this.getValue()
      const nextMeta = this.getMeta()

      if (nextValue !== this.state.value) {
        this.store.setState((prev) => ({ ...prev, value: nextValue }))
      }

      if (nextMeta !== this.state.meta) {
        this.store.setState((prev) => ({ ...prev, meta: nextMeta }))
      }
    })
  }

  update = (opts: FieldApiOptions<TData, TFormData>) => {
    this.options = {
      validatePristine: this.form.options.defaultValidatePristine ?? false,
      validateOn: this.form.options.defaultValidateOn ?? 'change',
      validateAsyncOn: this.form.options.defaultValidateAsyncOn ?? 'blur',
      validateAsyncDebounceMs:
        this.form.options.defaultValidateAsyncDebounceMs ?? 0,
      ...opts,
    }

    // Default Value
    if (
      this.state.value === undefined &&
      this.options.defaultValue !== undefined
    ) {
      this.setValue(this.options.defaultValue)
    }

    // Default Meta
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.getMeta() === undefined) {
      this.setMeta(this.state.meta)
    }
  }

  getValue = (): TData => this.form.getFieldValue(this.name)
  setValue = (
    updater: Updater<TData>,
    options?: { touch?: boolean; notify?: boolean },
  ) => this.form.setFieldValue(this.name, updater as any, options)

  getMeta = (): FieldMeta => this.form.getFieldMeta(this.name)
  setMeta = (updater: Updater<FieldMeta>) =>
    this.form.setFieldMeta(this.name, updater)

  getInfo = () => this.form.getFieldInfo(this.name)

  pushValue = (value: TData) =>
    this.form.pushFieldValue(this.name, value as any)
  insertValue = (index: number, value: TData) =>
    this.form.insertFieldValue(this.name, index, value as any)
  removeValue = (index: number) => this.form.spliceFieldValue(this.name, index)
  swapValues = (aIndex: number, bIndex: number) =>
    this.form.swapFieldValues(this.name, aIndex, bIndex)

  getSubField = <TName extends DeepKeys<TData>>(name: TName) =>
    new FieldApi<DeepValue<TData, TName>, TFormData>({
      name: `${this.name}.${name}` as any,
      form: this.form,
    })

  validateSync = async (value = this.state.value) => {
    const { validate } = this.options

    if (!validate) {
      return
    }

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationCount = (this.getInfo().validationCount || 0) + 1
    this.getInfo().validationCount = validationCount
    const error = normalizeError(validate(value, this))

    if (this.state.meta.error !== error) {
      this.setMeta((prev) => ({
        ...prev,
        error,
      }))
    }

    // If a sync error is encountered, cancel any async validation
    if (this.state.meta.error) {
      this.cancelValidateAsync()
    }
  }

  #leaseValidateAsync = () => {
    const count = (this.getInfo().validationAsyncCount || 0) + 1
    this.getInfo().validationAsyncCount = count
    return count
  }

  cancelValidateAsync = () => {
    // Lease a new validation count to ignore any pending validations
    this.#leaseValidateAsync()
    // Cancel any pending validation state
    this.setMeta((prev) => ({
      ...prev,
      isValidating: false,
    }))
  }

  validateAsync = async (value = this.state.value) => {
    const { validateAsync, validateAsyncDebounceMs } = this.options

    if (!validateAsync) {
      return
    }

    if (this.state.meta.isValidating !== true)
      this.setMeta((prev) => ({ ...prev, isValidating: true }))

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationAsyncCount = this.#leaseValidateAsync()

    const checkLatest = () =>
      validationAsyncCount === this.getInfo().validationAsyncCount

    if (!this.getInfo().validationPromise) {
      this.getInfo().validationPromise = new Promise((resolve, reject) => {
        this.getInfo().validationResolve = resolve
        this.getInfo().validationReject = reject
      })
    }

    if (validateAsyncDebounceMs > 0) {
      await new Promise((r) => setTimeout(r, validateAsyncDebounceMs))
    }

    // Only kick off validation if this validation is the latest attempt
    if (checkLatest()) {
      try {
        const rawError = await validateAsync(value, this)

        if (checkLatest()) {
          const error = normalizeError(rawError)
          this.setMeta((prev) => ({
            ...prev,
            isValidating: false,
            error,
          }))
          this.getInfo().validationResolve?.(error)
        }
      } catch (error) {
        if (checkLatest()) {
          this.getInfo().validationReject?.(error)
          throw error
        }
      } finally {
        if (checkLatest()) {
          this.setMeta((prev) => ({ ...prev, isValidating: false }))
          delete this.getInfo().validationPromise
        }
      }
    }

    // Always return the latest validation promise to the caller
    return this.getInfo().validationPromise
  }

  shouldValidate = (isAsync: boolean, cause?: ValidationCause) => {
    const { validateOn, validateAsyncOn } = this.options
    const level = getValidationCauseLevel(cause)

    // Must meet *at least* the validation level to validate,
    // e.g. if validateOn is 'change' and validateCause is 'blur',
    // the field will still validate
    return Object.keys(validateCauseLevels).some((d) =>
      isAsync
        ? validateAsyncOn
        : validateOn === d && level >= validateCauseLevels[d],
    )
  }

  validate = async (
    cause?: ValidationCause,
    value?: TData,
  ): Promise<ValidationError> => {
    // If the field is pristine and validatePristine is false, do not validate
    if (!this.options.validatePristine && !this.state.meta.isTouched) return

    // Attempt to sync validate first
    if (this.shouldValidate(false, cause)) {
      this.validateSync(value)
    }

    // If there is an error, return it, do not attempt async validation
    if (this.state.meta.error) {
      return this.state.meta.error
    }

    // No error? Attempt async validation
    if (this.shouldValidate(true, cause)) {
      return this.validateAsync(value)
    }

    // If there is no sync error or async validation attempt, there is no error
    return undefined
  }

  getChangeProps = <T extends UserChangeProps<any>>(
    props: T = {} as T,
  ): ChangeProps<TData> & Omit<T, keyof ChangeProps<TData>> => {
    return {
      ...props,
      value: this.state.value,
      onChange: (value) => {
        this.setValue(value)
        props.onChange?.(value)
      },
      onBlur: (e) => {
        this.setMeta((prev) => ({ ...prev, isTouched: true }))
        this.validate('blur')
        props.onBlur?.(e)
      },
    } as ChangeProps<TData> & Omit<T, keyof ChangeProps<TData>>
  }

  getInputProps = <T extends UserInputProps>(
    props: T = {} as T,
  ): InputProps & Omit<T, keyof InputProps> => {
    return {
      ...props,
      value: String(this.state.value),
      onChange: (e) => {
        this.setValue(e.target.value)
        props.onChange?.(e.target.value)
      },
      onBlur: this.getChangeProps(props).onBlur,
    }
  }
}

const validateCauseLevels = {
  change: 0,
  blur: 1,
  submit: 2,
}

function getValidationCauseLevel(cause?: ValidationCause) {
  return !cause ? 3 : validateCauseLevels[cause]
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
