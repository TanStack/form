import { batch, createStore } from '@tanstack/store'
import { getSyncValidatorArray } from './utils'
import { defaultValidationLogic } from './ValidationLogic'
import {
  isStandardSchemaValidator,
  standardSchemaValidators,
} from './standardSchemaValidator'
import type { ValidationLogicFn } from './ValidationLogic'
import type { TStandardSchemaValidatorValue } from './standardSchemaValidator'
import type {
  FieldValidators,
  UnwrapFieldAsyncValidateOrFn,
  UnwrapFieldValidateOrFn,
} from './FieldApi'
import type {
  ValidationCause,
  ValidationError,
  ValidationErrorMap,
} from './types'
import type {
  AnyFormApi,
  FormApi,
  FormAsyncValidateOrFn,
  FormListeners,
  FormValidateFn,
  FormValidateOrFn,
} from './FormApi'
import type { Store } from '@tanstack/store'

/**
 * TODO: Add derived state for `errors` array derived from `errorMap`
 */

/**
 * An object representing the current state of the form group.
 */
type BaseFormGroupState = {
  /**
   * The error map for the group itself.
   */
  errorMap: ValidationErrorMap<
    UnwrapFieldValidateOrFn</* TName, TOnMount, TFormOnMount */ any, any, any>,
    UnwrapFieldValidateOrFn<
      /* TName, TOnChange, TFormOnChange */ any,
      any,
      any
    >,
    UnwrapFieldAsyncValidateOrFn<
      /* TName, TOnChangeAsync, TFormOnChangeAsync */ any,
      any,
      any
    >,
    UnwrapFieldValidateOrFn</* TName, TOnBlur, TFormOnBlur */ any, any, any>,
    UnwrapFieldAsyncValidateOrFn<
      /* TName, TOnBlurAsync, TFormOnBlurAsync */ any,
      any,
      any
    >,
    UnwrapFieldValidateOrFn<
      /* TName, TOnSubmit, TFormOnSubmit */ any,
      any,
      any
    >,
    UnwrapFieldAsyncValidateOrFn<
      /* TName, TOnSubmitAsync, TFormOnSubmitAsync */ any,
      any,
      any
    >,
    UnwrapFieldValidateOrFn<
      /* TName, TOnDynamic, TFormOnDynamic */ any,
      any,
      any
    >,
    UnwrapFieldAsyncValidateOrFn<
      /* TName, TOnDynamicAsync, TFormOnDynamicAsync */ any,
      any,
      any
    >
  >
  isSubmitting: boolean
  /**
   * A boolean indicating if the `onSubmit` function has completed successfully.
   *
   * Goes back to `false` at each new submission attempt.
   *
   * Note: you can use isSubmitting to check if the form is currently submitting.
   */
  isSubmitted: boolean
  /**
   * A boolean indicating if the form or any of its fields are currently validating.
   */
  isValidating: boolean
  /**
   * A counter for tracking the number of submission attempts.
   */
  submissionAttempts: number
  /**
   * A boolean indicating if the last submission was successful.
   */
  isSubmitSuccessful: boolean
}

function getDefaultFormGroupState(
  defaultState: Partial<BaseFormGroupState>,
): BaseFormGroupState {
  return {
    // TODO: I think we need to handle the scenario where a Group is rendered for the first time and needs to inherit errors from the initial state of the fields...
    //  Maybe?
    //
    // TODO: Wait, but that doesn't make sense, because in JSX it would render the form group before the fields initialize and generate errors from the initial state of the fields...
    //  So we might need to use another derived state for errorMaps to merge with the form + fields? Ugh. I can't wait for v2 to simplify our error handling drastically.
    errorMap: defaultState.errorMap ?? {},
    isSubmitted: defaultState.isSubmitted ?? false,
    isSubmitting: defaultState.isSubmitting ?? false,
    isValidating: defaultState.isValidating ?? false,
    submissionAttempts: defaultState.submissionAttempts ?? 0,
    isSubmitSuccessful: defaultState.isSubmitSuccessful ?? false,
  }
}

interface FormGroupOptions<TName> {
  name: TName
  onGroupSubmit?: (props: {
    value: unknown
    formApi: FormApi<any, any, any, any, any, any, any, any, any, any, any>
    meta: unknown
  }) => any | Promise<any>
  onGroupSubmitInvalid?: (props: {
    value: unknown
    formApi: FormApi<any, any, any, any, any, any, any, any, any, any, any>
    meta: unknown
  }) => void
  validators?: FieldValidators<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >

  validationLogic?: ValidationLogicFn

  /**
   * A list of listeners which attach to the corresponding events
   */
  listeners?: FormListeners<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >

  // TODO: Does this even make sense to be here given that fields should inform the default state of a group?
  /**
   * The default state for the form group.
   */
  defaultState?: Partial<BaseFormGroupState>
}

interface FormGroupApiOptions<TName> extends FormGroupOptions<TName> {
  form: FormApi<any, any, any, any, any, any, any, any, any, any, any>
}

export class FormGroupApi {
  options!: FormGroupApiOptions<string>

  baseStore!: Store<BaseFormGroupState>

  get state() {
    return this.baseStore.state
  }

  constructor(opts?: FormGroupApiOptions<string>) {
    this.handleSubmit = this.handleSubmit.bind(this)

    const baseStoreVal: BaseFormGroupState = getDefaultFormGroupState({
      ...(opts?.defaultState as any),
    })

    this.baseStore = createStore(baseStoreVal) as never

    this.update(opts)
  }

  update = (options?: FormGroupApiOptions<string>) => {
    if (!options) return

    this.options = options
  }

  mount() {
    return () => {}
  }

  _isFieldNamePartOfGroup = (fieldName: string) => {
    // TODO: Does this `startWith` capture sub-field names properly? Probably not. :(
    return fieldName.startsWith(this.options.name)
  }

  _getRelatedFieldInfos = () => {
    return Object.entries(this.options.form.fieldInfo).reduce(
      (prev, [fieldName, fieldInfo]) => {
        if (this._isFieldNamePartOfGroup(fieldName) && fieldInfo) {
          prev[fieldName] = fieldInfo
        }
        return prev
      },
      {} as typeof this.options.form.fieldInfo,
    )
  }

  _isFieldsValid = () => {
    return Object.values(this._getRelatedFieldInfos()).every(
      (field) => field && field.instance && field.instance.state.meta.isValid,
    )
  }

  /**
   * Validates all fields using the correct handlers for a given validation cause.
   */
  validateAllFields = async (cause: ValidationCause) => {
    const fieldValidationPromises: Promise<ValidationError[]>[] = [] as any
    batch(() => {
      void Object.values(this._getRelatedFieldInfos()).forEach((field) => {
        if (!field || !field.instance) return
        const fieldInstance = field.instance
        // Validate the field
        fieldValidationPromises.push(
          // Remember, `validate` is either a sync operation or a promise
          Promise.resolve().then(() =>
            fieldInstance.validate(cause, { skipFormValidation: true }),
          ),
        )
        // If any fields are not touched
        if (!field.instance.state.meta.isTouched) {
          // Mark them as touched
          field.instance.setMeta((prev) => ({ ...prev, isTouched: true }))
        }
      })
    })

    const fieldErrorMapMap = await Promise.all(fieldValidationPromises)
    return fieldErrorMapMap.flat()
  }

  /**
   * @private
   */
  runValidator<
    TValue extends TStandardSchemaValidatorValue<any /* TFormData */> & {
      formApi: AnyFormApi
    },
    TType extends 'validate' | 'validateAsync',
  >(props: {
    validate: TType extends 'validate'
      ? FormValidateOrFn<any /* TFormData */>
      : FormAsyncValidateOrFn<any /* TFormData */>
    value: TValue
    type: TType
  }): unknown {
    if (isStandardSchemaValidator(props.validate)) {
      return standardSchemaValidators[props.type](
        props.value,
        props.validate,
      ) as never
    }

    return (props.validate as FormValidateFn<any>)(props.value) as never
  }

  /**
   * TODO: This code is mostly copied from FormApi, we should refactor to share
   *
   * This does not need to validate fields or the base form, as that's done elsewhere
   *
   * @private
   */
  validateSync = (cause: ValidationCause) => {
    const validates = getSyncValidatorArray(cause, {
      ...this.options,
      form: this,
      validationLogic: this.options.validationLogic || defaultValidationLogic,
    })

    let hasErrored = false as boolean

    batch(() => {
      for (const validateObj of validates) {
        if (!validateObj.validate) continue

        const rawError = this.runValidator({
          validate: validateObj.validate,
          value: {
            value: 0 /* this.state.values */,
            formApi: this.options.form as never,
            validationSource: 'field',
          },
          type: 'validate',
        })

        // TODO: Support form group error maps like so:
        /*
        {
          group: "Error on group",
          fields: {
            firstName: "Other error"
          }
        }
         */
        // const { formError, fieldErrors } = normalizeError<TFormData>(rawError)

        const groupError = normalizeError(rawError)
        const errorMapKey = getErrorMapKey(validateObj.cause)

        if (this.state.errorMap[errorMapKey] !== groupError) {
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: groupError,
            },
          }))
        }

        if (groupError /* || fieldErrors */) {
          hasErrored = true
        }
      }

      /**
       *  when we have an error for onSubmit in the state, we want
       *  to clear the error as soon as the user enters a valid value in the field
       */
      const submitErrKey = getErrorMapKey('submit')
      if (
        this.state.errorMap[submitErrKey] &&
        cause !== 'submit' &&
        !hasErrored
      ) {
        this.baseStore.setState((prev) => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            [submitErrKey]: undefined,
          },
        }))
      }

      /**
       *  when we have an error for onServer in the state, we want
       *  to clear the error as soon as the user enters a valid value in the field
       */
      const serverErrKey = getErrorMapKey('server')
      if (
        this.state.errorMap[serverErrKey] &&
        cause !== 'server' &&
        !hasErrored
      ) {
        this.baseStore.setState((prev) => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            [serverErrKey]: undefined,
          },
        }))
      }
    })

    return { hasErrored }
  }

  /**
   * @private
   */
  validate = (
    cause: ValidationCause,
    // TODO: Handle return type?
  ) => {
    // Attempt to sync validate first
    const { hasErrored /* fieldsErrorMap */ } = this.validateSync(cause)

    if (hasErrored && !this.options.asyncAlways) {
      return fieldsErrorMap
    }

    // No error? Attempt async validation
    return this.validateAsync(cause)
  }

  _handleSubmit = async (): Promise<void> => {
    this.baseStore.setState((old) => ({
      ...old,
      // Submission attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
      isSubmitSuccessful: false, // Reset isSubmitSuccessful at the start of submission
    }))

    batch(() => {
      void Object.values(this._getRelatedFieldInfos()).forEach((field) => {
        if (!field || !field.instance) return
        // If any fields are not touched
        if (!field.instance.state.meta.isTouched) {
          // Mark them as touched
          field.instance.setMeta((prev) => ({ ...prev, isTouched: true }))
        }
      })
    })

    // // TODO: Add support for meta
    // const submitMetaArg =
    //   submitMeta ?? (this.options.onSubmitMeta as TSubmitMeta)

    this.baseStore.setState((d) => ({ ...d, isSubmitting: true }))

    const done = () => {
      this.baseStore.setState((prev) => ({ ...prev, isSubmitting: false }))
    }

    await this.validateAllFields('submit')

    // Fields are invalid, do not submit
    if (!this._isFieldsValid()) {
      done()

      this.options.onGroupSubmitInvalid?.({
        value: 0 /* this.state.values */,
        formApi: this.options.form,
        meta: {} as never /* submitMetaArg */,
      })

      return
    }

    await this.options.form.validate('submit', {
      dontUpdateFormErrorMap: true,
      filterFieldNames: this._isFieldNamePartOfGroup as never,
    })

    // Form is invalid, do not submit
    if (!this.options.form.state.isValid) {
      done()

      this.options.onGroupSubmitInvalid?.({
        value: 0 /* this.state.values */,
        formApi: this.options.form,
        meta: {} as never /* submitMetaArg */,
      })

      return
    }

    // TODO: Handle validators on the FormGroup itself
    // await this.validate('submit')
    //
    // if (!this.state.isValid) {
    //   done()
    //
    //   this.options.onGroupSubmitInvalid?.({
    //     value: 0 /* this.state.values */,
    //     formApi: this.options.form,
    //     meta: {} as never /* submitMetaArg */,
    //   })
    //
    //   return
    // }

    batch(() => {
      void Object.values(this._getRelatedFieldInfos()).forEach((field) => {
        if (!field || !field.instance) return
        field.instance.options.listeners?.onGroupSubmit?.({
          value: field.instance.state.value,
          fieldApi: field.instance,
        })
      })
    })

    this.options.listeners?.onSubmit?.({
      formApi: this.options.form,
      meta: {} as never /* submitMetaArg */,
    })

    try {
      await this.options.onGroupSubmit?.({
        value: 0,
        formApi: this.options.form,
        meta: {},
      })

      // Run the submit code
      await this.options.onGroupSubmit?.({
        value: 0, // this.state.values,
        formApi: this.options.form,
        meta: {}, // submitMetaArg,
      })

      batch(() => {
        this.baseStore.setState((prev) => ({
          ...prev,
          isSubmitted: true,
          isSubmitSuccessful: true, // Set isSubmitSuccessful to true on successful submission
        }))

        done()
      })
    } catch (err) {
      this.baseStore.setState((prev) => ({
        ...prev,
        isSubmitSuccessful: false, // Ensure isSubmitSuccessful is false if an error occurs
      }))

      done()

      throw err
    }
  }

  handleSubmit(): Promise<void> {
    return this._handleSubmit()
  }
}

function normalizeError(rawError?: ValidationError) {
  if (rawError) {
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
    case 'dynamic':
      return 'onDynamic'
    case 'change':
    default:
      return 'onChange'
  }
}
