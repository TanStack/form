import React, { Component } from 'react'

//

import withFormField from '../withFormField'

class TextWrapper extends Component {
  render () {
    const { fieldApi, onChange, onBlur, ...rest } = this.props

    const { getValue, setValue, setTouched } = fieldApi

    return (
      <input
        {...rest}
        value={getValue() || ''}
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

const Text = withFormField(TextWrapper)

export default Text
