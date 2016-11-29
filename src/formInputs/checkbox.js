import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputCheckbox ({ field, ...rest }) {
  return (
    <FormInput field={field}>
      {({setValue, getValue, setTouched}) => {
        return (
          <input
            {...rest}
            type='checkbox'
            checked={getValue(false)}
            onChange={e => setValue(e.target.checked)}
            onBlur={() => setTouched()}
          />
        )
      }}
    </FormInput>
  )
}
