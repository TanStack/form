import React, { Component } from 'react'

//

import withFormField from '../withFormField'

class RadioComp extends Component {
  render () {
    const {
      fieldApi: { getValue, setValue, setTouched },
      onClick,
      group,
      value,
      onChange,
      onBlur,
      ...rest
    } = this.props

    return (
      <input
        {...rest}
        checked={getValue() === value}
        onChange={e => {
          if (!e.target.checked) {
            return
          }
          setValue(value)
          if (onChange) {
            onChange(value, e)
          }
          if (onClick) {
            onClick(e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
        type="radio"
      />
    )
  }
}

const Radio = withFormField(RadioComp)

export default Radio
