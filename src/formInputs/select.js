import React from 'react'
import FormInput from '../formInput'

export default function FormInputSelect ({
  options,
  field,
  showErrors,
  errorBefore,
  isForm,
  noTouch,
  placeholder = 'Select One...',
  ...rest
}) {
  const placeholderOption = {
    label: placeholder,
    value: 'null',
    disabled: true
  }

  return (
    <FormInput field={field} showErrors={showErrors} errorBefore={errorBefore} isForm={isForm}>
      {({setValue, getValue, setTouched}) => {
        const currentValue = getValue()
        let selectedIndex = options.findIndex(d => d.value === currentValue)
        let resolvedOptions = options
        if (selectedIndex === -1) {
          // If the current value isn't found in the options, set it to the placeholder
          resolvedOptions = [placeholderOption, ...options]
          selectedIndex = 0
        }
        return (
          <select
            {...rest}
            onChange={(e) => {
              setValue(e.target.value, noTouch)
            }}
            onBlur={() => setTouched()}
            value={resolvedOptions[selectedIndex].value}
          >
            {resolvedOptions.map((option, i) => {
              return (
                <option
                  key={i}
                  value={option.value}
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
