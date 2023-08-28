//
import type { DeepKeys, DeepValue, RequiredByKey, Updater } from './utils'
import type { FormApi, ValidationError } from './FormApi'
import { Store } from '@tanstack/store'
import { setBy } from './utils'

export type ValidationCause = 'change' | 'blur' | 'submit'

type ValidateFn<TData, TFormData> = (
  value: TData,
  fieldApi: FieldApi<TData, TFormData>,
) => ValidationError

type ValidateAsyncFn<TData, TFormData> = (
  value: TData,
  fieldApi: FieldApi<TData, TFormData>,
) => ValidationError | Promise<ValidationError>

export interface FieldOptions<TData, TFormData> {
  name: unknown extends TFormData ? string : DeepKeys<TFormData>
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
  onChange: (value: TData) => void
  onBlur: (event: any) => void
}

export type InputProps<T> = {
  value: T
  onChange: (event: any) => void
  onBlur: (event: any) => void
}

let uid = 0

export type FieldState<TData> = {
  value: TData
  meta: FieldMeta
}

/**
 * TData may not known at the time of FieldApi construction, so we need to
 * use a conditional type to determine if TData is known or not.
 *
 * If TData is not known, we use the TFormData type to determine the type of
 * the field value based on the field name.
 */
type GetTData<Name, TData, TFormData> = TData extends unknown
  ? DeepValue<TFormData, Name>
  : TData

export class FieldApi<TData, TFormData> {
  uid: number
  form: FormApi<TFormData>
  name!: DeepKeys<TFormData>
  // This is a hack that allows us to use `GetTData` without calling it everywhere
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
        meta: this.getMeta() ?? {
          isValidating: false,
          isTouched: false,
          ...this.options.defaultMeta,
        },
      },
      {
        onUpdate: () => {
          const state = this.store.state

          state.meta.touchedError = state.meta.isTouched
            ? state.meta.error
            : undefined

          if (state.value !== this.prevState.value) {
            this.validate('change', state.value as never)
          }

          this.prevState = state
          this.state = state
        },
      },
    )

    this.state = this.store.state
    this.prevState = this.state
    this.update(opts as never)
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
    this.options = {
      asyncDebounceMs: this.form.options.asyncDebounceMs ?? 0,
      onChangeAsyncDebounceMs: this.form.options.onChangeAsyncDebounceMs ?? 0,
      onBlurAsyncDebounceMs: this.form.options.onBlurAsyncDebounceMs ?? 0,
      ...opts,
    } as never

    // Default Value
    if (this.state.value === undefined) {
      if (this.options.defaultValue !== undefined) {
        this.setValue(this.options.defaultValue as never)
      } else if (
        opts.form.options.defaultValues?.[
          this.options.name as keyof TFormData
        ] !== undefined
      ) {
        this.setValue(
          opts.form.options.defaultValues[
            this.options.name as keyof TFormData
          ] as never,
        )
      }
    }

    // Default Meta
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.getMeta() === undefined) {
      this.setMeta(this.state.meta)
    }
  }

  getValue = (): typeof this._tdata => {
    return this.form.getFieldValue(this.name)
  }
  setValue = (
    updater: Updater<typeof this._tdata>,
    options?: { touch?: boolean; notify?: boolean },
  ) => {
    this.form.setFieldValue(this.name, updater as any, options)
    this.store.setState((prev) => {
      return {
        ...prev,
        value: updater as any,
      }
    })
  }

  getMeta = (): FieldMeta => this.form.getFieldMeta(this.name)
  setMeta = (updater: Updater<FieldMeta>) =>
    this.form.setFieldMeta(this.name, updater)

  getInfo = () => this.form.getFieldInfo(this.name)

  pushValue = (
    value: typeof this._tdata extends any[]
      ? (typeof this._tdata)[number]
      : never,
  ) => this.form.pushFieldValue(this.name, value as any)
  insertValue = (index: number, value: typeof this._tdata) =>
    this.form.insertFieldValue(this.name, index, value as any)
  removeValue = (index: number) => this.form.removeFieldValue(this.name, index)
  swapValues = (aIndex: number, bIndex: number) =>
    this.form.swapFieldValues(this.name, aIndex, bIndex)

  getSubField = <TName extends DeepKeys<typeof this._tdata>>(name: TName) =>
    new FieldApi<DeepValue<typeof this._tdata, TName>, TFormData>({
      name: `${this.name}.${name}` as any,
      form: this.form,
    })

  validateSync = async (value = this.state.value, cause: ValidationCause) => {
    const { onChange, onBlur } = this.options
    const validate =
      cause === 'submit' ? undefined : cause === 'change' ? onChange : onBlur

    if (!validate) return

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationCount = (this.getInfo().validationCount || 0) + 1
    this.getInfo().validationCount = validationCount
    const error = normalizeError(validate(value, this as never))

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

    if (!validate) return

    const debounceMs =
      cause === 'submit'
        ? 0
        : (cause === 'change'
            ? onChangeAsyncDebounceMs
            : onBlurAsyncDebounceMs) ??
          asyncDebounceMs ??
          500

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
      try {
        const rawError = await validate(value, this as never)

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

  validate = (
    cause: ValidationCause,
    value?: typeof this._tdata,
  ): ValidationError | Promise<ValidationError> => {
    // If the field is pristine and validatePristine is false, do not validate
    if (!this.state.meta.isTouched) return

    // Attempt to sync validate first
    this.validateSync(value, cause)

    // If there is an error, return it, do not attempt async validation
    if (this.state.meta.error) {
      if (!this.options.asyncAlways) {
        return this.state.meta.error
      }
    }

    // No error? Attempt async validation
    return this.validateAsync(value, cause)
  }

  getChangeProps = <T extends UserChangeProps<any>>(
    props: T = {} as T,
  ): ChangeProps<typeof this._tdata> &
    Omit<T, keyof ChangeProps<typeof this._tdata>> => {
    return {
      ...props,
      value: this.state.value,
      onChange: (value) => {
        this.setValue(value as never)
        props.onChange?.(value)
      },
      onBlur: (e) => {
        const prevTouched = this.state.meta.isTouched
        this.setMeta((prev) => ({ ...prev, isTouched: true }))
        if (!prevTouched) {
          this.validate('change')
        }
        this.validate('blur')
      },
    } as ChangeProps<typeof this._tdata> &
      Omit<T, keyof ChangeProps<typeof this._tdata>>
  }

  getInputProps = <T extends UserInputProps>(
    props: T = {} as T,
  ): InputProps<typeof this._tdata> &
    Omit<T, keyof InputProps<typeof this._tdata>> => {
    return {
      ...props,
      value: this.state.value,
      onChange: (e) => {
        this.setValue(e.target.value)
        props.onChange?.(e.target.value)
      },
      onBlur: this.getChangeProps(props).onBlur,
    } as InputProps<typeof this._tdata> &
      Omit<T, keyof InputProps<typeof this._tdata>>
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
