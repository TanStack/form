import type { AnyFormApi, FormValidators } from './FormApi'

export interface ValidationLogicValidatorsFn {
  fn: // TODO: Type this properly
  FormValidators<
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
  >[keyof FormValidators<any, any, any, any, any, any, any, any, any, any>]
  cause: 'change' | 'blur' | 'submit' | 'mount' | 'server' | 'dynamic'
}

export interface ValidationLogicProps {
  // TODO: Type this properly
  form: AnyFormApi
  // TODO: Type this properly
  validators:
    | FormValidators<any, any, any, any, any, any, any, any, any, any>
    | undefined
    | null
  event: {
    type: 'blur' | 'change' | 'submit' | 'mount' | 'server'
    fieldName?: string
    async: boolean
  }
  runValidation: (props: {
    validators: Array<ValidationLogicValidatorsFn | undefined>
    form: AnyFormApi
  }) => void
}

export interface RevalidateLogicProps {
  // This option allows you to configure a validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event and handleSubmit function executed). By default, re-validation occurs during the input change event.
  reValidateMode?: 'change' | 'blur' | 'submit'
  // This option allows you to configure the validation strategy before a user submits the form. The validation occurs during the onSubmit event, which is triggered by invoking the handleSubmit function.
  mode?:
    | // Validation is triggered on the change event for each input.
    'change'
    // Validation is triggered on the blur event.
    | 'blur'
    // Validation is triggered on the submit event, and inputs attach onChange event listeners to re-validate themselves.
    | 'submit'
}

/**
 * This forces a form's validation logic to be ran as if it were a React Hook Form validation logic.
 *
 * This means that it will only run the `onDynamic` validator, and it will not run any other validators and changes the validation
 * type based on the state of the form itself.
 *
 * When the form is not yet submitted, it will not run the validation logic.
 * When the form is submitted, it will run the validation logic on `change`
 */
export const revalidateLogic =
  ({ reValidateMode = 'change', mode = 'submit' }: RevalidateLogicProps = {}) =>
  (props: ValidationLogicProps) => {
    const validatorNames = Object.keys(props.validators ?? {})
    if (validatorNames.length === 0) {
      // No validators is a valid case, just return
      return props.runValidation({
        validators: [],
        form: props.form,
      })
    }

    // Allows us to clear onServer errors
    const clearValidator = { fn: () => undefined, cause: 'dynamic' } as const

    const dynamicValidator = {
      fn: props.event.async
        ? props.validators!['onDynamicAsync']
        : props.validators!['onDynamic'],
      cause: 'dynamic',
    } as const

    const validatorsToAdd = [] as ValidationLogicValidatorsFn[]

    // Submission attempts are tracked before validation occurs
    if (props.form.state.attempts[mode] <= 1) {
      if (props.event.type !== mode) {
        validatorsToAdd.push(clearValidator)
      } else {
        validatorsToAdd.push(dynamicValidator)
      }
    } else {
      // In default mode: "After submission, run validation on change events"
      if (props.event.type === reValidateMode || props.event.type === mode) {
        validatorsToAdd.push(clearValidator, dynamicValidator)
      }
    }

    let defaultValidators = [] as ValidationLogicValidatorsFn[]

    defaultValidationLogic({
      ...props,
      runValidation: (vProps) => {
        defaultValidators = vProps.validators as ValidationLogicValidatorsFn[]
      },
    })

    if (validatorsToAdd.length === 0) {
      return props.runValidation({
        validators: defaultValidators,
        form: props.form,
      })
    }

    return props.runValidation({
      validators: [...defaultValidators, ...validatorsToAdd],
      form: props.form,
    })
  }

export function defaultValidationLogic(props: ValidationLogicProps) {
  // Handle case where no validators are provided
  if (!props.validators) {
    return props.runValidation({
      validators: [],
      form: props.form,
    })
  }

  const isAsync = props.event.async

  const onMountValidator = isAsync
    ? undefined
    : ({ fn: props.validators.onMount, cause: 'mount' } as const)

  const onChangeValidator = {
    fn: isAsync ? props.validators.onChangeAsync : props.validators.onChange,
    cause: 'change',
  } as const

  const onBlurValidator = {
    fn: isAsync ? props.validators.onBlurAsync : props.validators.onBlur,
    cause: 'blur',
  } as const

  const onSubmitValidator = {
    fn: isAsync ? props.validators.onSubmitAsync : props.validators.onSubmit,
    cause: 'submit',
  } as const

  const onServerValidator = isAsync
    ? ({ fn: (props.validators as any).onServer, cause: 'server' } as const)
    : undefined

  switch (props.event.type) {
    case 'mount': {
      // Run mount validation
      return props.runValidation({
        validators: [onMountValidator],
        form: props.form,
      })
    }
    case 'submit': {
      // Run change, blur, submit, server validation
      return props.runValidation({
        validators: [
          onChangeValidator,
          onBlurValidator,
          onSubmitValidator,
          onServerValidator,
        ],
        form: props.form,
      })
    }
    case 'server': {
      // Run server validation
      return props.runValidation({
        validators: [onServerValidator],
        form: props.form,
      })
    }
    case 'blur': {
      // Run blur, server validation
      return props.runValidation({
        validators: [onBlurValidator, onServerValidator],
        form: props.form,
      })
    }
    case 'change': {
      // Run change, server validation
      return props.runValidation({
        validators: [onChangeValidator, onServerValidator],
        form: props.form,
      })
    }
    default: {
      throw new Error(`Unknown validation event type: ${props.event.type}`)
    }
  }
}
