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
> = (props: {
  value: TData
  fieldApi: FieldApi<TParentData, TName, ValidatorType, TData>
}) => ValidationError

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
> = (options: {
  value: TData
  fieldApi: FieldApi<TParentData, TName, ValidatorType, TData>
  signal: AbortSignal
}) => ValidationError | Promise<ValidationError>

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
      const error = runValidatorOrAdapter({
        validateFn: onMount,
        value: {
          value: this.state.value,
          fieldApi: this,
        },
        methodName: 'validate',
        adapters: [this.options.validatorAdapter as never],
      })
      if (error) {
        this.setMeta((prev) => ({
          ...prev,
          errorMap: { ...prev?.errorMap, onMount: error },
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

    // Needs type cast as eslint errantly believes this is always falsy
    let hasErrored = false as boolean

    this.form.store.batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue
        const error = normalizeError(
          runValidatorOrAdapter({
            validateFn: validateObj.validate,
            value: { value, fieldApi: this },
            methodName: 'validate',
            adapters: [
              this.form.options.validatorAdapter,
              this.options.validatorAdapter as never,
            ],
          }),
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

    return { hasErrored }
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

    if (!this.state.meta.isValidating) {
      this.setMeta((prev) => ({ ...prev, isValidating: true }))
    }

    /**
     * We have to use a for loop and generate our promises this way, otherwise it won't be sync
     * when there are no validators needed to be run
     */
    const promises: Promise<ValidationError | undefined>[] = []

    for (const validateObj of validates) {
      if (!validateObj.validate) continue
      const key = getErrorMapKey(validateObj.cause)
      const fieldOnChangeMeta = this.getInfo().validationMetaMap[key]

      fieldOnChangeMeta?.lastAbortController.abort()
      // Sorry Safari 12
      // eslint-disable-next-line compat/compat
      const controller = new AbortController()

      this.getInfo().validationMetaMap[key] = {
        lastAbortController: controller,
      }

      promises.push(
        new Promise<ValidationError | undefined>(async (resolve) => {
          let rawError!: ValidationError | undefined
          try {
            rawError = await new Promise((resolve, reject) => {
              setTimeout(() => {
                if (controller.signal.aborted) return resolve(undefined)
                runValidatorOrAdapter({
                  validateFn: validateObj.validate,
                  value: { value, fieldApi: this, signal: controller.signal },
                  methodName: 'validateAsync',
                  adapters: [
                    this.form.options.validatorAdapter,
                    this.options.validatorAdapter as never,
                  ],
                })
                  .then(resolve)
                  .catch(reject)
              }, onChangeAsyncDebounceMs)
            })
          } catch (e: unknown) {
            rawError = e as ValidationError
          }
          const error = normalizeError(rawError)
          this.setMeta((prev) => {
            return {
              ...prev,
              errorMap: {
                ...prev?.errorMap,
                [getErrorMapKey(cause)]: error,
              },
            }
          })

          resolve(error)
        }),
      )
    }

    let results: ValidationError[] = []
    if (promises.length) {
      results = await Promise.all(promises)
    }

    this.setMeta((prev) => ({ ...prev, isValidating: false }))

    return results.filter(Boolean)
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
