import React, { Component } from 'react'

//

import withField from '../withField'

class SelectWrapper extends Component {
  render () {
    const {
      fieldApi: { value, setValue, setTouched },
      options,
      onChange,
      onBlur,
      placeholder,
      initalValue,
      ...rest
    } = this.props

    const resolvedOptions = options.find(d => d.value === '') || placeholder === false
      ? options
      : [
        {
          label: placeholder || 'Select One...',
          value: '',
          disabled: true
        },
        ...options
      ]

    const nullIndex = resolvedOptions.findIndex(d => d.value === '')
    const selectedIndex = resolvedOptions.findIndex(d => d.value === value)
    const initialIndex = resolvedOptions.findIndex(d => d.value === initalValue)
    if (selectedIndex <= -1 && initialIndex > -1) {
      const val = resolvedOptions[initialIndex].value
      setValue(val)
    }

    return (
      <select
        {...rest}
        value={selectedIndex > -1 ? selectedIndex : initialIndex > -1 ? initialIndex : nullIndex}
        onChange={e => {
          const val = resolvedOptions[e.target.value].value
          setValue(val)
          if (onChange) {
            onChange(val, e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
      >
        {resolvedOptions.map((option, i) => (
          <option key={option.value} value={i} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
}

const Select = withField(SelectWrapper)

export default Select
