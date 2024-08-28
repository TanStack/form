import { Store } from '@tanstack/store'
import { FormValidationError } from './types'
import { getAsyncValidatorArray, getBy, getSyncValidatorArray } from './utils'
import type { FieldInfo, FieldsErrorMapFromValidator, FormApi } from './FormApi'
import type {
  APITypes,
  UpdateMetaOptions,
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
  Validator,
} from './types'
import type { AsyncValidator, SyncValidator, Updater } from './utils'
import type { DeepKeys, DeepValue, NoInfer } from './util-types'

/**
 * @private
 */
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

/**
 * @private
 */
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
> =
  TFieldValidator extends Validator<TData, infer TFN>
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

/**
 * @private
 */
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

/**
 * @private
 */
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
> =
  TFieldValidator extends Validator<TData, infer TFN>
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
  /**
   * An optional function that takes a param of `formApi` which is a generic type of `TData` and `TParentData`
   */
  onMount?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  /**
   * An optional property that takes a `ValidateFn` which is a generic of `TData` and `TParentData`.
   * If `validatorAdapter` is passed, this may also accept a property from the respective adapter
   *
   * @example z.string().min(1) // if `zodAdapter` is passed
   */
  onChange?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  /**
   * An optional property similar to `onChange` but async validation. If `validatorAdapter`
   * is passed, this may also accept a property from the respective adapter
   *
   * @example z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' }) // if `zodAdapter` is passed
   */
  onChangeAsync?: FieldAsyncValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  /**
   * An optional number to represent how long the `onChangeAsync` should wait before running
   *
   * If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds
   */
  onChangeAsyncDebounceMs?: number
  /**
   * An optional list of field names that should trigger this field's `onChange` and `onChangeAsync` events when its value changes
   */
  onChangeListenTo?: DeepKeys<TParentData>[]
  /**
   * An optional function, that runs on the blur event of input.
   * If `validatorAdapter` is passed, this may also accept a property from the respective adapter
   *
   * @example z.string().min(1) // if `zodAdapter` is passed
   */
  onBlur?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  /**
   * An optional property similar to `onBlur` but async validation. If `validatorAdapter`
   * is passed, this may also accept a property from the respective adapter
   *
   * @example z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' }) // if `zodAdapter` is passed
   */
  onBlurAsync?: FieldAsyncValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >

  /**
   * An optional number to represent how long the `onBlurAsync` should wait before running
   *
   * If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds
   */
  onBlurAsyncDebounceMs?: number
  /**
   * An optional list of field names that should trigger this field's `onBlur` and `onBlurAsync` events when its value changes
   */
  onBlurListenTo?: DeepKeys<TParentData>[]
  /**
   * An optional function, that runs on the submit event of form.
   * If `validatorAdapter` is passed, this may also accept a property from the respective adapter
   *
   * @example z.string().min(1) // if `zodAdapter` is passed
   */
  onSubmit?: FieldValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  /**
   * An optional property similar to `onSubmit` but async validation. If `validatorAdapter`
   * is passed, this may also accept a property from the respective adapter
   *
   * @example z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' }) // if `zodAdapter` is passed
   */
  onSubmitAsync?: FieldAsyncValidateOrFn<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
}

/**
 * An object type representing the options for a field in a form.
 */
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
  /**
   * The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.
   */
  name: TName
  /**
   * An optional default value for the field.
   */
  defaultValue?: NoInfer<TData>
  /**
   * The default time to debounce async validation if there is not a more specific debounce time passed.
   */
  asyncDebounceMs?: number
  /**
   * If `true`, always run async validation, even if there are errors emitted during synchronous validation.
   */
  asyncAlways?: boolean
  /**
   * A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`
   */
  validatorAdapter?: TFieldValidator
  /**
   * A list of validators to pass to the field
   */
  validators?: FieldValidators<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >
  /**
   * An optional object with default metadata for the field.
   */
  defaultMeta?: Partial<FieldMeta>
}

/**
 * An object type representing the required options for the FieldApi class.
 */
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

/**
 * An object type representing the metadata of a field in a form.
 */
export type FieldMeta = {
  /**
   * A flag indicating whether the field has been touched.
   */
  isTouched: boolean
  /**
   * A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.
   */
  isPristine: boolean
  /**
   * A flag that is `true` if the field's value has been modified by the user. Opposite of `isPristine`.
   */
  isDirty: boolean
  /**
   * An array of errors related to the field value.
   */
  errors: ValidationError[]
  /**
   * A map of errors related to the field value.
   */
  errorMap: ValidationErrorMap
  /**
   * A flag indicating whether the field is currently being validated.
   */
  isValidating: boolean
}

/**
 * An object type representing the state of a field.
 */
export type FieldState<TData> = {
  /**
   * The current value of the field.
   */
  value: TData
  /**
   * The current metadata of the field.
   */
  meta: FieldMeta
}

/**
 * A class representing the API for managing a form field.
 *
 * Normally, you will not need to create a new `FieldApi` instance directly.
 * Instead, you will use a framework hook/function like `useField` or `createField`
 * to create a new instance for you that uses your framework's reactivity model.
 * However, if you need to create a new instance manually, you can do so by calling
 * the `new FieldApi` constructor.
 */
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
  /**
   * A reference to the form API instance.
   */
  form: FieldApiOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >['form']
  /**
   * The field name.
   */
  name!: DeepKeys<TParentData>
  /**
   * The field options.
   */
  options: FieldApiOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  > = {} as any
  /**
   * The field state store.
   */
  store!: Store<FieldState<TData>>
  /**
   * The current field state.
   */
  state!: FieldState<TData>
  /**
   * @private
   */
  prevState!: FieldState<TData>

  /**
   * Initializes a new `FieldApi` instance.
   */
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
      this.form.setFieldValue(this.name, opts.defaultValue as never, {
        dontUpdateMeta: true,
      })
    }

    this.store = new Store<FieldState<TData>>(
      {
        value: this.getValue(),

        meta: this._getMeta() ?? {
          isValidating: false,
          isTouched: false,
          isDirty: false,
          isPristine: true,
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

  /**
   * @private
   */
  runValidator<
    TValue extends {
      value: TData
      fieldApi: FieldApi<any, any, any, any>
      api: APITypes
    },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FieldValidateOrFn<any, any, any, any>
      : FieldAsyncValidateOrFn<any, any, any, any>
    value: TValue
    type: TType
    // When `api` is 'field', the return type cannot be `FormValidationError`
  }): ReturnType<ReturnType<Validator<any>>[TType]> extends infer TR
    ? TR extends Promise<infer T>
      ? Promise<Exclude<T, FormValidationError<unknown>>>
      : Exclude<TR, FormValidationError<unknown>>
    : never {
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

  /**
   * Mounts the field instance to the form.
   */
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
          api: 'field',
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
      unsubscribe()
    }
  }

  /**
   * Updates the field instance with new options.
   */
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
        this.setValue(opts.defaultValue as never, {
          dontUpdateMeta: true,
        })
      } else if (formDefault !== undefined) {
        this.setValue(formDefault as never, {
          dontUpdateMeta: true,
        })
      }
    }

    // Default Meta
    if (this._getMeta() === undefined) {
      this.setMeta(this.state.meta)
    }

    this.options = opts as never
  }

  /**
   * Gets the current field value.
   * @deprecated Use `field.state.value` instead.
   */
  getValue = (): TData => {
    return this.form.getFieldValue(this.name) as TData
  }

  /**
   * Sets the field value and run the `change` validator.
   */
  setValue = (updater: Updater<TData>, options?: UpdateMetaOptions) => {
    this.form.setFieldValue(this.name, updater as never, options)
    this.validate('change')
  }

  /**
   * @private
   */
  _getMeta = () => this.form.getFieldMeta(this.name)

  /**
   * Gets the current field metadata.
   */
  getMeta = () =>
    this._getMeta() ??
    ({
      isValidating: false,
      isTouched: false,
      isDirty: false,
      isPristine: true,
      errors: [],
      errorMap: {},
      ...this.options.defaultMeta,
    } as FieldMeta)

  /**
   * Sets the field metadata.
   */
  setMeta = (updater: Updater<FieldMeta>) =>
    this.form.setFieldMeta(this.name, updater)

  /**
   * Gets the field information object.
   */
  getInfo = () => this.form.getFieldInfo(this.name)

  /**
   * Pushes a new value to the field.
   */
  pushValue = (
    value: TData extends any[] ? TData[number] : never,
    opts?: UpdateMetaOptions,
  ) => this.form.pushFieldValue(this.name, value as any, opts)

  /**
   * Inserts a value at the specified index, shifting the subsequent values to the right.
   */
  insertValue = (
    index: number,
    value: TData extends any[] ? TData[number] : never,
    opts?: UpdateMetaOptions,
  ) => this.form.insertFieldValue(this.name, index, value as any, opts)

  /**
   * Replaces a value at the specified index.
   */
  replaceValue = (
    index: number,
    value: TData extends any[] ? TData[number] : never,
    opts?: UpdateMetaOptions,
  ) => this.form.replaceFieldValue(this.name, index, value as any, opts)

  /**
   * Removes a value at the specified index.
   */
  removeValue = (index: number, opts?: UpdateMetaOptions) =>
    this.form.removeFieldValue(this.name, index, opts)

  /**
   * Swaps the values at the specified indices.
   */
  swapValues = (aIndex: number, bIndex: number, opts?: UpdateMetaOptions) =>
    this.form.swapFieldValues(this.name, aIndex, bIndex, opts)

  /**
   * Moves the value at the first specified index to the second specified index.
   */
  moveValue = (aIndex: number, bIndex: number, opts?: UpdateMetaOptions) =>
    this.form.moveFieldValues(this.name, aIndex, bIndex, opts)

  /**
   * @private
   */
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

  /**
   * @private
   */
  validateSync = (
    cause: ValidationCause,
    errorFromForm: ValidationErrorMap,
  ) => {
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
        const errorMapKey = getErrorMapKey(validateObj.cause)

        const error =
          /*
            If `validateObj.validate` is `undefined`, then the field doesn't have
            a validator for this event, but there still could be an error that
            needs to be cleaned up related to the current event left by the
            form's validator.
          */
          validateObj.validate
            ? normalizeError(
                field.runValidator({
                  validate: validateObj.validate,
                  value: {
                    value: field.getValue(),
                    api: 'field',
                    fieldApi: field,
                  },
                  type: 'validate',
                }),
              )
            : errorFromForm[errorMapKey]

        if (field.state.meta.errorMap[errorMapKey] !== error) {
          field.setMeta((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [getErrorMapKey(validateObj.cause)]:
                // Prefer the error message from the field validators if they exist
                error ? error : errorFromForm[errorMapKey],
            },
          }))
        }
        if (error || errorFromForm[errorMapKey]) {
          hasErrored = true
        }
      }

      for (const validateObj of validates) {
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

  /**
   * @private
   */
  validateAsync = async (
    cause: ValidationCause,
    formValidationResultPromise: Promise<
      FieldsErrorMapFromValidator<TParentData>
    >,
  ) => {
    const validates = getAsyncValidatorArray(cause, this.options)

    // Get the field-specific error messages that are coming from the form's validator
    const asyncFormValidationResults = await formValidationResultPromise

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
      const errorMapKey = getErrorMapKey(validateObj.cause)
      const fieldValidatorMeta = field.getInfo().validationMetaMap[errorMapKey]

      fieldValidatorMeta?.lastAbortController.abort()
      const controller = new AbortController()

      this.getInfo().validationMetaMap[errorMapKey] = {
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
                        api: 'field',
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
          if (controller.signal.aborted) return resolve(undefined)
          const error = normalizeError(rawError)
          const fieldErrorFromForm =
            asyncFormValidationResults[this.name]?.[errorMapKey]
          const fieldError = error || fieldErrorFromForm
          field.setMeta((prev) => {
            return {
              ...prev,
              errorMap: {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                ...prev?.errorMap,
                [errorMapKey]: fieldError,
              },
            }
          })

          resolve(fieldError)
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

  /**
   * Validates the field value.
   */
  validate = (
    cause: ValidationCause,
  ): ValidationError[] | Promise<ValidationError[]> => {
    // If the field is pristine, do not validate
    if (!this.state.meta.isTouched) return []

    let validationErrorFromForm: ValidationErrorMap = {}
    let formValidationResultPromise: Promise<
      FieldsErrorMapFromValidator<TParentData>
    > = Promise.resolve({})

    try {
      const formValidationResult = this.form.validate(cause)
      if (formValidationResult instanceof Promise) {
        formValidationResultPromise = formValidationResult
      } else {
        const fieldErrorFromForm = formValidationResult[this.name]
        if (fieldErrorFromForm) {
          validationErrorFromForm = fieldErrorFromForm
        }
      }
    } catch (_) {}

    // Attempt to sync validate first
    const { hasErrored } = this.validateSync(cause, validationErrorFromForm)

    if (hasErrored && !this.options.asyncAlways) {
      this.getInfo().validationMetaMap[
        getErrorMapKey(cause)
      ]?.lastAbortController.abort()
      return this.state.meta.errors
    }
    // No error? Attempt async validation
    return this.validateAsync(cause, formValidationResultPromise)
  }

  /**
   * Handles the change event.
   */
  handleChange = (updater: Updater<TData>) => {
    this.setValue(updater)
  }

  /**
   * Handles the blur event.
   */
  handleBlur = () => {
    const prevTouched = this.state.meta.isTouched
    if (!prevTouched) {
      this.setMeta((prev) => ({ ...prev, isTouched: true }))
      this.validate('change')
    }
    this.validate('blur')
  }

  /**
   * Updates the field's errorMap
   */
  setErrorMap(errorMap: ValidationErrorMap) {
    this.setMeta((prev) => ({
      ...prev,
      errorMap: {
        ...prev.errorMap,
        ...errorMap,
      },
    }))
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
