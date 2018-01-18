import React, { Component } from 'react'

//

import withFormField from '../withFormField'

class SelectWrapper extends Component {
  render () {
    const {
      fieldApi,
      options,
      onChange,
      onBlur,
      placeholder,
      ...rest
    } = this.props

    const { value, setValue, setTouched } = fieldApi

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

    const nullIndex = resolvedOptions.findIndex(d => d.value === '')
    const selectedIndex = resolvedOptions.findIndex(
      d => d.value === value,
    )

    return (
      <select
        {...rest}
        value={selectedIndex > -1 ? selectedIndex : nullIndex}
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

const Select = withFormField(SelectWrapper)

export default Select
