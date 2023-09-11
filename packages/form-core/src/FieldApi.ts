import { type DeepKeys, type DeepValue, type Updater } from './utils'
import type { FormApi, ValidationError, ValidationErrorMap } from './FormApi'
import { Store } from '@tanstack/store'
import type { Validator } from './zod-validator'

export type ValidationCause = 'change' | 'blur' | 'submit' | 'mount'

export type RestrictTName<TFormData> = unknown extends TFormData
  ? string
  : DeepKeys<TFormData>

type ValidateFn<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData,
> = (
  value: TData,
  fieldApi: FieldApi<_TData, TFormData, ValidatorType, TName, TData>,
) => ValidationError

type ValidateOrFn<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData,
> = ValidatorType extends Validator<TData>
  ? Parameters<ReturnType<ValidatorType>['validate']>[1]
  : ValidateFn<_TData, TFormData, ValidatorType, TName, TData>

type ValidateAsyncFn<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData,
> = (
  value: TData,
  fieldApi: FieldApi<_TData, TFormData, ValidatorType, TName, TData>,
) => ValidationError | Promise<ValidationError>

export interface FieldOptions<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData,
> {
  name: TName
  index?: _TData extends any[] ? number : never
  defaultValue?: _TData
  asyncDebounceMs?: number
  asyncAlways?: boolean
  validator?: ValidatorType
  onMount?: (fieldApi: FieldApi<TData, TFormData, ValidatorType>) => void
  onChange?: ValidateOrFn<_TData, TFormData, ValidatorType, TName, TData>
  onChangeAsync?: ValidateAsyncFn<
    _TData,
    TFormData,
    ValidatorType,
    TName,
    TData
  >
  onChangeAsyncDebounceMs?: number
  onBlur?: ValidateOrFn<_TData, TFormData, ValidatorType, TName, TData>
  onBlurAsync?: ValidateAsyncFn<_TData, TFormData, ValidatorType, TName, TData>
  onBlurAsyncDebounceMs?: number
  onSubmitAsync?: ValidateAsyncFn<
    _TData,
    TFormData,
    ValidatorType,
    TName,
    TData
  >
  defaultMeta?: Partial<FieldMeta>
}

export interface FieldApiOptions<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData,
> extends FieldOptions<_TData, TFormData, ValidatorType, TName, TData> {
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

export class FieldApi<
  _TData,
  TFormData,
  ValidatorType = unknown,
  /**
   * This allows us to restrict the name to only be a valid field name while
   * also assigning it to a generic
   */
  TName extends RestrictTName<TFormData> = RestrictTName<TFormData>,
  /**
   * If TData is unknown, we can use the TName generic to determine the type
   */
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
> {
  uid: number
  form: (typeof this.options)['form']
  name!: DeepKeys<TFormData>
  store!: Store<FieldState<TData>>
  state!: FieldState<TData>
  prevState!: FieldState<TData>

  constructor(
    public options: FieldApiOptions<
      _TData,
      TFormData,
      ValidatorType,
      TName,
      TData
    >,
  ) {
    this.form = options.form
    this.uid = uid++
    // Support field prefixing from FieldScope
    // let fieldPrefix = ''
    // if (this.form.fieldName) {
    //   fieldPrefix = `${this.form.fieldName}.`
    // }

    this.name = options.name as never

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
          ...options.defaultMeta,
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
        delete this.form.fieldInfo[this.name as never]
      }
    }
  }

  update = (
    opts: FieldApiOptions<_TData, TFormData, ValidatorType, TName, TData>,
  ) => {
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

  getValue = (): TData => {
    return this.form.getFieldValue(this.name)
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

  getSubField = <SubTName extends DeepKeys<TData>>(name: SubTName) =>
    new FieldApi<DeepValue<TData, SubTName>, TFormData, ValidatorType>({
      name: `${this.name}.${name}` as never,
      form: this.form,
    })

  getValidateTransformer = () => {
    const isValidator = (
      item: unknown,
    ): item is Validator<
      TData,
      typeof this.options.onBlur | typeof this.options.onChange
    > =>
      !!item && typeof item === 'function' && (item as any).isValidator === true

    return isValidator(this.options.validator) ? this.options.validator() : null
  }

  validateSync = (value = this.state.value, cause: ValidationCause) => {
    const { onChange, onBlur } = this.options
    const validate =
      cause === 'submit' ? undefined : cause === 'change' ? onChange : onBlur

    const validateTransformer = this.getValidateTransformer()

    if (!validate) return

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationCount = (this.getInfo().validationCount || 0) + 1
    this.getInfo().validationCount = validationCount

    const doValidate = () => {
      if (validateTransformer) {
        return validateTransformer.validate(value, validate)
      }

      return (
        validate as ValidateFn<_TData, TFormData, ValidatorType, TName, TData>
      )(value, this as never)
    }

    const error = normalizeError(doValidate())
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

  __leaseValidateAsync = () => {
    const count = (this.getInfo().validationAsyncCount || 0) + 1
    this.getInfo().validationAsyncCount = count
    return count
  }

  cancelValidateAsync = () => {
    // Lease a new validation count to ignore any pending validations
    this.__leaseValidateAsync()
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
    const validationAsyncCount = this.__leaseValidateAsync()

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
