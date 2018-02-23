import React, { Component } from 'react'

//

import withField from '../withField'

class TextWrapper extends Component {
  render () {
    const { fieldApi: { value, setValue, setTouched }, onChange, onBlur, ...rest } = this.props

    let value = getValue();

    if (!value && value !== 0) {
      value = '';
    }

    return (
      <input
        {...rest}
        value={!value && value !== 0 ? '' : value}
        onChange={e => {
          setValue(e.target.value)
          if (onChange) {
            onChange(e.target.value, e)
          }
        }}
        onBlur={e => {
          setTouched()
          if (onBlur) {
            onBlur(e)
          }
        }}
      />
    )
  }
}

const Text = withField(TextWrapper)

export default Text
