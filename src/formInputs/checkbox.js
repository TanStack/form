import React from 'react'
//
import { buildHandler } from './util'
import FormInput from '../formInput'

export default function FormInputCheckbox ({
  field,
  showErrors,
  errorBefore,
  onChange,
  onBlur,
  isForm,
  noTouch,
  inputRef,
  ...rest
}) {
  return (
    <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore} isForm={isForm}>
      {({setValue, getValue, setTouched}) => {
        return (
          <input
            {...rest}
            ref={inputRef}
            type='checkbox'
            checked={getValue(false)}
            onChange={buildHandler(onChange, e => setValue(e.target.checked, noTouch))}
            onBlur={buildHandler(onBlur, () => setTouched())}
          />
        )
      }}
    </FormInput>
  )
}
