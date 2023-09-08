import { type DeepKeys, type DeepValue, type Updater } from './utils'
import type { FormApi, ValidationError, ValidationErrorMap } from './FormApi'
import { Store } from '@tanstack/store'

export type ValidationCause = 'change' | 'blur' | 'submit' | 'mount'

type ValidateFn<TData, TFormData> = (
  value: TData,
  fieldApi: FieldApi<TData, TFormData>,
) => ValidationError

type ValidateAsyncFn<TData, TFormData> = (
  value: TData,
  fieldApi: FieldApi<TData, TFormData>,
) => ValidationError | Promise<ValidationError>

export interface FieldOptions<
  _TData,
  TFormData,
  /**
   * This allows us to restrict the name to only be a valid field name while
   * also assigning it to a generic
   */
  TName = unknown extends TFormData ? string : DeepKeys<TFormData>,
  /**
   * If TData is unknown, we can use the TName generic to determine the type
   */
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
> {
  name: TName
  index?: TData extends any[] ? number : never
  defaultValue?: TData
  asyncDebounceMs?: number
  asyncAlways?: boolean
  onMount?: (formApi: FieldApi<TData, TFormData>) => void
  onChange?: ValidateFn<TData, TFormData>
  onChangeAsync?: ValidateAsyncFn<TData, TFormData>
  onChangeAsyncDebounceMs?: number
  onBlur?: ValidateFn<TData, TFormData>
  onBlurAsync?: ValidateAsyncFn<TData, TFormData>
  onBlurAsyncDebounceMs?: number
  onSubmitAsync?: ValidateAsyncFn<TData, TFormData>
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
  touchedErrors: ValidationError[]
  errors: ValidationError[]
  errorMap: ValidationErrorMap
  isValidating: boolean
}

let uid = 0

export type FieldState<TData> = {
  value: TData
  meta: FieldMeta
}

/**
 * TData may not be known at the time of FieldApi construction, so we need to
 * use a conditional type to determine if TData is known or not.
 *
 * If TData is not known, we use the TFormData type to determine the type of
 * the field value based on the field name.
 */
type GetTData<Name, TData, TFormData> = unknown extends TData
  ? DeepValue<TFormData, Name>
  : TData

export class FieldApi<TData, TFormData> {
  uid: number
  form: FormApi<TFormData>
  name!: DeepKeys<TFormData>
  /**
   * This is a hack that allows us to use `GetTData` without calling it everywhere
   *
   * Unfortunately this hack appears to be needed alongside the `TName` hack
   * further up in this file. This properly types all of the internal methods,
   * while the `TName` hack types the options properly
   */
  _tdata!: GetTData<typeof this.name, TData, TFormData>
  store!: Store<FieldState<typeof this._tdata>>
  state!: FieldState<typeof this._tdata>
  prevState!: FieldState<typeof this._tdata>
  options: FieldOptions<typeof this._tdata, TFormData> = {} as any

  constructor(opts: FieldApiOptions<TData, TFormData>) {
    this.form = opts.form
    this.uid = uid++
    // Support field prefixing from FieldScope
    // let fieldPrefix = ''
    // if (this.form.fieldName) {
    //   fieldPrefix = `${this.form.fieldName}.`
    // }

    this.name = opts.name as any

    this.store = new Store<FieldState<typeof this._tdata>>(
      {
        value: this.getValue(),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        meta: this._getMeta() ?? {
          isValidating: false,
          isTouched: false,
          touchedErrors: [],
          errors: [],
          errorMap: {},
          ...opts.defaultMeta,
        },
      },
      {
        onUpdate: () => {
          const state = this.store.state

          state.meta.touchedErrors = state.meta.isTouched
            ? state.meta.errors
            : []

          this.prevState = state
          this.state = state
        },
      },
    )

    this.state = this.store.state
    this.prevState = this.state
    this.options = opts as never
  }

  mount = () => {
    const info = this.getInfo()
    info.instances[this.uid] = this

    const unsubscribe = this.form.store.subscribe(() => {
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
    })

    this.update(this.options as never)
    this.options.onMount?.(this as never)

    return () => {
      unsubscribe()
      delete info.instances[this.uid]
      if (!Object.keys(info.instances).length) {
        delete this.form.fieldInfo[this.name]
      }
    }
  }

  update = (opts: FieldApiOptions<typeof this._tdata, TFormData>) => {
    // Default Value
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.state.value === undefined) {
      const formDefault =
        opts.form.options.defaultValues?.[opts.name as keyof TFormData]

      if (opts.defaultValue !== undefined) {
        this.setValue(opts.defaultValue as never)
      } else if (formDefault !== undefined) {
        this.setValue(formDefault as never)
      }
    }

    // Default Meta
    if (this._getMeta() === undefined) {
      this.setMeta(this.state.meta)
    }

    this.options = opts as never
  }

  getValue = (): typeof this._tdata => {
    return this.form.getFieldValue(this.name)
  }

  setValue = (
    updater: Updater<typeof this._tdata>,
    options?: { touch?: boolean; notify?: boolean },
  ) => {
    this.form.setFieldValue(this.name, updater as never, options)
    this.validate('change', this.state.value)
  }

  _getMeta = () => this.form.getFieldMeta(this.name)
  getMeta = () =>
    this._getMeta() ??
    ({
      isValidating: false,
      isTouched: false,
      touchedErrors: [],
      errors: [],
      errorMap: {},
      ...this.options.defaultMeta,
    } as FieldMeta)

  setMeta = (updater: Updater<FieldMeta>) =>
    this.form.setFieldMeta(this.name, updater)

  getInfo = () => this.form.getFieldInfo(this.name)

  pushValue = (
    value: typeof this._tdata extends any[]
      ? (typeof this._tdata)[number]
      : never,
  ) => this.form.pushFieldValue(this.name, value as any)

  insertValue = (
    index: number,
    value: typeof this._tdata extends any[]
      ? (typeof this._tdata)[number]
      : never,
  ) => this.form.insertFieldValue(this.name, index, value as any)

  removeValue = (index: number) => this.form.removeFieldValue(this.name, index)

  swapValues = (aIndex: number, bIndex: number) =>
    this.form.swapFieldValues(this.name, aIndex, bIndex)

  getSubField = <TName extends DeepKeys<typeof this._tdata>>(name: TName) =>
    new FieldApi<DeepValue<typeof this._tdata, TName>, TFormData>({
      name: `${this.name}.${name}` as never,
      form: this.form,
    })

  validateSync = (value = this.state.value, cause: ValidationCause) => {
    const { onChange, onBlur } = this.options
    const validate =
      cause === 'submit' ? undefined : cause === 'change' ? onChange : onBlur
    console.log(cause, validate)
    if (!validate) return

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationCount = (this.getInfo().validationCount || 0) + 1
    this.getInfo().validationCount = validationCount
    const error = normalizeError(validate(value as never, this as never))
    const errorMapKey = getErrorMapKey(cause)
    if (error && this.state.meta.errorMap[errorMapKey] !== error) {
      this.setMeta((prev) => ({
        ...prev,
        errors: [...prev.errors, error],
        errorMap: {
          ...prev.errorMap,
          [getErrorMapKey(cause)]: error,
        },
      }))
    }

    // If a sync error is encountered for the errorMapKey (eg. onChange), cancel any async validation
    if (this.state.meta.errorMap[errorMapKey]) {
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

  validateAsync = async (value = this.state.value, cause: ValidationCause) => {
    const {
      onChangeAsync,
      onBlurAsync,
      onSubmitAsync,
      asyncDebounceMs,
      onBlurAsyncDebounceMs,
      onChangeAsyncDebounceMs,
    } = this.options

    const validate =
      cause === 'change'
        ? onChangeAsync
        : cause === 'submit'
        ? onSubmitAsync
        : onBlurAsync
    if (!validate) return []
    const debounceMs =
      cause === 'submit'
        ? 0
        : (cause === 'change'
            ? onChangeAsyncDebounceMs
            : onBlurAsyncDebounceMs) ??
          asyncDebounceMs ??
          0

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

    if (debounceMs > 0) {
      await new Promise((r) => setTimeout(r, debounceMs))
    }

    // Only kick off validation if this validation is the latest attempt
    if (checkLatest()) {
      const prevErrors = this.getMeta().errors
      try {
        const rawError = await validate(value as never, this as never)
        if (checkLatest()) {
          const error = normalizeError(rawError)
          this.setMeta((prev) => ({
            ...prev,
            isValidating: false,
            errors: [...prev.errors, error],
            errorMap: {
              ...prev.errorMap,
              [getErrorMapKey(cause)]: error,
            },
          }))
          this.getInfo().validationResolve?.([...prevErrors, error])
        }
      } catch (error) {
        if (checkLatest()) {
          this.getInfo().validationReject?.([...prevErrors, error])
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
    return this.getInfo().validationPromise ?? []
  }

  validate = (
    cause: ValidationCause,
    value?: typeof this._tdata,
  ): ValidationError[] | Promise<ValidationError[]> => {
    // If the field is pristine and validatePristine is false, do not validate
    if (!this.state.meta.isTouched) return []
    // Attempt to sync validate first
    console.log(cause)
    this.validateSync(value, cause)

    const errorMapKey = getErrorMapKey(cause)
    // If there is an error mapped to the errorMapKey (eg. onChange, onBlur, onSubmit), return the errors array, do not attempt async validation
    if (this.getMeta().errorMap[errorMapKey]) {
      if (!this.options.asyncAlways) {
        return this.state.meta.errors
      }
    }
    // No error? Attempt async validation
    return this.validateAsync(value, cause)
  }

  handleChange = (updater: Updater<typeof this._tdata>) => {
    this.setValue(updater, { touch: true })
  }

  handleBlur = () => {
    const prevTouched = this.state.meta.isTouched
    if (!prevTouched) {
      this.setMeta((prev) => ({ ...prev, isTouched: true }))
      this.validate('change')
    }
    this.validate('blur')
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
