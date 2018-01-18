import React from 'react'

//

import withFormField from '../withFormField'

const NestedFormWrapper = props => {
  const { children, fieldApi } = props

  const {
    setValue,
    setError,
    setWarning,
    setSuccess,
    setTouched,
    submitted,
    submits,
    validatingField,
    doneValidatingField,
    registerAsyncValidation,
    reset,
  } = fieldApi

  return React.cloneElement(children, {
    // We pass down the fact that the parent form was submitted to the nested form
    submitted,
    submits,
    reset,
    // Update is an internal method that is used to update the parent form
    update: ({
      values,
      errors,
      successes,
      warnings,
      touched,
      asyncValidations,
    }) => {
      const invalid = errors ? Object.keys(errors).some(k => errors[k]) : false
      const success = successes
        ? Object.keys(successes).some(k => successes[k])
        : false
      const warning = warnings
        ? Object.keys(warnings).some(k => warnings[k])
        : false

      setValue(values)
      setTouched(touched)
      setError(invalid ? errors : null)
      setWarning(warning ? warnings : null)
      setSuccess(success ? successes : null)
      if (asyncValidations > 0) {
        validatingField()
      } else {
        doneValidatingField()
      }
    },
    registerAsyncValidation,
  })
}

const NestedForm = withFormField(NestedFormWrapper)

export default NestedForm
