import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputText ({field, showErrors, errorBefore, isForm, ...rest}) {
  return (
    <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore} isForm={isForm}>
      {({setValue, getValue, setTouched}) => {
        return (
          <input
            {...rest}
            value={getValue('')}
            onChange={e => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        )
      }}
    </FormInput>
  )
}
