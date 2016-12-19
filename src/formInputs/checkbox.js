import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputCheckbox ({ field, showErrors, errorBefore, isForm, noTouch, ...rest }) {
  return (
    <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore} isForm={isForm}>
      {({setValue, getValue, setTouched}) => {
        return (
          <input
            {...rest}
            type='checkbox'
            checked={getValue(false)}
            onChange={e => setValue(e.target.checked, noTouch)}
            onBlur={() => setTouched()}
          />
        )
      }}
    </FormInput>
  )
}
