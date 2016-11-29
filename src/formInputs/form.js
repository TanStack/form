import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputForm ({field, form, ...rest}) {
  const FormComponent = form
  return (
    <FormInput field={field}>
      {({setValue, getValue, getTouched}) => {
        return (
          <FormComponent
            {...rest}
            /* Let the parent form set defaultValues */
            values={getValue(undefined, true)}
            /* Respond to the parent form's dirty submission attempts */
            touched={getTouched()}
            /* Update the parent form with data if there are no errors */
            onChange={({values, errors}) => {
              setValue(errors ? undefined : values)
            }}
          />
        )
      }}
    </FormInput>
  )
}
