import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputForm ({field, form, ...rest}) {
  const FormComponent = form
  return (
    <FormInput
      field={field}
      errorBefore
      isForm
    >
      {({setValue, getValue, getTouched, setNestedError}) => {
        return (
          <FormComponent
            {...rest}
            /* Let the parent form set defaultValues */
            values={getValue()}
            /* Respond to the parent form's dirty submission attempts */
            touched={getTouched()}
            /* Notify the parent of any nestedForm-level errors and values */
            onChange={({values, errors}, props, initial) => {
              errors ? setNestedError(true) : setNestedError(false)
              setValue(values, initial)
            }}
          />
        )
      }}
    </FormInput>
  )
}
