import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputTextarea ({field, showErrors, errorBefore, isForm, noTouch, ...rest}) {
  return (
    <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore} isForm={isForm}>
      {({setValue, getValue, setTouched}) => {
        return (
          <textarea
            {...rest}
            value={getValue()}
            onChange={e => {
              setValue(e.target.value, noTouch)
            }}
            onBlur={() => setTouched()}
          />
        )
      }}
    </FormInput>
  )
}
