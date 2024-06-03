import { Store } from '@tanstack/store'
import { getAsyncValidatorArray, getBy, getSyncValidatorArray } from './utils'
import type { FieldInfo, FormApi } from './FormApi'
import type {
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
  Validator,
} from './types'
import type { AsyncValidator, SyncValidator, Updater } from './utils'
import type { DeepKeys, DeepValue, NoInfer } from './util-types'

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
  onChangeListenTo?: DeepKeys<TParentData>[]
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
  onBlurListenTo?: DeepKeys<TParentData>[]
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
  defaultValue?: NoInfer<TData>
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
  isPristine: boolean
  isDirty: boolean
  touchedErrors: ValidationError[]
  errors: ValidationError[]
  errorMap: ValidationErrorMap
  isValidating: boolean
}

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
    this.name = opts.name as never

    if (opts.defaultValue !== undefined) {
      this.form.setFieldValue(this.name, opts.defaultValue as never)
    }

    this.store = new Store<FieldState<TData>>(
      {
        value: this.getValue(),

        meta: this._getMeta() ?? {
          isValidating: false,
          isTouched: false,
          isDirty: false,
          isPristine: true,
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

          state.meta.isPristine = !state.meta.isDirty

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
        return adapter()[props.type](
          props.value as never,
          props.validate,
        ) as never
      }
    }

    return (props.validate as FieldValidateFn<any, any>)(props.value) as never
  }

  mount = () => {
    const info = this.getInfo()
    info.instance = this as never
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
        this.form.deleteField(this.name)
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

    if (this.state.value === undefined) {
      const formDefault = getBy(opts.form.options.defaultValues, opts.name)

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
    return this.form.getFieldValue(this.name) as TData
  }

  setValue = (
    updater: Updater<TData>,
    options?: { touch?: boolean; notify?: boolean },
  ) => {
    this.form.setFieldValue(this.name, updater as never, options)
    this.validate('change')
  }

  _getMeta = () => this.form.getFieldMeta(this.name)
  getMeta = () =>
    this._getMeta() ??
    ({
      isValidating: false,
      isTouched: false,
      isDirty: false,
      isPristine: true,
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

  replaceValue = (
    index: number,
    value: TData extends any[] ? TData[number] : never,
  ) => this.form.replaceFieldValue(this.name, index, value as any)

  removeValue = (index: number, opts?: { touch: boolean }) =>
    this.form.removeFieldValue(this.name, index, opts)

  swapValues = (aIndex: number, bIndex: number) =>
    this.form.swapFieldValues(this.name, aIndex, bIndex)

  getLinkedFields = (cause: ValidationCause) => {
    const fields = Object.values(this.form.fieldInfo) as FieldInfo<
      any,
      TFormValidator
    >[]

    const linkedFields: FieldApi<any, any, any, any>[] = []
    for (const field of fields) {
      if (!field.instance) continue
      const { onChangeListenTo, onBlurListenTo } =
        field.instance.options.validators || {}
      if (
        cause === 'change' &&
        onChangeListenTo?.includes(this.name as string)
      ) {
        linkedFields.push(field.instance)
      }
      if (cause === 'blur' && onBlurListenTo?.includes(this.name as string)) {
        linkedFields.push(field.instance)
      }
    }

    return linkedFields
  }

  moveValue = (aIndex: number, bIndex: number) =>
    this.form.moveFieldValues(this.name, aIndex, bIndex)

  validateSync = (cause: ValidationCause) => {
    const validates = getSyncValidatorArray(cause, this.options)

    const linkedFields = this.getLinkedFields(cause)
    const linkedFieldValidates = linkedFields.reduce(
      (acc, field) => {
        const fieldValidates = getSyncValidatorArray(cause, field.options)
        fieldValidates.forEach((validate) => {
          ;(validate as any).field = field
        })
        return acc.concat(fieldValidates as never)
      },
      [] as Array<SyncValidator<any> & { field: FieldApi<any, any, any, any> }>,
    )

    // Needs type cast as eslint errantly believes this is always falsy
    let hasErrored = false as boolean

    this.form.store.batch(() => {
      const validateFieldFn = (
        field: FieldApi<any, any, any, any>,
        validateObj: SyncValidator<any>,
      ) => {
        const error = normalizeError(
          field.runValidator({
            validate: validateObj.validate,
            value: { value: field.getValue(), fieldApi: field },
            type: 'validate',
          }),
        )
        const errorMapKey = getErrorMapKey(validateObj.cause)
        if (field.state.meta.errorMap[errorMapKey] !== error) {
          field.setMeta((prev) => ({
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

      for (const validateObj of validates) {
        if (!validateObj.validate) continue
        validateFieldFn(this, validateObj)
      }
      for (const fieldValitateObj of linkedFieldValidates) {
        if (!fieldValitateObj.validate) continue
        validateFieldFn(fieldValitateObj.field, fieldValitateObj)
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

  validateAsync = async (cause: ValidationCause) => {
    const validates = getAsyncValidatorArray(cause, this.options)

    const linkedFields = this.getLinkedFields(cause)
    const linkedFieldValidates = linkedFields.reduce(
      (acc, field) => {
        const fieldValidates = getAsyncValidatorArray(cause, field.options)
        fieldValidates.forEach((validate) => {
          ;(validate as any).field = field
        })
        return acc.concat(fieldValidates as never)
      },
      [] as Array<
        AsyncValidator<any> & { field: FieldApi<any, any, any, any> }
      >,
    )

    if (!this.state.meta.isValidating) {
      this.setMeta((prev) => ({ ...prev, isValidating: true }))
    }

    for (const linkedField of linkedFields) {
      linkedField.setMeta((prev) => ({ ...prev, isValidating: true }))
    }

    /**
     * We have to use a for loop and generate our promises this way, otherwise it won't be sync
     * when there are no validators needed to be run
     */
    const validatesPromises: Promise<ValidationError | undefined>[] = []
    const linkedPromises: Promise<ValidationError | undefined>[] = []

    const validateFieldAsyncFn = (
      field: FieldApi<any, any, any, any>,
      validateObj: AsyncValidator<any>,
      promises: Promise<ValidationError | undefined>[],
    ) => {
      const key = getErrorMapKey(validateObj.cause)
      const fieldValidatorMeta = field.getInfo().validationMetaMap[key]

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
                        value: field.getValue(),
                        fieldApi: field,
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
          field.setMeta((prev) => {
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

    // TODO: Dedupe this logic to reduce bundle size
    for (const validateObj of validates) {
      if (!validateObj.validate) continue
      validateFieldAsyncFn(this, validateObj, validatesPromises)
    }
    for (const fieldValitateObj of linkedFieldValidates) {
      if (!fieldValitateObj.validate) continue
      validateFieldAsyncFn(
        fieldValitateObj.field,
        fieldValitateObj,
        linkedPromises,
      )
    }

    let results: ValidationError[] = []
    if (validatesPromises.length || linkedPromises.length) {
      results = await Promise.all(validatesPromises)
      await Promise.all(linkedPromises)
    }

    this.setMeta((prev) => ({ ...prev, isValidating: false }))

    for (const linkedField of linkedFields) {
      linkedField.setMeta((prev) => ({ ...prev, isValidating: false }))
    }

    return results.filter(Boolean)
  }

  validate = (
    cause: ValidationCause,
  ): ValidationError[] | Promise<ValidationError[]> => {
    // If the field is pristine and validatePristine is false, do not validate
    if (!this.state.meta.isTouched) return []

    try {
      this.form.validate(cause)
    } catch (_) {}

    // Attempt to sync validate first
    const { hasErrored } = this.validateSync(cause)

    if (hasErrored && !this.options.asyncAlways) {
      return this.state.meta.errors
    }
    // No error? Attempt async validation
    return this.validateAsync(cause)
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
