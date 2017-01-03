import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputRadio ({ field, value, showErrors, errorBefore, isForm, noTouch, ...rest }) {
  return (
    <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore} isForm={isForm}>
      {({setValue, getValue, setTouched}) => {
        return (
          <input
            {...rest}
            type="radio"
            checked={getValue(false) === value}
            onClick={e => setValue(value, noTouch)}
            onBlur={() => setTouched()}
          />
        )
      }}
    </FormInput>
  )
}
