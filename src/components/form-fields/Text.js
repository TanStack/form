import React, { Component } from 'react'

//

import withFormField from '../withFormField'

class TextWrapper extends Component {
  render () {
    const { value, setValue, setTouched, onChange, onBlur, ...rest } = this.props

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

const Text = withFormField(TextWrapper)

export default Text
