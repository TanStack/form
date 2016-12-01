import React from 'react'
//
import FormInput from '../formInput'

export default function FormInputSelect ({options, field, ...rest}) {
  return (
    <FormInput field={field}>
      {({setValue, getValue, setTouched}) => {
        const resolvedOptions = options.find(d => d.value === '') ? options : [{
          label: 'Select One...',
          value: '',
          disabled: true
        }, ...options]
        const selectedIndex = resolvedOptions.findIndex(d => d.value === getValue())
        const nullIndex = resolvedOptions.findIndex(d => d.value === '')
        return (
          <select
            {...rest}
            onChange={(e) => {
              const val = resolvedOptions[e.target.value].value
              setValue(val)
            }}
            onBlur={() => setTouched()}
            value={selectedIndex > -1 ? selectedIndex : nullIndex}
          >
            {resolvedOptions.map((option, i) => {
              return (
                <option
                  key={i}
                  value={i}
                  disabled={option.disabled}
                >
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
