import { Store } from '@tanstack/store'
import type { FormApi } from './FormApi'
import type {
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
  Validator,
} from './types'
import type { DeepKeys, DeepValue, Updater } from './utils'
import { getAsyncValidatorArray, getSyncValidatorArray } from './utils'

export type FieldValidateFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = (props: {
  value: TData
  fieldApi: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
}) => ValidationError

export type FieldValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = TFieldValidator extends Validator<TData, infer TFN>
  ?
      | TFN
      | FieldValidateFn<
          TParentData,
          TName,
          TFieldValidator,
          TFormValidator,
          TData
        >
  : TFormValidator extends Validator<TParentData, infer FFN>
    ?
        | FFN
        | FieldValidateFn<
            TParentData,
            TName,
            TFieldValidator,
            TFormValidator,
            TData
          >
    : FieldValidateFn<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >

export type FieldValidateAsyncFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = (options: {
  value: TData
  fieldApi: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
  signal: AbortSignal
}) => ValidationError | Promise<ValidationError>

export type FieldAsyncValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = TFieldValidator extends Validator<TData, infer TFN>
  ?
      | TFN
      | FieldValidateAsyncFn<
          TParentData,
          TName,
          TFieldValidator,
          TFormValidator,
          TData
        >
  : TFormValidator extends Validator<TParentData, infer FFN>
    ?
        | FFN
        | FieldValidateAsyncFn<
            TParentData,
            TName,
            TFieldValidator,
            TFormValidator,
            TData
          >
    : FieldValidateAsyncFn<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >

export interface FieldValidators<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> {
  onMount?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  onChange?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  onChangeAsync?: FieldAsyncValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  onChangeAsyncDebounceMs?: number
  onBlur?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  onBlurAsync?: FieldAsyncValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  onBlurAsyncDebounceMs?: number
  onSubmit?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  onSubmitAsync?: FieldAsyncValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  onSubmitAsyncDebounceMs?: number
}

export interface FieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> {
  name: TName
  index?: TData extends any[] ? number : never
  defaultValue?: TData
  asyncDebounceMs?: number
  asyncAlways?: boolean
  preserveValue?: boolean
  validatorAdapter?: TFieldValidator
  validators?: FieldValidators<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  defaultMeta?: Partial<FieldMeta>
}

export interface FieldApiOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> extends FieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  > {
  form: FormApi<TParentData, TFormValidator>
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
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> {
  uid: number
  form: FieldApiOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >['form']
  name!: DeepKeys<TParentData>
  options: FieldApiOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  > = {} as any
  store!: Store<FieldState<TData>>
  state!: FieldState<TData>
  prevState!: FieldState<TData>

  constructor(
    opts: FieldApiOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
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

  runValidator<
    TValue extends { value: TData; fieldApi: FieldApi<any, any, any, any> },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FieldValidateOrFn<any, any, any, any>
      : FieldAsyncValidateOrFn<any, any, any, any>
    value: TValue
    type: TType
  }): ReturnType<ReturnType<Validator<any>>[TType]> {
    const adapters = [
      this.form.options.validatorAdapter,
      this.options.validatorAdapter,
    ] as const
    for (const adapter of adapters) {
      if (adapter && typeof props.validate !== 'function') {
        return adapter()[props.type](props.value, props.validate) as never
      }
    }

    return (props.validate as FieldValidateFn<any, any>)(props.value) as never
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
      const error = this.runValidator({
        validate: onMount,
        value: {
          value: this.state.value,
          fieldApi: this,
        },
        type: 'validate',
      })
      if (error) {
        this.setMeta((prev) => ({
          ...prev,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    opts: FieldApiOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
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
  ): FieldApi<
    TData,
    TSubName,
    Validator<TSubData, unknown> | undefined,
    Validator<TData, unknown> | undefined,
    TSubData
  > =>
    new FieldApi({
      name: `${this.name}.${name}` as never,
      form: this.form,
    }) as any

  validateSync = (value = this.state.value, cause: ValidationCause) => {
    const validates = getSyncValidatorArray(cause, this.options)

    // Needs type cast as eslint errantly believes this is always falsy
    let hasErrored = false as boolean

    this.form.store.batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue
        const error = normalizeError(
          this.runValidator({
            validate: validateObj.validate,
            value: { value, fieldApi: this },
            type: 'validate',
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
    const validates = getAsyncValidatorArray(cause, this.options)

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
      const fieldValidatorMeta = this.getInfo().validationMetaMap[key]

      fieldValidatorMeta?.lastAbortController.abort()
      const controller = new AbortController()

      this.getInfo().validationMetaMap[key] = {
        lastAbortController: controller,
      }

      promises.push(
        new Promise<ValidationError | undefined>(async (resolve) => {
          let rawError!: ValidationError | undefined
          try {
            rawError = await new Promise((rawResolve, rawReject) => {
              setTimeout(async () => {
                if (controller.signal.aborted) return rawResolve(undefined)
                try {
                  rawResolve(
                    await this.runValidator({
                      validate: validateObj.validate,
                      value: {
                        value,
                        fieldApi: this,
                        signal: controller.signal,
                      },
                      type: 'validateAsync',
                    }),
                  )
                } catch (e) {
                  rawReject(e)
                }
              }, validateObj.debounceMs)
            })
          } catch (e: unknown) {
            rawError = e as ValidationError
          }
          const error = normalizeError(rawError)
          this.setMeta((prev) => {
            return {
              ...prev,
              errorMap: {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    case 'blur':
      return 'onBlur'
    case 'mount':
      return 'onMount'
    case 'server':
      return 'onServer'
    case 'change':
    default:
      return 'onChange'
  }
}
