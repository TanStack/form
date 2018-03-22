import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withRadioGroup from '../withRadioGroup'

//

class Radio extends Component {

  static contextTypes = {
    reactFormGroup: PropTypes.object,
  }

  render () {
    const {
      // Radio props
      onChange,
      onBlur,
      value,
      // RadioGroup props
      radioGroup: {
        setValue,
        setTouched,
        value: groupValue,
        onChange: groupOnChange,
        onBlur: groupOnBlur,
      },
      ...rest
    } = this.props

    return (
      <input
        {...rest}
        value={value}
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

export default withRadioGroup(Radio)
