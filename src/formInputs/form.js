import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputForm ({field, component, ...rest}) {
  const FormComponent = component
  return (
    <FormInput field={field}>
      {({setValue, getValue, getTouched}) => {
        return (
          <FormComponent
            {...rest}
            /* Let the parent form set defaultValues */
            values={getValue()}
            /* Respond to the parent form's dirty submission attempts */
            touched={getTouched()}
            /* Update the parent form with any values and errors */
            onChange={({values, errors}) => {
              setValue(errors ? undefined : values)
            }}
          />
        )
      }}
    </FormInput>
  )
}
