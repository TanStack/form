import React, { Component } from 'react'
import PropTypes from 'prop-types'

//

class Radio extends Component {

  static contextTypes = {
    reactFormGroup: PropTypes.object,
  }

  render () {
    const {
      onChange,
      onBlur,
      value,
      ...rest
    } = this.props

    const {
      setValue,
      setTouched,
      value: groupValue,
      onChange: groupOnChange,
      onBlur: groupOnBlur,
    } = this.context.reactFormGroup

    return (
      <input
        {...rest}
        checked={groupValue === value}
        onChange={e => {
          if (!e.target.checked) {
            return
          }
          setValue(value)
          if (onChange) {
            onChange(e)
          }
          if (groupOnChange) {
            groupOnChange(e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
          if (groupOnBlur) {
            groupOnBlur(e)
          }
        }}
        type="radio"
      />
    )
  }
}

export default Radio
