import React, { Component } from 'react'

//

import withField from '../withField'

class CheckboxWrapper extends Component {
  render () {
    const { fieldApi: { value, setValue, setTouched }, onChange, onBlur, ...rest } = this.props

    return (
      <input
        {...rest}
        checked={!!value}
        onChange={e => {
          setValue(e.target.checked)
          if (onChange) {
            onChange(e.target.checked, e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
        type="checkbox"
      />
    )
  }
}

const Checkbox = withField(CheckboxWrapper)

export default Checkbox
