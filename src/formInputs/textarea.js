import React from 'react'
//
import { buildHandler } from './util'
import FormInput from '../formInput'

export default function FormInputTextarea ({
  field,
  showErrors,
  errorBefore,
  onChange,
  onBlur,
  isForm,
  noTouch,
  errorProps,
  ...rest
}) {
  return (
    <FormInput
      field={field}
      showErrors={showErrors}
      errorBefore={errorBefore}
      isForm={isForm}
      errorProps={errorProps}
    >
      {({ setValue, getValue, setTouched }) => {
        return (
          <textarea
            {...rest}
            value={getValue()}
            onChange={buildHandler(onChange, e =>
              setValue(e.target.value, noTouch)
            )}
            onBlur={buildHandler(onBlur, () => setTouched())}
          />
        )
      }}
    </FormInput>
  )
}
