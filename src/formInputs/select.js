import React from 'react'
//
import { buildHandler } from './util'
import FormInput from '../formInput'

export default function FormInputSelect ({
  options,
  field,
  showErrors,
  errorBefore,
  onChange,
  onBlur,
  isForm,
  noTouch,
  errorProps,
  placeholder,
  multiple,
  ...rest
}) {
  return (
    <FormInput
      field={field}
      showErrors={showErrors}
      errorBefore={errorBefore}
      isForm={isForm}
      errorProps={errorProps}
      multiple={false}
    >
      {({ setValue, getValue, setTouched }) => {
        const resolvedOptions = options.find(d => d.value === '')
          ? options
          : [
            {
              label: placeholder || 'Select One...',
              value: '',
              disabled: true,
            },
            ...options,
          ]
        const selectedIndex = resolvedOptions.findIndex(
          d => d.value === getValue()
        )

        const allSelectedIndex = resolvedOptions.reduce((filtered, option, i) => (
          getValue() && getValue().includes(option.value) ? [...filtered, i] : filtered
        ), [])

        const nullIndex = resolvedOptions.findIndex(d => d.value === '')
        return (
          <select
            {...rest}
            onChange={buildHandler(onChange, e => {
              const val = resolvedOptions[e.target.value].value
              if (getValue() === undefined || !multiple) {
                return setValue(multiple ? [val] : val, noTouch)
              }

              let selectedValues = []
              for (let item of e.target.options) {
                if (item.selected && item.value !== '') {
                  selectedValues.push(resolvedOptions[item.value].value)
                }
              }

              setValue(selectedValues, noTouch)
            })}
            onBlur={buildHandler(onBlur, () => setTouched())}
            value={multiple ? allSelectedIndex : (selectedIndex > -1 ? selectedIndex : nullIndex)}
            multiple={multiple}
          >
            {resolvedOptions.map((option, i) => {
              return (
                <option key={option.value} value={i} disabled={option.disabled}>
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
