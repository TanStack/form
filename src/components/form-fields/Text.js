import React, { Component } from 'react'

//

import withField from '../withField'

class TextWrapper extends Component {
  render () {
    const { fieldApi: { value, setValue, setTouched }, onChange, onBlur, ...rest } = this.props

    return (
      <input
        {...rest}
        value={value || ''}
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
