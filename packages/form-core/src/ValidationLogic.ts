import type { AnyFormApi, FormValidators } from './FormApi'

export interface ValidationLogicProps {
  // TODO: Type this properly
  form: AnyFormApi
  // TODO: Type this properly
  validators:
  | FormValidators<any, any, any, any, any, any, any, any>
  | undefined
  | null
  event: {
    type: 'blur' | 'change' | 'submit' | 'mount' | 'server'
    fieldName?: string
    async: boolean
  }
  runValidation: (props: {
    validators: Array<
      FormValidators<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any
      >[keyof FormValidators<any, any, any, any, any, any, any, any>]
    >
    form: AnyFormApi
    // TODO: This should be on each validator
    cause?: 'change' | 'blur' | 'submit' | 'mount' | 'server' | 'dynamic'
  }) => void
}

/**
 * This forces a form's validation logic to be ran as if it were a React Hook Form validation logic.
 *
 * This means that it will only run the `onDynamic` validator, and it will not run any other validators and changes the validation
 * type based on the state of the form itself.
 *
 * When the form is not yet submitted, it will not run the validation logic.
 * When the form is submitted, it will run the validation logic on `change`
 *
 * TODO: In the future, we should allow the validation logic to be changed via a `mode` and `reValidateMode`
 *
 * TODO: This should handle async validation properly, but will currently omit it for simplicity.
 *
 * TODO: Handle field validation logic as well?
 */
export function rhfValidationLogic(props: ValidationLogicProps) {
  const validatorNames = Object.keys(props.validators ?? {})
  if (validatorNames.length === 0) {
    // No validators is a valid case, just return
    return props.runValidation({
      validators: [],
      form: props.form,
      cause: 'dynamic',
    })
  }

  // Allows us to clear onServer errors
  const clearValidator = () => undefined

  const dynamicValidator = props.event.async ? props.validators!["onDynamicAsync"] : props.validators!["onDynamic"]

  let validatorsToAdd = [] as unknown[]

  // Submission attempts are tracked before validation occurs
  if (props.form.state.submissionAttempts <= 1) {
    if (props.event.type !== 'submit') {
      validatorsToAdd.push(clearValidator);
    } else {
      validatorsToAdd.push(dynamicValidator);
    }
  } else {
    // After submission, run validation on change events
    if (props.event.type === 'change' || props.event.type === 'submit') {
      validatorsToAdd.push(clearValidator, dynamicValidator);
    }
  }

  if (validatorsToAdd.length === 0) {
    return props.runValidation({
      validators: [],
      form: props.form,
      cause: 'dynamic',
    });
  }

  return props.runValidation({
    validators: [...validatorsToAdd],
    form: props.form,
    cause: 'dynamic',
  })
}

export function defaultValidationLogic(props: ValidationLogicProps) {
  // Handle case where no validators are provided
  if (!props.validators) {
    return props.runValidation({
      validators: [],
      form: props.form,
      cause: props.event.type,
    })
  }

  const isAsync = props.event.async

  switch (props.event.type) {
    case 'mount': {
      // Run mount validation
      return props.runValidation({
        validators: isAsync ? [] : [props.validators.onMount],
        form: props.form,
        cause: props.event.type,
      })
    }
    case 'submit': {
      // Run change, blur, submit, server validation
      return props.runValidation({
        validators: isAsync
          ? [
            props.validators.onChangeAsync,
            props.validators.onBlurAsync,
            props.validators.onSubmitAsync,
          ]
          : [
            props.validators.onChange,
            props.validators.onBlur,
            props.validators.onSubmit,
            // TODO: Fix this type
            (props.validators as any).onServer,
          ],
        form: props.form,
        cause: props.event.type,
      })
    }
    case 'server': {
      // Run server validation
      return props.runValidation({
        validators: [(props.validators as any).onServer],
        form: props.form,
        cause: props.event.type,
      })
    }
    case 'blur': {
      // Run blur, server validation
      return props.runValidation({
        validators: isAsync
          ? [props.validators.onBlurAsync]
          : [props.validators.onBlur, (props.validators as any).onServer],
        form: props.form,
        cause: props.event.type,
      })
    }
    case 'change': {
      // Run change, server validation
      return props.runValidation({
        validators: isAsync
          ? [props.validators.onChangeAsync]
          : [props.validators.onChange, (props.validators as any).onServer],
        form: props.form,
        cause: props.event.type,
      })
    }
    default: {
      throw new Error(`Unknown validation event type: ${props.event.type}`)
    }
  }
}
