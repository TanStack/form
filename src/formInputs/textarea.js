import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputTextarea ({field, ...rest}) {
  return (
    <FormInput field={field}>
      {({setValue, getValue, setTouched}) => {
        return (
          <textarea
            {...rest}
            value={getValue()}
            onChange={e => {
              setValue(e.target.value)
            }}
            onBlur={() => setTouched()}
          />
        )
      }}
    </FormInput>
  )
}
