import React, { Component } from 'react'

//

import withFormField from '../withFormField'

class CheckboxWrapper extends Component {
  render () {
    const { value, setValue, setTouched, onChange, onBlur, ...rest } = this.props

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

const Checkbox = withFormField(CheckboxWrapper)

export default Checkbox
