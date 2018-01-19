import React, { Component } from 'react'

//

import withField from '../withField'

class RadioComp extends Component {
  render () {
    const {
      fieldApi: { value, setValue, setTouched },
      onClick,
      group,
      value: parentValue,
      onChange,
      onBlur,
      ...rest
    } = this.props

    return (
      <input
        {...rest}
        checked={parentValue === value}
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

const Radio = withField(RadioComp)

export default Radio
