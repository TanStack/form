import { type DeepKeys, type DeepValue, type Updater } from './utils'
import type { FormApi, ValidationError, ValidationErrorMap } from './FormApi'
import { Store } from '@tanstack/store'

export type ValidationCause = 'change' | 'blur' | 'submit' | 'mount'

type ValidateFn<TParentData, TName extends DeepKeys<TParentData>, TData> = (
  value: TData,
  fieldApi: FieldApi<TParentData, TName>,
) => ValidationError

type ValidateAsyncFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData,
> = (
  value: TData,
  fieldApi: FieldApi<TParentData, TName>,
) => ValidationError | Promise<ValidationError>

export interface FieldOptions<
  TParentData,
  /**
   * This allows us to restrict the name to only be a valid field name while
   * also assigning it to a generic
   */
  TName extends DeepKeys<TParentData>,
  /**
   * If TData is unknown, we can use the TName generic to determine the type
   */
  TData = DeepValue<TParentData, TName>,
> {
  name: DeepKeys<TParentData>
  index?: TData extends any[] ? number : never
  defaultValue?: TData
  asyncDebounceMs?: number
  asyncAlways?: boolean
  onMount?: (formApi: FieldApi<TParentData, TName>) => void
  onChange?: ValidateFn<TParentData, TName, TData>
  onChangeAsync?: ValidateAsyncFn<TParentData, TName, TData>
  onChangeAsyncDebounceMs?: number
  onBlur?: ValidateFn<TParentData, TName, TData>
  onBlurAsync?: ValidateAsyncFn<TParentData, TName, TData>
  onBlurAsyncDebounceMs?: number
  onSubmitAsync?: ValidateAsyncFn<TParentData, TName, TData>
  defaultMeta?: Partial<FieldMeta>
}

export interface FieldApiOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
> extends FieldOptions<TParentData, TName, TData> {
  form: FormApi<TParentData>
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

export type ResolveName<TParentData> = unknown extends TParentData
  ? string
  : DeepKeys<TParentData>

export class FieldApi<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
> {
  uid: number
  form: FieldApiOptions<TParentData, TName, TData>['form']
  name!: DeepKeys<TParentData>
  options: FieldApiOptions<TParentData, TName> = {} as any
  store!: Store<FieldState<TData>>
  state!: FieldState<TData>
  prevState!: FieldState<TData>

  constructor(
    opts: FieldApiOptions<TParentData, TName, TData> & {
      form: FormApi<TParentData>
    },
  ) {
    this.form = opts.form
    this.uid = uid++
    // Support field prefixing from FieldScope
    // let fieldPrefix = ''
    // if (this.form.fieldName) {
    //   fieldPrefix = `${this.form.fieldName}.`
    // }

    this.name = opts.name as any

    this.store = new Store<FieldState<TData>>(
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

          state.meta.errors = Object.values(state.meta.errorMap).filter(
            (val: unknown) => val !== undefined,
          )

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
    info.instances[this.uid] = this as never

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

  update = (opts: FieldApiOptions<TParentData, TName, TData>) => {
    // Default Value
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.state.value === undefined) {
      const formDefault =
        opts.form.options.defaultValues?.[opts.name as keyof TParentData]

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

  getValue = (): TData => {
    return this.form.getFieldValue(this.name) as any
  }

  setValue = (
    updater: Updater<TData>,
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

  pushValue = (value: TData extends any[] ? TData[number] : never) =>
    this.form.pushFieldValue(this.name, value as any)

  insertValue = (
    index: number,
    value: TData extends any[] ? TData[number] : never,
  ) => this.form.insertFieldValue(this.name, index, value as any)

  removeValue = (index: number) => this.form.removeFieldValue(this.name, index)

  swapValues = (aIndex: number, bIndex: number) =>
    this.form.swapFieldValues(this.name, aIndex, bIndex)

  getSubField = <
    TSubName extends DeepKeys<TData>,
    TSubData = DeepValue<TData, TSubName>,
  >(
    name: TSubName,
  ): FieldApi<TData, TSubName, TSubData> =>
    new FieldApi({
      name: `${this.name}.${name}` as never,
      form: this.form,
    }) as any

  validateSync = (value = this.state.value, cause: ValidationCause) => {
    const { onChange, onBlur } = this.options
    const validate =
      cause === 'submit' ? undefined : cause === 'change' ? onChange : onBlur
    if (!validate) return

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationCount = (this.getInfo().validationCount || 0) + 1
    this.getInfo().validationCount = validationCount
    const error = normalizeError(validate(value as never, this as never))
    const errorMapKey = getErrorMapKey(cause)
    if (this.state.meta.errorMap[errorMapKey] !== error) {
      this.setMeta((prev) => ({
        ...prev,
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
    value?: TData,
  ): ValidationError[] | Promise<ValidationError[]> => {
    // If the field is pristine and validatePristine is false, do not validate
    if (!this.state.meta.isTouched) return []
    // Attempt to sync validate first
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

  handleChange = (updater: Updater<TData>) => {
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
