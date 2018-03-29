import React, { Component } from 'react'

//

import withField from '../withField'

class MultiSelectWrapper extends Component {
  render () {
    const {
      fieldApi: { value, setValue, setTouched },
      options,
      onChange,
      onBlur,
      placeholder,
      ...rest
    } = this.props

    const resolvedOptions = options
    let selectedIndex = value || []
    resolvedOptions.map(d => typeof value !== 'undefined' && value.indexOf(d) !== -1 ? selectedIndex.concat(value) : '')

    return (
      <select
        {...rest}
        multiple
        value={selectedIndex}
        onChange={e => {
          const value = e.target.value
          if (selectedIndex.indexOf(value) === -1) {
            selectedIndex = selectedIndex.concat(value)
          } else {
            selectedIndex = selectedIndex.filter(d => d !== value)
          }
          setValue(selectedIndex)
          if (onChange) {
            onChange(value, e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
      >
        {
          resolvedOptions.map(option => (<option key={option} value={option}>{option}</option>))
        }
      </select>
    )
  }
}

const MultiSelect = withField(MultiSelectWrapper)

export default MultiSelect
