import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputText ({field, ...rest}) {
  return (
    <FormInput field={field}>
      {({setValue, getValue, setTouched}) => {
        return (
          <input className='full'
            {...rest}
            value={getValue()}
            onChange={e => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        )
      }}
    </FormInput>
  )
}
