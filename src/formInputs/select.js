import React from 'react'
import FormInput from '../formInput'

export default function FormInputSelect ({
  options,
  field,
  showErrors,
  errorBefore,
  isForm,
  noTouch,
  multiple = false,
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
        var currentValue = getValue()
        let resolvedOptions = options
        if (currentValue === undefined) {
          // If the current value isn't found in the options, set it to the placeholder
          if (placeholderOption.label !== null) {
            resolvedOptions = [placeholderOption, ...options]
          }
          currentValue = resolvedOptions[0].value
        }
        return (
          <select
            {...rest}
            onChange={(e) => {
              if (!multiple) {
                setValue(e.target.value, noTouch)
                return undefined
              }
              let values = []
              let options = e.target.options
              for (let i = 0, length = options.length; i < length; i++) {
                if (options[i].selected) {
                  values.push(options[i].value)
                }
              }
              setValue(values, noTouch)
            }}
            onBlur={() => setTouched()}
            value={currentValue}
            multiple={multiple}
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
