import { batch, createStore } from '@tanstack/store'
import type { FormApi, FormListeners } from './FormApi'
import type { Store } from '@tanstack/store'
import type { FieldValidators } from './FieldApi'
import type { ValidationCause, ValidationError } from './types'

/**
 * An object representing the current state of the form group.
 */
type BaseFormGroupState = {
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
