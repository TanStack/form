import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputSelect ({options, field, ...rest}) {
  return (
    <FormInput field={field}>
      {({setValue, getValue, setTouched}) => {
        const value = options.findIndex(d => d.value === getValue())
        return (
          <select
            {...rest}
            onChange={(e) => {
              const val = options[e.target.value].value
              setValue(val)
            }}
            onBlur={() => setTouched()}
            value={typeof value !== 'undefined' ? value : options[0].value}
          >
            {options.map((option, i) => {
              return (
                <option
                  key={i}
                  value={i}>
                  {option.label}
                </option>
              )
            })}
          </select>
        )
      }}
    </FormInput>
  )
}
