import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputNestedForm ({field, children, ...rest}) {
  return (
    <FormInput
      field={field}
      errorBefore
      isForm
    >
      {({setValue, getValue, getTouched, setNestedError}) => {
        if (Array.isArray(children)) {
          console.warn('NestedForm\'s only child must be a single ReactForm component. Using the first child of:', children)
          children = children[0]
        }
        return React.cloneElement(children, {
          ...rest,
          /* Let the parent form set defaultValues */
          values: getValue(),
          /* Respond to the parent form's dirty submission attempts */
          touched: getTouched(),
          /* Notify the parent of any nestedForm-level errors and values */
          onChange: ({values, errors}, props, initial) => {
            errors ? setNestedError(true) : setNestedError(false)
            setValue(values, initial)
          }
        })
      }}
    </FormInput>
  )
}
