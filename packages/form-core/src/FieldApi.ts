import { Store } from '@tanstack/store'
import type { FormApi } from './FormApi'
import type {
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
  Validator,
} from './types'
import type { DeepKeys, DeepValue, Updater } from './utils'
import { runValidatorOrAdapter } from './utils'

type ValidateFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = (
  value: TData,
  fieldApi: FieldApi<TParentData, TName, ValidatorType, TData>,
) => ValidationError

type ValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = ValidatorType extends Validator<TData>
  ?
      | Parameters<ReturnType<ValidatorType>['validate']>[1]
      | ValidateFn<TParentData, TName, ValidatorType, TData>
  : FormValidator extends Validator<TData>
  ?
      | Parameters<ReturnType<FormValidator>['validate']>[1]
      | ValidateFn<TParentData, TName, ValidatorType, TData>
  : ValidateFn<TParentData, TName, ValidatorType, TData>

type ValidateAsyncFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = (
  value: TData,
  fieldApi: FieldApi<TParentData, TName, ValidatorType, TData>,
) => ValidationError | Promise<ValidationError>

type AsyncValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = ValidatorType extends Validator<TData>
  ?
      | Parameters<ReturnType<ValidatorType>['validate']>[1]
      | ValidateAsyncFn<TParentData, TName, ValidatorType, TData>
  : FormValidator extends Validator<TData>
  ?
      | Parameters<ReturnType<FormValidator>['validate']>[1]
      | ValidateAsyncFn<TParentData, TName, ValidatorType, TData>
  : ValidateAsyncFn<TParentData, TName, ValidatorType, TData>

export interface FieldValidators<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> {
  onMount?: ValidateOrFn<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >
  onChange?: ValidateOrFn<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >
  onChangeAsync?: AsyncValidateOrFn<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >
  onChangeAsyncDebounceMs?: number
  onBlur?: ValidateOrFn<TParentData, TName, ValidatorType, FormValidator, TData>
  onBlurAsync?: AsyncValidateOrFn<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >
  onBlurAsyncDebounceMs?: number
  onSubmit?: ValidateOrFn<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >
  onSubmitAsync?: AsyncValidateOrFn<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >
  onSubmitAsyncDebounceMs?: number
}

export interface FieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> {
  name: TName
  index?: TData extends any[] ? number : never
  defaultValue?: TData
  asyncDebounceMs?: number
  asyncAlways?: boolean
  preserveValue?: boolean
  validatorAdapter?: ValidatorType
  validators?: FieldValidators<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >
  defaultMeta?: Partial<FieldMeta>
}

export interface FieldApiOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> extends FieldOptions<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  > {
  form: FormApi<TParentData, FormValidator>
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
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> {
  uid: number
  form: FieldApiOptions<TParentData, TName, ValidatorType, TData>['form']
  name!: DeepKeys<TParentData>
  options: FieldApiOptions<TParentData, TName, ValidatorType, TData> = {} as any
  store!: Store<FieldState<TData>>
  state!: FieldState<TData>
  prevState!: FieldState<TData>

  constructor(
    opts: FieldApiOptions<
      TParentData,
      TName,
      ValidatorType,
      FormValidator,
      TData
    >,
  ) {
    this.form = opts.form as never
    this.uid = uid++
    // Support field prefixing from FieldScope
    // let fieldPrefix = ''
    // if (this.form.fieldName) {
    //   fieldPrefix = `${this.form.fieldName}.`
    // }

    this.name = opts.name as never

    if (opts.defaultValue !== undefined) {
      this.form.setFieldValue(this.name, opts.defaultValue as never)
    }

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
    const { onMount } = this.options.validators || {}

    if (onMount) {
      const error = this._runValidator(onMount, this.state.value, 'validate')
      if (error) {
        this.setMeta((prev) => ({
          ...prev,
          errorMap: { ...prev.errorMap, onMount: error },
        }))
      }
    }

    return () => {
      const preserveValue = this.options.preserveValue
      unsubscribe()
      if (!preserveValue) {
        delete info.instances[this.uid]
        this.form.deleteField(this.name)
      }

      if (!Object.keys(info.instances).length && !preserveValue) {
        delete this.form.fieldInfo[this.name]
      }
    }
  }

  update = (
    opts: FieldApiOptions<TParentData, TName, ValidatorType, TData>,
  ) => {
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
    TSubData extends DeepValue<TData, TSubName> = DeepValue<TData, TSubName>,
  >(
    name: TSubName,
  ): FieldApi<TData, TSubName, ValidatorType, TSubData> =>
    new FieldApi({
      name: `${this.name}.${name}` as never,
      form: this.form,
    }) as any

  _runValidator<T, M extends 'validate' | 'validateAsync'>(
    validate: T,
    value: TData,
    methodName: M,
  ) {
    return runValidatorOrAdapter({
      validateFn: validate,
      value: value,
      methodName: methodName,
      suppliedThis: this,
      adapters: [
        this.form.options.validatorAdapter,
        this.options.validatorAdapter as never,
      ],
    })
  }

  validateSync = (value = this.state.value, cause: ValidationCause) => {
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

    // Use the validationCount for all field instances to
    // track freshness of the validation
    const validationCount = (this.getInfo().validationCount || 0) + 1
    this.getInfo().validationCount = validationCount

    // Needs type cast as eslint errantly believes this is always falsy
    let hasErrored = false as boolean

    this.form.store.batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue
        const error = normalizeError(
          this._runValidator(validateObj.validate, value, 'validate'),
        )
        const errorMapKey = getErrorMapKey(validateObj.cause)
        if (this.state.meta.errorMap[errorMapKey] !== error) {
          this.setMeta((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [getErrorMapKey(validateObj.cause)]: error,
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
      this.state.meta.errorMap[submitErrKey] &&
      cause !== 'submit' &&
      !hasErrored
    ) {
      this.setMeta((prev) => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          [submitErrKey]: undefined,
        },
      }))
    }

    // If a sync error is encountered for the errorMapKey (eg. onChange), cancel any async validation
    if (hasErrored) {
      this.cancelValidateAsync()
    }

    return { hasErrored }
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
    const { asyncDebounceMs } = this.options
    const {
      onChangeAsync,
      onBlurAsync,
      onSubmitAsync,
      onBlurAsyncDebounceMs,
      onChangeAsyncDebounceMs,
      onSubmitAsyncDebounceMs,
    } = this.options.validators || {}

    const validate =
      cause === 'change'
        ? onChangeAsync
        : cause === 'submit'
        ? onSubmitAsync
        : onBlurAsync
    if (!validate) return []

    let debounceMs = asyncDebounceMs ?? 0

    if (cause === 'submit') debounceMs = onSubmitAsyncDebounceMs ?? debounceMs
    if (cause === 'change') debounceMs = onChangeAsyncDebounceMs ?? debounceMs
    if (cause === 'blur') debounceMs = onBlurAsyncDebounceMs ?? debounceMs

    if (this.state.meta.isValidating !== true) {
      this.setMeta((prev) => ({ ...prev, isValidating: true }))
    }

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
        const rawError = await this._runValidator(
          validate,
          value,
          'validateAsync',
        )
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
    return (await this.getInfo().validationPromise) ?? []
  }

  validate = (
    cause: ValidationCause,
    value?: TData,
  ): ValidationError[] | Promise<ValidationError[]> => {
    // If the field is pristine and validatePristine is false, do not validate
    if (!this.state.meta.isTouched) return []

    try {
      this.form.validate(cause)
    } catch (_) {}

    // Attempt to sync validate first
    const { hasErrored } = this.validateSync(value, cause)

    if (hasErrored && !this.options.asyncAlways) {
      return this.state.meta.errors
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
